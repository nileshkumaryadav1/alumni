// /api/auth/send-otp (app route)
import nodemailer from "nodemailer";
import connectDB from "@/utils/db";
import { otpStore, saveOtp } from "@/utils/otpStore";
import Student from "@/models/Student";

const ONE_MIN = 60 * 1000;
const OTP_EXP_MS = 5 * 60 * 1000; // 5 minutes

function normalizeKey({ email, phone }) {
  if (email) return email.toLowerCase().trim();
  if (phone) return phone.replace(/\D/g, "").trim();
  return null;
}

function maskEmail(e) {
  // show first 2 chars and domain, mask the rest
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

function maskPhone(p) {
  const digits = p.replace(/\D/g, "");
  if (digits.length <= 4)
    return "*".repeat(Math.max(0, digits.length - 1)) + digits.slice(-1);
  return "*".repeat(digits.length - 4) + digits.slice(-4);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, phone, type = "register" } = body || {};

    // Basic presence check
    if (!email && !phone) {
      return new Response(
        JSON.stringify({ message: "Email or phone is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build normalized key (used for otpStore)
    const key = normalizeKey({ email, phone });
    if (!key) {
      return new Response(
        JSON.stringify({ message: "Invalid email or phone" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect DB only if we need to check existing users (register/reset)
    await connectDB();

    // If reset -> ensure student exists (by email or phone)
    if (type === "reset") {
      let student = null;
      if (email)
        student = await Student.findOne({
          email: email.toLowerCase().trim(),
        }).select("_id email phone");
      if (!student && phone)
        student = await Student.findOne({
          phone: phone.replace(/\D/g, "").trim(),
        }).select("_id email phone");
      if (!student) {
        return new Response(
          JSON.stringify({
            message: "Student with this identifier does not exist",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // If register -> do not allow sending OTP to already-registered identifier
    if (type === "register") {
      if (email) {
        const existingEmail = await Student.findOne({
          email: email.toLowerCase().trim(),
        }).select("_id");
        if (existingEmail) {
          return new Response(
            JSON.stringify({ message: "Email already registered" }),
            { status: 409, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      if (phone) {
        const normalizedPhone = phone.replace(/\D/g, "").trim();
        const existingPhone = await Student.findOne({
          phone: normalizedPhone,
        }).select("_id");
        if (existingPhone) {
          return new Response(
            JSON.stringify({ message: "Phone number already registered" }),
            { status: 409, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Rate-limit: check lastSent on this key
    const existing = otpStore[key];
    if (
      existing &&
      existing.lastSent &&
      Date.now() - existing.lastSent < ONE_MIN
    ) {
      const waitSec = Math.ceil(
        (ONE_MIN - (Date.now() - existing.lastSent)) / 1000
      );
      return new Response(
        JSON.stringify({
          message: `OTP recently sent. Try again in ${waitSec}s`,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate OTP and save
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(key, otp, OTP_EXP_MS);

    // set housekeeping fields on otpStore (merge so saveOtp structure isn't lost)
    otpStore[key] = {
      ...(otpStore[key] || {}),
      lastSent: Date.now(),
      expires: Date.now() + OTP_EXP_MS,
      // attempts count (increment)
      attempts: (otpStore[key]?.attempts || 0) + 1,
    };

    // Try to send email if email provided
    let emailSent = false;
    if (email) {
      if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.warn(
          "SMTP not configured; skipping real email send (development mode)."
        );
      } else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const subject =
          type === "reset"
            ? "Your Password Reset OTP"
            : "Your Registration OTP";
        const text = `Your OTP code is ${otp} for Alumni & Student Network. It expires in ${Math.floor(
          OTP_EXP_MS / 60000
        )} minutes.`;

        try {
          await transporter.sendMail({
            from: `"Management Team" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject,
            text,
            html: `
                   <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
                     <h2 style="color: #4A90E2; text-align: center;">Verification Code for 
                     <img src="https://alumni-manage-system.vercel.app/logo.png" alt="Logo" width="50" height="50" style="vertical-align: middle;" className="rounded-full">
                      Alumni management system.</h2>
                     <p style="font-size: 16px; text-align: center;">
                       Use the following OTP to complete your verification:
                     </p>
                     <div style="margin: 20px auto; width: fit-content; padding: 12px 24px; background: #fff; border: 2px dashed #4A90E2; border-radius: 8px; font-size: 24px; font-weight: bold; color: #4A90E2; letter-spacing: 3px;">
                       ${otp}
                     </div>
                     <p style="font-size: 14px; text-align: center; color: #666;">
                       This code will expire in <b>${Math.floor(
                         OTP_EXP_MS / 60000
                       )} minutes</b>.
                     </p>
                     <p style="font-size: 12px; text-align: center; color: #aaa; margin-top: 20px;">
                       If you did not request this code, please ignore this email.
                     </p>
                   </div>
                   `,
          });
          emailSent = true;
        } catch (err) {
          console.error("Error sending OTP email:", err);
          // If email sending fails, do not leak internal details — return 500
          return new Response(
            JSON.stringify({ message: "Failed to send OTP email" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // console.log(
    //   `✅ OTP set for key=${key} (emailSent=${emailSent}) OTP=${otp}`
    // );
    console.log(`✅ OTP set for (emailSent=${emailSent})`);

    // Masked destination for frontend
    const destination = email ? maskEmail(email) : maskPhone(phone);

    // For local dev convenience: when SMTP isn't configured and NODE_ENV !== 'production', return otp for quick tests.
    const debugOtp =
      (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) &&
      process.env.NODE_ENV !== "production"
        ? otp
        : undefined;

    return new Response(
      JSON.stringify({
        message: "OTP sent successfully",
        destination,
        expiresInMs: OTP_EXP_MS,
        debugOtp,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return new Response(JSON.stringify({ message: "Failed to send OTP" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
