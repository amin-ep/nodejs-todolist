import nodemailer from 'nodemailer';
const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
export default async function emailService(options) {
    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        tls: true,
        auth: {
            user: SMTP_USERNAME,
            pass: SMTP_PASSWORD,
        },
    });
    await transporter.sendMail({
        from: 'Todo List <info@aminebadi.ir>',
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html,
    });
}
