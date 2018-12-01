const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Define model format
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    unique: false,
    required: false,
    trim: true,
  },
  token: {
    type: String,
    unique: true,
    required: false,
    trim: true,
  },
  tokenSecret: {
    type: String,
    unique: true,
    required: false,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});


/**
 * Hash Password if modified
 */
UserSchema.pre('save', function (next) {
  const user = this;

  /**
   * Next if password unchanged
   */
  if (!user.isModified('password')) {
    return next();
  }

  return bcrypt.hash(user.password, 10).then((hash) => {
    /** Hash password * */
    user.password = hash;
    return next();
  }).catch(error => next(error));
});


/**
 * Authenticate user
 * @param email
 * @param password
 * @returns {Promise<any>}
 */
UserSchema.statics.authenticate = (email, password) => User.findOne({ email }).exec()
  .then(async (user) => {
    if (user === null) {
      throw new Error('User not found');
    }

    /** Compare password * */
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Password not good not found');
    }

    return user;
  });


/**
 * Add to mongoose
 * @type {Model}
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;
