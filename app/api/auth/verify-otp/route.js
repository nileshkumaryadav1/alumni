// /api/auth/verify-otp (app route)
import { otpStore } from "@/utils/otpStore";
import Student from "@/models/Student";
import connectDB from "@/utils/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

/* Helpers (must be consistent with send-otp) */
function normalizeKey({ email, phone }) {
  if (email) return email.toLowerCase().trim();
  if (phone) return phone.replace(/\D/g, "").trim();
  return null;
}
function normalizePhone(phone) {
  return phone ? phone.replace(/\D/g, "").trim() : "";
}
function maskEmail(e) {
  try {
    const [local, domain] = e.split("@");
    if (!local || !domain) return e;
    const keep = Math.min(2, local.length);
    const maskedLocal =
      local.slice(0, keep) + "*".repeat(Math.max(0, local.length - keep));
    return `${maskedLocal}@${domain}`;
  } catch {
    return e;
  }
}
function safeStudentObject(studentDoc) {
  const obj = studentDoc.toObject ? studentDoc.toObject() : { ...studentDoc };
  delete obj.password;
  return obj;
}
function generateUniqueId(name = "user", phone = "") {
  const firstName = (name || "user").trim().split(" ")[0].toLowerCase();
  const digits = (phone || "").replace(/\D/g, "");
  const last10 =
    digits.length >= 10
      ? digits.slice(-10)
      : Math.floor(1000 + Math.random() * 9000).toString();
  return `${firstName}${last10}`;
}

/* Main handler */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name,
      email,
      phone,
      role = "student",
      college,
      year,
      branch,
      batch,
      jobTitle,
      company,
      linkedin,
      password,
      otp,
      type = "register", // "register" | "reset"
    } = body || {};

    // Basic presence check
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ message: "Email or phone is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Normalize key to lookup OTP
    const key = normalizeKey({ email, phone });
    if (!key) {
      return new Response(
        JSON.stringify({ message: "Invalid email or phone" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!otp) {
      return new Response(JSON.stringify({ message: "OTP is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check OTP using normalized key
    const stored = otpStore[key];
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return new Response(
        JSON.stringify({ message: "Invalid or expired OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // PASSWORD RESET FLOW
    if (type === "reset") {
      // Find student by normalized email or phone
      const normalizedEmail = email ? email.toLowerCase().trim() : null;
      const normalizedPhone = phone ? normalizePhone(phone) : null;

      let student = null;
      if (normalizedEmail)
        student = await Student.findOne({ email: normalizedEmail });
      if (!student && normalizedPhone)
        student = await Student.findOne({ phone: normalizedPhone });

      if (!student) {
        return new Response(
          JSON.stringify({ message: "Student not found for password reset" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      if (!password) {
        return new Response(
          JSON.stringify({ message: "New password is required for reset" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const hashed = await bcrypt.hash(password, 10);
      student.password = hashed;
      await student.save();

      // Clear OTP
      delete otpStore[key];

      // Send confirmation email if possible (silently skip if SMTP not configured)
      if (student.email) {
        if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
          try {
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
              },
            });
            await transporter.sendMail({
              from: `"Management Team" <${process.env.SMTP_EMAIL}>`,
              to: student.email,
              subject: "Your password has been reset",
              text: `Hi ${student.name}, your password was successfully reset.`,
            });
          } catch (err) {
            console.warn("Password reset email send failed (non-fatal):", err);
          }
        } else {
          console.debug(
            "SMTP not configured - skipping reset confirmation email."
          );
        }
      }

      const safe = safeStudentObject(student);
      return new Response(
        JSON.stringify({ message: "Password reset successful", student: safe }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // -------------------
    // REGISTRATION FLOW
    // -------------------

    // Require password & name for registration
    if (!password) {
      return new Response(
        JSON.stringify({ message: "Password is required for registration" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!name) {
      return new Response(
        JSON.stringify({ message: "Name is required for registration" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check duplicates by email or phone
    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    const normalizedPhone = phone ? normalizePhone(phone) : null;

    if (normalizedEmail) {
      const exists = await Student.findOne({ email: normalizedEmail }).select(
        "_id"
      );
      if (exists) {
        return new Response(
          JSON.stringify({ message: "Email already in use" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    if (normalizedPhone) {
      const existsP = await Student.findOne({ phone: normalizedPhone }).select(
        "_id"
      );
      if (existsP) {
        return new Response(
          JSON.stringify({ message: "Phone already in use" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Prepare student data
    const uniqueId = generateUniqueId(name, normalizedPhone || "");
    const hashedPassword = await bcrypt.hash(password, 10);

    const studentData = {
      name: name.trim(),
      email: normalizedEmail || undefined,
      password: hashedPassword,
      phone: normalizedPhone || undefined,
      role: role === "alumni" ? "alumni" : "student",
      uniqueId,
      registeredEvents: [],
      events: [],
      hasPaid: false,
      amountPaid: 0,
      paymentDate: null,
    };

    if (studentData.role === "student") {
      if (college) studentData.college = college.trim();
      if (year) studentData.year = year.trim();
      if (branch) studentData.branch = branch.trim();
    } else {
      if (batch) studentData.batch = batch.trim();
      if (jobTitle) studentData.jobTitle = jobTitle.trim();
      if (company) studentData.company = company.trim();
      if (linkedin) studentData.linkedin = linkedin.trim();
    }

    // Create student
    let student;
    try {
      student = await Student.create(studentData);
    } catch (err) {
      // Handle unique index errors (race conditions)
      console.error("Student create error:", err);
      if (err?.code === 11000) {
        // Parse which field
        const dupField =
          Object.keys(err.keyValue || {})[0] || "duplicate field";
        return new Response(
          JSON.stringify({ message: `Duplicate ${dupField}` }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      throw err;
    }

    // Clear OTP after registration
    delete otpStore[key];

    // Send Welcome Email (best-effort)
    if (student.email) {
      if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASSWORD,
            },
          });

          const htmlBody =
            student.role === "student"
              ? `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #f4f6f8; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4A90E2; margin: 0;">🎓 Fest ${new Date().getFullYear()}</h1>
          <p style="color: #555; font-size: 14px; margin: 4px 0;">Student Management & Event System</p>
        </div>

        <!-- Body -->
        <h2 style="color: #4A90E2;">Welcome, ${student.name} 🎉</h2>
        <p style="font-size: 16px;">Thanks for registering for <b>Fest ${new Date().getFullYear()}</b>! Below are your details:</p>
        
        <!-- Info Card -->
        <div style="margin: 16px 0; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <p style="margin: 6px 0;"><b>College:</b> ${
            student.college || "—"
          }</p>
          <p style="margin: 6px 0;"><b>Branch:</b> ${student.branch || "—"}</p>
          <p style="margin: 6px 0;"><b>Year:</b> ${student.year || "—"}</p>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://alumni-manage-system.vercel.app/dashboard" 
             style="display: inline-block; padding: 12px 20px; background: #4A90E2; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
             Go to Dashboard
          </a>
        </div>

        <!-- Footer -->
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-align: center;">
          This is an automated email from the Student Management & Event System.<br/>
          If you did not register, please ignore this message.
        </p>
      </div>
    `
              : `
      <div style="font-family: Arial, sans-serif; padding: 24px; background: #f4f6f8; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #4A90E2; margin: 0;">🤝 Alumni Network</h1>
          <p style="color: #555; font-size: 14px; margin: 4px 0;">Alumni Management & Engagement System</p>
        </div>

        <!-- Body -->
        <h2 style="color: #4A90E2;">Welcome, ${student.name} 🙌</h2>
        <p style="font-size: 16px;">Thanks for joining the <b>Alumni Network ${new Date().getFullYear()}</b>! Here’s your profile summary:</p>
        
        <!-- Info Card -->
        <div style="margin: 16px 0; padding: 16px; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <p style="margin: 6px 0;"><b>Batch:</b> ${student.batch || "—"}</p>
          <p style="margin: 6px 0;"><b>Company:</b> ${
            student.company || "—"
          }</p>
          <p style="margin: 6px 0;"><b>Job Title:</b> ${
            student.jobTitle || "—"
          }</p>
          <p style="margin: 6px 0;"><b>LinkedIn:</b> <a href="${
            student.linkedin || "#"
          }" 
             style="color: #4A90E2; text-decoration: none;">${
               student.linkedin || "—"
             }</a></p>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 24px;">
          <a href=""https://alumni-manage-system.vercel.app/alumni" 
             style="display: inline-block; padding: 12px 20px; background: #4A90E2; color: #fff; border-radius: 6px; text-decoration: none; font-weight: bold;">
             View Alumni Directory
          </a>
        </div>

        <!-- Footer -->
        <p style="font-size: 12px; color: #999; margin-top: 32px; text-align: center;">
          This is an automated email from the Alumni Management & Engagement System.<br/>
          If you did not sign up, please ignore this message.
        </p>
      </div>
    `;

          await transporter.sendMail({
            from: `"Management Team" <${process.env.SMTP_EMAIL}>`,
            to: student.email,
            subject: "Welcome to the Alumni & Student Network",
            html: htmlBody,
          });
        } catch (err) {
          console.warn("Welcome email failed (non-fatal):", err);
        }
      } else {
        console.debug("SMTP not configured - skipping welcome email.");
      }
    }

    const safe = safeStudentObject(student);
    return new Response(
      JSON.stringify({ message: "Registration successful", student: safe }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
