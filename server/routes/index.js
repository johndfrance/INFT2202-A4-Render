"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const utils_1 = require("../utils");
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../models/user"));
const post_1 = __importDefault(require("../models/post"));
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/home', function (req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/team', function (req, res, next) {
    res.render('index', { title: 'Team', page: 'team', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/blog', function (req, res, next) {
    res.render('index', { title: 'Blog', page: 'blog', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/contact', function (req, res, next) {
    res.render('index', { title: 'Contact', page: 'contact', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/events', function (req, res, next) {
    res.render('index', { title: 'Event', page: 'events', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/gallery', function (req, res, next) {
    res.render('index', { title: 'Gallery', page: 'gallery', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/portfolio', function (req, res, next) {
    res.render('index', { title: 'Portfolio', page: 'portfolio', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/privacy', function (req, res, next) {
    res.render('index', { title: 'Privacy', page: 'privacy', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/services', function (req, res, next) {
    res.render('index', { title: 'Services', page: 'services', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/tos', function (req, res, next) {
    res.render('index', { title: 'TOS', page: 'tos', displayName: (0, utils_1.UserDisplayName)(req) });
});
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Login', page: "login", messages: req.flash('loginMessage'),
            displayName: (0, utils_1.UserDisplayName)(req) });
    }
    return res.redirect('/home');
});
router.get('/registration', function (req, res, next) {
    if (!req.user) {
        res.render('index', { title: 'Register Now', page: "registration", messages: req.flash('registerMessage'),
            displayName: (0, utils_1.UserDisplayName)(req) });
    }
    return res.redirect('/home');
});
router.post('/login', function (req, res, next) {
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            console.error(err);
            res.end();
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Failed');
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                console.error(err);
                res.end();
            }
            res.redirect('/home');
        });
    })(req, res, next);
});
router.post('/registration', function (req, res, next) {
    let newUser = new user_1.default({
        username: req.body.username,
        EmailAddress: req.body.emailAddress,
        DisplayName: req.body.firstName + ' ' + req.body.lastName
    });
    console.log("username: " + req.body.username);
    console.log("email: " + req.body.emailAddress);
    console.log("password: " + req.body.password);
    user_1.default.register(newUser, req.body.password, function (err) {
        if (err) {
            let errorMessage = "Server Error";
            if (err.name == 'UserExistsError') {
                console.error("Error: User Already Exists");
                errorMessage = "Registration Error";
            }
            req.flash('registerMessage', errorMessage);
            res.redirect('/registration');
        }
        return passport_1.default.authenticate('local')(req, res, function () {
            return res.redirect('/home');
        });
    });
});
router.get('/logout', function (req, res, next) {
    req.logOut(function (err) {
        if (err) {
            res.end();
        }
        res.redirect('/login');
    });
});
router.get('/event-planning', utils_1.AuthGuard, function (req, res, next) {
    post_1.default.find().then(function (posts) {
        res.render('index', { title: 'Event Planning', page: 'event-planning', displayName: (0, utils_1.UserDisplayName)(req), posts: posts });
    }).catch(function (err) {
        console.error("Error reading posts from Database" + err);
        res.end();
    });
});
router.post('/event-planning', utils_1.AuthGuard, function (req, res, next) {
    console.log("POSTing new message");
    let newPost = new post_1.default({
        "content": req.body.content,
        "username": req.body.username,
    });
    post_1.default.create(newPost).then(function () {
        res.redirect('/event-planning');
    }).catch(function (err) {
        console.error(err);
        res.end;
    });
});
router.post('/event-planning/:id/comments', utils_1.AuthGuard, function (req, res, next) {
    post_1.default.findById(req.params.id)
        .then((post) => {
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
        .catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
});
router.get('/delete/:id', utils_1.AuthGuard, function (req, res, next) {
    let id = req.params.id;
    post_1.default.deleteOne({ _id: id }).then(function () {
        res.redirect('/event-planning');
    }).catch(function (err) {
        console.error(err);
        res.end();
    });
});
router.get('/delete/:id/:com', utils_1.AuthGuard, function (req, res, next) {
    const postId = req.params.id;
    const commentId = req.params.com;
    post_1.default.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId } } })
        .then(() => {
        res.redirect('/event-planning');
    })
        .catch((err) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
});
router.get('/stats', utils_1.AuthGuard, function (req, res, next) {
    res.render('index', { title: 'Stats', page: 'stats', displayName: (0, utils_1.UserDisplayName)(req) });
});
exports.default = router;
//# sourceMappingURL=index.js.map