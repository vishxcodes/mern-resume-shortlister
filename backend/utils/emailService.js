import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import nodemailer from "nodemailer";
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendStatusEmail(to, subject, text) {
  console.log(`📤 Sending email to ${to}: ${subject}`);
  try {
    await transporter.sendMail({
      from: `"Auto Resume Shortlister" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}

