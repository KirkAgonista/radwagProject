const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt');


// mongoose model schema
let UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        unique: true,
        required: true
    },
    lastName: {
        type: String,
        unique: true,
        required: true
    },
    position: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'EmailInvalid'

    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
});

//hash password
UserSchema.pre('save', function (next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

//compare password with hash
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
