var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var Passport = mongoose.model('Passport');
var fs = require('fs');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.getAllUsers = function(req, res) {

  User.find({}, function(err, users){
    if(err) {
      res.send(err);
    } else {
      res.send(users);
    }
  })  
};

router.getFirebaseConfig = function(req, res) {
  // User.findById(req.query._id, function(err, user){
  //   if(err) {
  //     res.json(err);
  //   } else if(user){
      var obj = JSON.parse(fs.readFileSync('Config/firebase.config.json', 'utf8'));
      res.send(obj);
  //   }
  // })
};

router.registerUser = function(req, res){

  User.findOne({email: req.body.email}, function(err, user){
    if(err) {
      res.json(err);
    } else if(user && user.id) {
      res.json({success: false,status:402, message: 'User already exist'});
    } else if(!user) {
      var user = new User(req.body);
      delete user.password;
      user.save(function(err, savedUser) {
        if(err) {
          res.json(err)
        } else {
          var pass = new Passport();
            pass.provider = 'local';
            pass.password = req.body.password;
            pass.userId = savedUser;
          // Remove sensitive data before login
          pass.save( function(err, savedPassport) {
            if (err) {
              return res.json({status: 401, message: 'Fail to save passport'});
            } else {
              req.login(user, function (err) {
                if (err) {
                  res.status(400).json(err);
                } else {
                  user.toObject();
                  delete user.password;
                  res.json(user);
                }
              });
            }
          });
        }
      })
    }
  })
};

router.registerGoogleUser = function(req, res) {

  if(req.body.email && req.body.signInWithGoogle) {
    User.findOne({email: req.body.email, signInWithGoogle: true}, function(err, user){
      if(err) {
        res.json(err);
      } else if(user && user._id) {
        res.json(user);
      } else {
        var newUser = new User(req.body);
        newUser.save(function(err, data){
          if(err) {
            res.json(err);
          } else {
            res.json(data);
          }
        })
      }
    })
  } else {
    var err = new Error('Insufficient data for register');
    res.json(err);
  }
};

router.getGoogleUser = function(req, res) {
  console.log('req.query', req.query);
  if(req.query.email && req.query.signInWithGoogle) {
    User.findOne({email: req.query.email, signInWithGoogle: req.query.signInWithGoogle}, function(err, user){
      if(err) {
        console.log('ther was an err occure in find google user', err);
        res.json(err);
      } else {
        console.log('google user', user);
        res.json(user);
      }
    })
  }
};

/**
 * Signin after passport authentication
 */
router.login = function (req, res, next) {

  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      var UserObj = user.toObject();
      UserObj.token = user.generateJwt();
      delete user.password;
      delete user.salt;
      delete UserObj.password;
      console.log('userObj', UserObj);
      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          req.session.user = UserObj;
          res.json(UserObj);
        }
      });
    }
  })(req, res, next);
};
/**
 * Signout
 */
// exports.signout = function (req, res) {
//   req.logout();
//   res.redirect('/');
// };

router.getSessionUser = function(req, res){

  console.log('query', req.query);
  if(req.query.id) {
    User.findById(req.query.id, function(err, user){
      if(err) {
        res.json(err);
      } else if(user) {
        res.json(user)
      } else {
        var errMsg = new Error({message: 'User Not Found', status: 404});
        res.json(errMsg);
      }
    }) 
  } else {
    var err = new Error({message: 'User not Found', status: 404});
    res.json(err);
  }
};

// router.updateUser = function(req, res) {
//   if(req.body._id) {
//     User.update({_id: ObjectId(req.body._id)}, {$set:req.body}, function(err, updatedUser) {
//       if(err) {
//         var errMsg = new Error('Fail to update user');
//         res.json(err);
//       } else {
//         res.json(updatedUser);
//       }
//     });
//   }
// }


module.exports = router;
