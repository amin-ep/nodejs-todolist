import emailService from '../email/email.js';
import { EmailOptions } from '../interfaces/IEmail.js';
import { Response } from 'express';

export default async function sendEmail(
  options: EmailOptions,
  res: Response,
  newUser: boolean
) {
  try {
    await emailService({
      email: options.email,
      message: options.message,
      text: options.text,
      html: options.html,
    });
    const statusCode: number = newUser === true ? 201 : 200;
    res.status(statusCode).json({
      status: 'success',
      message: `An email sent to ${options.email}`,
    });
  } catch (err: any) {
    res.status(err.responseCode).json({
      status: 'error',
      message: 'something went wrong!',
      err,
    });
  }
}
