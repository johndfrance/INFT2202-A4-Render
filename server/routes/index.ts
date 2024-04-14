import express from 'express';
const router = express.Router();
//import Contact from "../models/contact";
import {AuthGuard, UserDisplayName} from "../utils";
import passport from "passport";
import User from "../models/user";
import Post from "../models/post";


/** TOP LEVEL ROUTES **/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', page: 'home', displayName:UserDisplayName(req) });
});
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home', page: 'home', displayName:UserDisplayName(req) });
});
router.get('/team', function(req, res, next) {
  res.render('index', { title: 'Team', page: 'team', displayName:UserDisplayName(req) });
});
router.get('/blog', function(req, res, next) {
  res.render('index', { title: 'Blog', page: 'blog', displayName:UserDisplayName(req) });
});
router.get('/contact', function(req, res, next) {
  res.render('index', { title: 'Contact', page: 'contact', displayName:UserDisplayName(req) });
});
router.get('/events', function(req, res, next) {
  res.render('index', { title: 'Event', page: 'events', displayName:UserDisplayName(req) });
});
router.get('/gallery', function(req, res, next) {
  res.render('index', { title: 'Gallery', page: 'gallery', displayName:UserDisplayName(req) });
});
router.get('/portfolio', function(req, res, next) {
  res.render('index', { title: 'Portfolio', page: 'portfolio', displayName:UserDisplayName(req) });
});
router.get('/privacy', function(req, res, next) {
  res.render('index', { title: 'Privacy', page: 'privacy', displayName:UserDisplayName(req) });
});
router.get('/services', function(req, res, next) {
  res.render('index', { title: 'Services', page: 'services', displayName:UserDisplayName(req) });
});
router.get('/tos', function(req, res, next) {
  res.render('index', { title: 'TOS', page: 'tos', displayName:UserDisplayName(req) });
});

/** AUTHENTICATION ROUTES **/
router.get('/login', function(req, res, next) {
  if(!req.user){
    res.render('index', { title: 'Login', page: "login", messages: req.flash('loginMessage'),
      displayName: UserDisplayName(req) });
  }
  return res.redirect('/home');
});
router.get('/registration', function(req, res, next) {
  if(!req.user) {
    res.render('index', {title: 'Register Now', page: "registration", messages: req.flash('registerMessage') ,
      displayName: UserDisplayName(req)});
  }
  return res.redirect('/home');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err:Error, user:Express.User, info:string){
    if(err){
      console.error(err);
      res.end();
    }
    if(!user){
      req.flash('loginMessage', 'Authentication Failed');
      return res.redirect('/login'); // Status 302
    }
    // Attempt to log in the user (establish a login session)
    req.logIn(user, function(err) {
      if (err) {
        console.error(err);
        res.end();
      }
      res.redirect('/home');
    });
  })(req,res,next);
});

router.post('/registration', function(req, res, next){
  let newUser = new User(
      {
        username: req.body.username,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.firstName + ' ' + req.body.lastName
      }
  );
  console.log("username: " + req.body.username);
  console.log("email: " + req.body.emailAddress);
  console.log("password: " + req.body.password);

  User.register(newUser, req.body.password, function(err){
    if(err){
      let errorMessage = "Server Error";
      if(err.name == 'UserExistsError'){
        console.error("Error: User Already Exists");
        errorMessage = "Registration Error";
      }
      req.flash('registerMessage', errorMessage);
      res.redirect('/registration');
    }
    return passport.authenticate('local')(req, res, function(){
      return res.redirect('/home');
    });
  });
});
router.get('/logout', function(req, res, next){
  req.logOut(function(err){
    if(err){
      res.end();
    }
    res.redirect('/login');
  });
});

/** EVENT PLANNING **/
router.get('/event-planning', AuthGuard, function(req, res, next) {
  Post.find().then(function(posts:any){
    res.render('index', { title: 'Event Planning', page: 'event-planning', displayName: UserDisplayName(req), posts: posts });
  }).catch(function(err: string){
    console.error("Error reading posts from Database" + err);
    res.end();
  });

});
router.post('/event-planning', AuthGuard, function(req, res, next){
  console.log("POSTing new message");
  let newPost = new Post(
      {
        "content": req.body.content,
        "username": req.body.username,
      }
  );
  Post.create(newPost).then(function(){
    res.redirect('/event-planning');
  }).catch(function(err: any){
    console.error(err);
    res.end;
  });
});
router.post('/event-planning/:id/comments', AuthGuard, function(req, res, next){
  Post.findById(req.params.id)
      .then((
          post: { comments: { content: String; username: String; }[]; save: () => any; }) => {
        if (!post) {
          return res.status(404).send('Post not found');
        }
        post.comments.push({
          content: req.body.content,
          username: req.body.username
        });
        return post.save();
      })
      .then(() => {
        res.redirect('/event-planning');
      })
      .catch((err: any) => {
        console.error(err);
        res.status(500).send('Server Error');
      });
});
// Deleting posts
router.get('/delete/:id', AuthGuard, function(req, res, next) {
  let id = req.params.id;
  Post.deleteOne({_id:id}).then(function(){
    res.redirect('/event-planning');
  }).catch(function(err: any){
    console.error(err);
    res.end();
  });
});

// Deleting Comments on posts.
router.get('/delete/:id/:com', AuthGuard, function(req, res, next) {
  const postId = req.params.id;
  const commentId = req.params.com;

  Post.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentId } } }
  )
      .then(() => {
        res.redirect('/event-planning');
      })
      .catch((err: any) => {
        console.error(err);
        res.status(500).send('Server Error');
      });
});

router.get('/stats', AuthGuard,function(req, res, next) {
  res.render('index', { title: 'Stats', page: 'stats', displayName:UserDisplayName(req) });
});

export default router;