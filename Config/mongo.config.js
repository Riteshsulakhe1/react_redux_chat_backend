var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/reactApp");
require('./models/user.model');
require('./models/books.model');
require('./models/passport.model');
var db = mongoose.connection,
User = db.model('User');
Book = db.model('Book');
Passport = db.model('Passport');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected to mongodb ...");
});
module.exports = {db:db, User:User, Book:Book, Passport:Passport};