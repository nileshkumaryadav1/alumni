// /api/auth/verify-otp
import { otpStore } from "@/utils/otpStore";
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();

    const {
      name,
      email,
      phone,
      role,
      college,
      year,
      branch,
      batch,
      jobTitle,
      company,
      linkedin,
      password,
      otp,
    } = await req.json();

    // Basic validations
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ message: "Email or phone is required" }),
        { status: 400 }
      );
    }
    if (!otp) {
      return new Response(JSON.stringify({ message: "OTP is required" }), {
        status: 400,
      });
    }

    // Check OTP
    const stored = otpStore[email || phone];
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired OTP" }),
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = await Student.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ message: "Email already in use" }), {
        status: 400,
      });
    }

    // Generate festId
    const generateFestId = (name, phone) => {
      const firstName = name.trim().split(" ")[0].toLowerCase();
      const last4 = phone.slice(-4);
      const festYear = new Date().getFullYear();
      return `${firstName}${festYear}${last4}`;
    };

    const festId = generateFestId(name, phone);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare student data for DB
    const studentData = {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      festId,
      registeredEvents: [],
      events: [],
      hasPaid: false,
      amountPaid: 0,
      paymentDate: null,
    };

    if (role === "student") {
      studentData.college = college || "";
      studentData.year = year || "";
      studentData.branch = branch || "";
    } else if (role === "alumni") {
      studentData.batch = batch || "";
      studentData.jobTitle = jobTitle || "";
      studentData.company = company || "";
      studentData.linkedin = linkedin || "";
    }

    // Save student to DB
    const student = await Student.create(studentData);

    // Clear OTP from memory
    delete otpStore[email || phone];

    // Send Welcome Email
    if (email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Management Team" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Welcome to the Alumni Student & College Relationship system!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; background: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
            ${
              role === "student"
                ? `<p>We’re excited to have you join <b>Fest ${new Date().getFullYear()}</b>!</p>
                   <ul>
                     <li><b>College:</b> ${college}</li>
                     <li><b>Branch:</b> ${branch}</li>
                     <li><b>Year:</b> ${year}</li>
                   </ul>`
                : `<p>We’re excited to have you join as an Alumni of <b>Fest ${new Date().getFullYear()}</b>!</p>
                   <ul>
                     <li><b>Batch:</b> ${batch}</li>
                     <li><b>Job Title:</b> ${jobTitle}</li>
                     <li><b>Company:</b> ${company}</li>
                     <li><b>LinkedIn:</b> ${linkedin}</li>
                   </ul>`
            }
            <p>Get ready for exciting events, mentorship, internships, and networking!</p>
            <p style="margin-top: 20px;">Cheers,</p>
            <p><b>Management Team</b></p>
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({ message: "Registration successful", student }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
