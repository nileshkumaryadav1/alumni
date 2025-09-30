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
    const maskedLocal = local.slice(0, keep) + "*".repeat(Math.max(0, local.length - keep));
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
function generateFestId(name = "user", phone = "") {
  const firstName = (name || "user").trim().split(" ")[0].toLowerCase();
  const digits = (phone || "").replace(/\D/g, "");
  const last4 = digits.length >= 4 ? digits.slice(-4) : Math.floor(1000 + Math.random() * 9000).toString();
  const festYear = new Date().getFullYear();
  return `${firstName}${festYear}${last4}`;
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
      return new Response(JSON.stringify({ message: "Email or phone is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Normalize key to lookup OTP
    const key = normalizeKey({ email, phone });
    if (!key) {
      return new Response(JSON.stringify({ message: "Invalid email or phone" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!otp) {
      return new Response(JSON.stringify({ message: "OTP is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Check OTP using normalized key
    const stored = otpStore[key];
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return new Response(JSON.stringify({ message: "Invalid or expired OTP" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // PASSWORD RESET FLOW
    if (type === "reset") {
      // Find student by normalized email or phone
      const normalizedEmail = email ? email.toLowerCase().trim() : null;
      const normalizedPhone = phone ? normalizePhone(phone) : null;

      let student = null;
      if (normalizedEmail) student = await Student.findOne({ email: normalizedEmail });
      if (!student && normalizedPhone) student = await Student.findOne({ phone: normalizedPhone });

      if (!student) {
        return new Response(JSON.stringify({ message: "Student not found for password reset" }), { status: 404, headers: { "Content-Type": "application/json" } });
      }

      if (!password) {
        return new Response(JSON.stringify({ message: "New password is required for reset" }), { status: 400, headers: { "Content-Type": "application/json" } });
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
              auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
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
          console.debug("SMTP not configured - skipping reset confirmation email.");
        }
      }

      const safe = safeStudentObject(student);
      return new Response(JSON.stringify({ message: "Password reset successful", student: safe }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    // -------------------
    // REGISTRATION FLOW
    // -------------------

    // Require password & name for registration
    if (!password) {
      return new Response(JSON.stringify({ message: "Password is required for registration" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!name) {
      return new Response(JSON.stringify({ message: "Name is required for registration" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Check duplicates by email or phone
    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    const normalizedPhone = phone ? normalizePhone(phone) : null;

    if (normalizedEmail) {
      const exists = await Student.findOne({ email: normalizedEmail }).select("_id");
      if (exists) {
        return new Response(JSON.stringify({ message: "Email already in use" }), { status: 409, headers: { "Content-Type": "application/json" } });
      }
    }
    if (normalizedPhone) {
      const existsP = await Student.findOne({ phone: normalizedPhone }).select("_id");
      if (existsP) {
        return new Response(JSON.stringify({ message: "Phone already in use" }), { status: 409, headers: { "Content-Type": "application/json" } });
      }
    }

    // Prepare student data
    const festId = generateFestId(name, normalizedPhone || "");
    const hashedPassword = await bcrypt.hash(password, 10);

    const studentData = {
      name: name.trim(),
      email: normalizedEmail || undefined,
      password: hashedPassword,
      phone: normalizedPhone || undefined,
      role: role === "alumni" ? "alumni" : "student",
      festId,
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
        const dupField = Object.keys(err.keyValue || {})[0] || "duplicate field";
        return new Response(JSON.stringify({ message: `Duplicate ${dupField}` }), { status: 409, headers: { "Content-Type": "application/json" } });
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
            auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
          });

          const htmlBody = student.role === "student"
            ? `<div style="font-family: Arial, sans-serif; padding: 20px;">
                 <h2>Welcome, ${student.name}!</h2>
                 <p>Thanks for registering for Fest ${new Date().getFullYear()}.</p>
                 <ul>
                   <li><b>College:</b> ${student.college || "—"}</li>
                   <li><b>Branch:</b> ${student.branch || "—"}</li>
                   <li><b>Year:</b> ${student.year || "—"}</li>
                 </ul>
               </div>`
            : `<div style="font-family: Arial, sans-serif; padding: 20px;">
                 <h2>Welcome, ${student.name}!</h2>
                 <p>Thanks for joining the alumni network for Fest ${new Date().getFullYear()}.</p>
                 <ul>
                   <li><b>Batch:</b> ${student.batch || "—"}</li>
                   <li><b>Company:</b> ${student.company || "—"}</li>
                   <li><b>Job Title:</b> ${student.jobTitle || "—"}</li>
                   <li><b>LinkedIn:</b> ${student.linkedin || "—"}</li>
                 </ul>
               </div>`;

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
    return new Response(JSON.stringify({ message: "Registration successful", student: safe }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
