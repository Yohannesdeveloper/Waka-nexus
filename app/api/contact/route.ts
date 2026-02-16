import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Create transporter - using Mailtrap for development, Gmail for production
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('isDevelopment:', isDevelopment);

const transporter = isDevelopment 
  ? (console.log('Using Mailtrap transporter'), nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    }))
  : (console.log('Using Gmail transporter'), nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "wakaglobalartmusic@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, ''), // Remove spaces from app password
      },
    }));

// Log environment variables for debugging (remove in production)
console.log('GMAIL_USER:', process.env.GMAIL_USER);
console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD?.length);
console.log('GMAIL_APP_PASSWORD (first 4 chars):', process.env.GMAIL_APP_PASSWORD?.substring(0, 4));
console.log('MAILTRAP_USER:', process.env.MAILTRAP_USER);
console.log('MAILTRAP_PASS:', process.env.MAILTRAP_PASS);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name ? String(body.name).trim() : "";
    const email = body.email ? String(body.email).trim() : "";
    const subject = body.subject ? String(body.subject).trim() : "";
    const message = body.message ? String(body.message).trim() : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const recipientEmail = "wakaglobalartmusic@gmail.com";
    const emailSubject = subject
      ? `WAKA Contact: ${subject.charAt(0).toUpperCase() + subject.slice(1)}`
      : "WAKA Contact Form: New Message";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "Not specified");
    const safeMessage = escapeHtml(message);

    const fromEmail = process.env.GMAIL_USER || "wakaglobalartmusic@gmail.com";
    
    console.log('Attempting to send email...');
    console.log('From:', `WAKA Nexus <${fromEmail}>`);
    console.log('To:', recipientEmail);
    console.log('Subject:', emailSubject);
    
    // For development, log the contact form data to console instead of sending email
    if (isDevelopment) {
      console.log('=== CONTACT FORM SUBMISSION ===');
      console.log('Name:', safeName);
      console.log('Email:', safeEmail);
      console.log('Subject:', safeSubject);
      console.log('Message:', safeMessage);
      console.log('===============================');
      
      return NextResponse.json(
        { success: true, message: "Message received successfully (logged to console)" },
        { status: 200 }
      );
    }
    
    // Production: attempt to send email
    try {
      await transporter.sendMail({
        from: `WAKA Nexus <${fromEmail}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a962;">New Contact Form Submission</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Topic:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeSubject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px; white-space: pre-wrap;">${safeMessage}</td>
              </tr>
            </table>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              This email was sent from the WAKA Nexus contact form.
            </p>
          </div>
        `,
        replyTo: email,
      });
    } catch (error) {
      console.error("Nodemailer error:", error);
      const message = error instanceof Error ? error.message : "Failed to send email";
      return NextResponse.json(
        { error: "Failed to send email", details: process.env.NODE_ENV === "development" ? message : undefined },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Contact API error:", err);
    return NextResponse.json(
      {
        error: "Failed to send message",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 }
    );
  }
}
