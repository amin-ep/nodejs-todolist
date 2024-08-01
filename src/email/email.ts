import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions } from '../interfaces/IEmail.js';

import { config } from 'dotenv';

config({ path: './.env' });

export default async function emailService(options: EmailOptions) {
  const transporter = nodemailer.createTransport<Transporter>({
    // @ts-ignore
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    tls: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: 'TodoList <info@aminebadi.ir>',
    to: options.email,
    subject: options.message,
    text: options.message,
    html: options.html,
  });
}
