import emailService from '../email/email';
export default async function sendEmail(options, res, newUser) {
    try {
        await emailService({
            email: options.email,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        const statusCode = newUser === true ? 201 : 200;
        res.status(statusCode).json({
            status: 'success',
            message: `An email sent to ${options.email}`,
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'something went wrong!',
            err,
        });
    }
}
