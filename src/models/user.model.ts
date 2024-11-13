import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../interfaces/user.interface';



// Define the User schema
const userSchema: Schema<IUserDocument> = new Schema(
  {
    fullName: {
      type: String,
      minlength: 3,
      required: true,
    },
    work: {
      type: String,
      minlength: 3,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    interests: {
      type: [String],
      enum: [
        'Technology',
        'Health',
        'Business',
        'Sports',
        'Lifestyle',
        'Education',
        'Travel',
        'Food',
        'Entertainment',
        'Science',
        'Politics',
        'Finance',
        'Fashion',
      ],
      default: [],
    },
    password: {
      type: String,
      required: true,
    },
    otp: String,
    otpTimestamp: Date,
    newotp: String,
    newotpTimestamp: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre<IUserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10); // saltRounds 10
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
