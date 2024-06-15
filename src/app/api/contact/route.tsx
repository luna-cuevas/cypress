import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type MailOptions = {
  from: string;
  to: string[]; // Assuming 'email' is a string, it's better to type this as string instead of any
  subject: string;
  text: string;
  html: string;
  priority: "high" | "normal" | "low"; // Explicitly type the priority field
  headers: {
    "X-Priority": string;
    "X-MSMail-Priority": string;
    Importance: string;
  };
};

export async function POST(req: Request) {
  const body = await req.json();
  const { message, name, email, typeOfSupport } = body;

  // Step 2: Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.GMAIL_EMAIL}`,
      pass: `${process.env.GMAIL_PASSWORD}`,
    },
  });

  // Email options
  const mailOptions: MailOptions = {
    from: '"Cypress Dev" <contact@cypressclothiers.com> ', // Sender address
    to: [
      "info@cypressclothiers.com" as string,
      process.env.GMAIL_EMAIL as string,
    ], // List of recipients
    subject: "New Message from Cypress Contact Form", // Subject line
    text: `Name: ${name}\nEmail: ${email}\nType of Support: ${typeOfSupport}\nMessage: ${message}`, // Plain text body
    html: `
            <p><strong>Message from:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Type of Support:</strong> ${typeOfSupport}</p>
            <p><strong>Message:</strong> ${message}</p>
          `, // HTML body content
    priority: "high", // Mark the email as high priority
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
  };

  try {
    // Step 3: Send an Email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Error sending message", result: error });
  }
}
