import { Schema, model as Model } from "mongoose";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // console.log("Password before hashing:", this.password);
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
};





userSchema.methods.comparePassword = function(enteredPassword) {
    if (!enteredPassword || !this.password) {
        return false; // Handle the case where either password is undefined
    }
    console.log(enteredPassword)
    return bcrypt.compareSync(enteredPassword, this.password);
};

// Generating Reset password Token
userSchema.methods.getResetPasswordToken = function () {

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hashing and adding resetpasswordToken to userschema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;


}

const User = Model('User', userSchema);
export default User;