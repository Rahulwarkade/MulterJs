var express = require('express');
var router = express.Router();
var userModel = require('./users');
var passport = require('passport');
var localStrategy = require('passport-local');
var multer = require('multer');
var path = require('path');
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const d = new Date();
    const uniqueFileName = Math.floor((Math.random()*1E9) + d.getTime()) + path.extname(file.originalname);
    cb(null, uniqueFileName);
  }
})

const upload = multer({ storage: storage })

router.post('/upload',isLoggedIn,upload.single('avtar'),function(req,res){
  userModel.findOne({username : req.session.passport.user})
  .then(function(user)
  {
    user.image = req.file.filename;
    user.save()
    .then(function()
    {
      res.redirect("back");
    })
  })
})
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/profile',isLoggedIn,function(req,res){
  userModel.find()
  .then(function(foundUser){
    res.render('profile',{allusers:foundUser});
  })
  // res.render('profile')
})

router.post('/register',function(req,res){
  var newUser = new userModel(
    {
      username : req.body.username,
      image : req.body.profileimage
    }
  );
  userModel.register(newUser,req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile');
    })
  })
  .catch(function(e)
  {
    res.send(e);
  })
})
router.post('/login',passport.authenticate('local',{
  successRedirect : '/profile',
  failureRedirect: '/',
}),function(req,res){});

router.get('/logout',function(req,res,next){
  req.logout(function(err)
  {
    if(err){ return next(err);}
    res.redirect('/');
  })
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}
router.get('/users',function(req,res){
  userModel.find()
  .then(function(alluser){
    res.send(alluser);
  })
})
module.exports = router;
