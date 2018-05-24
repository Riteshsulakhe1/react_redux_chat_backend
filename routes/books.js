var express = require('express');
var books = express.Router();
var mongoose = require('mongoose');
var Book = mongoose.model('Book');
var _ = require('underscore');


books.getAllBooksOfUser = function(req, res) 
{
    if(req.query.ownerId) {
        Book.find({ownerId: req.query.ownerId}, function(err, bookList) {
            if(err) {
                var errMsg = new Error('No books found');
                res.json(errMsg);
            } else {
                res.json(bookList);
            }
        })
    }
};
books.addBook = function(req, res) {
    if(req.body.ownerId && req.body.name && req.body.auther){
        var newBook = new Book( req.body );
        newBook.save(function(err, book){
            if(err) {
                var errMsg = new Error('Fail to add book');
                res.json(errMsg);
            } else {
                res.json(book);
            }
        });
    }
};
books.updateBook = function (req, res) {

    if(req.body.ownerId && req.body.name && req.body.auther) {
        Book.findById(req.body._id, function(err, book) {
            if(err) {
                var errMsg = new Error('No books found');
                res.json(errMsg);
            } else {
                var newItem = _.extend(book, req.body);
                newItem.save(function(err, updated) {
                    if(err) {
                        var errMsg = new Error('Failed to update book');
                        res.json(errMsg);
                    } else {
                        res.json(newItem);
                    }
                });
            }
        }); 
    }
};
books.deleteBook = function(req, res) {
    
    Book.findByIdAndRemove(req.body._id, function(err, deletedBook) {
        if(err) {
            res.json(err);
        } else {
            res.json(deletedBook);
        }
    })
}
 
module.exports = books;