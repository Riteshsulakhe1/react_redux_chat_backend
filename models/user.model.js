'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    Schema = mongoose.Schema;
/**
 * User Schema
 */
var UserSchema = new Schema({ 
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        index: {
        unique: true,
        sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
        },
        lowercase: true,
        trim: true,
        required: true
    },
    mobile: {
        type: Number
    },
    signInWithGoogle: {
        type: Boolean,
        default: false
    },
    picture: {
        type: String,
        default: ''
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});
UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
  };

mongoose.model('User', UserSchema);