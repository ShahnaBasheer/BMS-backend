import { Request } from 'express';
import otpGenerator from 'otp-generator';
import User from '../models/user.model';
import sendEmail from './sendEmail.utils';
import cloudinary from '../config/cloudinary.confg';
import { Readable } from 'stream';
import sharp from 'sharp';


interface File {
  mimetype: string;
  buffer: Buffer;
}



// Function to send OTP email
const otpEmailSend = async (email: string): Promise<
{ otp: string, subject: string, text: string}> => 
  {
  try {
    const otp = otpGenerator.generate(6, { specialChars: false });
    const subject = 'OTP Verification';
    const text = `Your OTP for email verification is: ${otp}`;
    return { otp, subject, text};
  } catch (error: any) {
    console.log(error.message);
    throw new Error('Error in OTP generation');
  }
};

// Function to store images in Cloudinary
const CloudinaryfileStore = async (files: File[], folderName: string, fName: string): Promise<string[]> => {
  if (!files || !folderName || !fName) {
    throw new Error('Invalid input');
  }

  const processedImages: string[] = [];
  console.log(files.length, folderName);

  const uploadPromises = files.map((file) => {
    return new Promise<string | null>((resolve, reject) => {
      if (!file.mimetype.startsWith('image/')) {
        return reject(new Error('Only image files are allowed.'));
      }

      sharp(file.buffer, { failOnError: false })
        .resize({ width: 800 })
        .toBuffer()
        .then((buffer) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: folderName,
              public_id: `${fName}_${Date.now()}`,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result?.secure_url || null);
              }
            }
          );

          // Convert the optimized buffer into a stream and upload it
          const bufferStream = Readable.from(buffer);
          bufferStream.pipe(uploadStream).on('error', (streamError) => {
            reject(streamError);
          });
        })
        .catch((err) => {
          console.log(err);
          console.error(`Sharp processing error: ${err.message}`);
          // Skip the problematic file and resolve with null or a placeholder
          resolve(null);
        });
    });
  });

  // Filter out any null values (from skipped files)
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null); // Only return successful uploads
};



function isOtpExpired(timestamp: Date, expirationMinutes: number): boolean {
  const currentTime = new Date();
  const otpTimestamp = new Date(timestamp);

  const timeDifferenceInMinutes = (currentTime.getTime() - otpTimestamp.getTime()) / (1000 * 60);
  return timeDifferenceInMinutes > expirationMinutes;
}

export { otpEmailSend, CloudinaryfileStore, isOtpExpired };
