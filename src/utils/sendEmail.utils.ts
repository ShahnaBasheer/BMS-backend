import nodemailer from 'nodemailer';
import { BadRequestError } from './customError.utils';

interface SendEmailProps {
  email: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ email, subject, text }: SendEmailProps): Promise<void> => {
  try {
    if (!email) {
      throw new BadRequestError('Email Id is required!');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error: any) {
    console.log(`${error.message} - Email not sent`);
    throw error;
  }
};

export default sendEmail;
