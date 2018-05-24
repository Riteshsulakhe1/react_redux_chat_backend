var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var logger = require('morgan'),
cors = require('cors'),
mongoose = require('mongoose');
var dbUrl = 'mongodb://ds143892.mlab.com:43892/ritestchattingapp';
var dbOptions = {
  user: 'prabhat',
  pass: 'prabhat@1'
}   
mongoose.connect(dbUrl, dbOptions);
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
// Import the config file for passport strategies
require('./Config/local.js')(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('trust proxy', 1) // trust first proxy

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
  secret: 'saghv32534b54jhbtbr5b4b43h443jjhvd',
  resave: false,
  saveUninitialized: true
}));
// app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// app.options('*', cors()); 

// app.all('/*', function (req, res, next) {
//   // http://localhost:3000
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,     Content-Type");
//     next();
// });
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// app.use(session({
//   secret: 'a4f8071f-c873-4447-8ee2',
//   cookie: { maxAge: 2628000000 },
//   store: new (session)({
//       storage: 'mongodb',
//       instance: mongoose, // optional 
//       host: 'localhost', // optional 
//       port: 27017, // optional 
//       db: 'reactApp', // optional 
//       collection: 'sessions', // optional 
//       expire: 86400 // optional 
//   })
// }));

app.use('/', indexRouter);
app.use('/users', usersRouter);



//user api routes
app.get('/credentials', usersRouter.getFirebaseConfig);
app.get('/userList',usersRouter.getAllUsers);
app.post('/saveUser', usersRouter.registerUser);
app.post('/login', usersRouter.login);
app.get('/getLoggedInUser', usersRouter.getSessionUser);
app.post('/GoogleUser', usersRouter.registerGoogleUser)
app.get('/GoogleUser', usersRouter.getGoogleUser);
//Books api route
app.get('/booksByUserId', booksRouter.getAllBooksOfUser);
// app.get('/book', booksRouter.getBookById);
app.post('/book', booksRouter.addBook);
app.put('/book', booksRouter.updateBook);
app.delete('/book', booksRouter.deleteBook);

//Authentication middleware
// function checkSignIn(req, res){
//   if(req.session.user){
//      next();     //If session exists, proceed to page
//   } else {
//      var err = new Error("Not logged in!");
//      next(err);  //Error, trying to access unauthorized page!
//   }
// }
//Listen port
app.listen(4000,function() {
  console.log('node app is running on 4000');
});
module.exports = app;
