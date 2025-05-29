import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name.'],
      trim: true,
      minlength: 5,
      maxlength: 25
    },
    email: {
      type: String,
      required: [true, 'Please enter your email.'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: 6
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
