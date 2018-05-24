'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User Schema
 */
var FriendReqSchema = new Schema({ 
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: ''
    },
    pendingAt: {
        type: String,
        default: ''
    },
    acceptedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('FriendRequest', FriendReqSchema);