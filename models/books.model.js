'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * User Schema
 */
var BookSchema = new Schema({ 

    auther: {
        type: String,
    },
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Book', BookSchema);