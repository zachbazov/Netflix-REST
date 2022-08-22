const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name value is required.']
    },
    email: {
        type: String,
        required: [true, 'An email value is required.'],
        unique: true,
        lowercase: true,
        validate: [
            validator.isEmail,
            'A valid email value is required.'
        ]
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A password value is required.'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [
            true,
            'A password confirmation value is required.'
        ],
        validate: {
            // validator - function works only on 'save/create' queries.
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords should match.'
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: String,
    passwordResetExpirationPeriod: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// Password Encryption

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

// Instance Method

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(
        candidatePassword,
        userPassword
    );
};

userSchema.methods.changedPasswordAfter = function (
    jwtTimestamp
) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        // console.log(changedTimestamp, jwtTimestamp);

        return jwtTimestamp < changedTimestamp;
    }

    // false - means not changed.
    return false;
};

userSchema.methods.generatePasswordResetToken =
    function () {
        const resetToken = crypto
            .randomBytes(32)
            .toString('hex');

        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // console.log(
        //     { resetToken },
        //     this.passwordResetToken
        // );

        this.passwordResetExpirationPeriod =
            Date.now() + 10 * 60 * 1000;

        return resetToken;
    };

const User = mongoose.model('User', userSchema);

module.exports = User;
