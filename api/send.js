import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { msg, role } = req.body;

  try {
    await resend.emails.send({
      from: "DEDSEC Portal <noreply@yourdomain.com>",
      to: "shadyblanko@gmail.com",
      subject: "New Anonymous Feedback",
      text: `Message: ${msg}\n\nField of Work: ${role.join(", ")}`,
    });

    return res.status(200).json({ status: "success" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
