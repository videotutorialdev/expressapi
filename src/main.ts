import dotenv from "dotenv";
import express from "express";
import { createTransport } from "nodemailer";

dotenv.config();

const { SMPT_USER, SMPT_PASS, SMPT_PORT = 587, SMPT_HOST } = process.env;

const user = SMPT_USER;
const pass = SMPT_PASS;

const transporter = createTransport({
  host: SMPT_HOST,
  port: +SMPT_PORT,
  secure: +SMPT_PORT === 465,
  auth: { user, pass },
});

const to = "emailtarget@domain.com";

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  const { id, name } = req.query;
  res.status(200).send({ id, name });
});

app.get("/api/v1/sendEmail", async (req, res) => {
  try {
    console.log("Start send email");
    await transporter.sendMail({
      from: `noreply <${user}>`,
      to: to,
      subject: "Email Verification",
      html: "<strong>Hello world</strong>. this is my first email with mailgun",
    });
    console.log("Finish send email");
    res.status(200).send({ message: "Email sended!" });
  } catch (ex) {
    console.log(ex);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(APP_PORT, () => {
  console.log(`Server is up on port ${APP_PORT}`);
});
