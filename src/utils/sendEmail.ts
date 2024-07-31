import emailService from '../email/email';
import { EmailOptions } from '../interfaces/IEmail';
import { Response } from 'express';

export default async function sendEmail(
  options: EmailOptions,
  res: Response,
  newUser: boolean
) {
  try {
    await emailService({
      email: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    const statusCode: number = newUser === true ? 201 : 200;
    res.status(statusCode).json({
      status: 'success',
      message: `An email sent to ${options.email}`,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
      err,
    });
  }
}
