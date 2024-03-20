const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Đây là trường name bắt buộc'],
  },
  email: {
    type: String,
    required: [true, 'Đây là trường email bắt buộc'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Làm ơn cung cấp đúng trường email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Đây là trường password bắt buộc'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Đây là trường passwordConfirm bắt buộc'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message:
        'password not equal passwordConfirm. Please send the again passwordConfirm',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String, // token rest password
  passwordResetExpires: Date, // hạn sử dụng token
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// mã hóa mk
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

//
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
// check mk
userSchema.methods.checkPassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};
//kiểm tra thời gian đổi mk
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // reset thực tế gửi cho người dùng.

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log(resetToken, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
