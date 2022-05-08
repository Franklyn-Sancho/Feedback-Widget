import express from "express";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "bea9c37b6b0658",
    pass: "0aefeb5852cc92",
  },
});

app.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feedget.com>",
    to: "Frank Sanc <franklyn.hs@gmail.com>",
    subject: "novo feedback",
    html: [
      `<div style="font-family: sans-serif, font-size: 16px"; color: #1211>`,
      `<p>Tipo de feedback ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `<div>`
    ].join("\n"),
  });

  return res.status(201).json({ data: feedback });
});

app.listen(3333, () => {
  console.log("HTTP server running");
});
