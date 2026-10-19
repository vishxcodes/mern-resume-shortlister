import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const isEmailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendStatusEmail(to, subject, text) {
  if (!isEmailConfigured || !transporter) {
    console.log(`ℹ️ Email notifications skipped (EMAIL_USER/EMAIL_PASS not configured). Would have sent to: ${to}`);
    return;
  }

  console.log(`📤 Sending email to ${to}: ${subject}`);
  try {
    await transporter.sendMail({
      from: `"Auto Resume Shortlister" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}
