const router = require('express').Router();
const bcrypt = require('bcrypt');
const { isLoggedOut, isLoggedIn } = require('../middleware/route-protection');

const User = require('../models/User.model')

/* GET signup page */
router.get("/signup", isLoggedOut, (req, res, next) => {
    res.render("auth/signup");
});

/* POST signup page */
router.post("/signup", isLoggedOut, async (req, res, next) => {
    const { username, password } = req.body;
    const saltRounds = 10;
    try{
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHashed = await bcrypt.hash(password, salt);
        const user = await User.create({ username , password: passwordHashed});
        req.session.currentUser = user;
        res.redirect("/");
    }
    catch (error){
        console.log(error);
        res.redirect("/");
    }
});

/* GET login page */
router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("auth/login");
});

/* POST login page */
router.post("/login", isLoggedOut, async (req, res, next) => {
    const { username, password } = req.body;
    try{
        const user = await User.findOne({ username });
        const { password: passwordHashed } = user;
        if ( await bcrypt.compare(password, passwordHashed)){
            req.session.currentUser = user;
            res.redirect("/");
        }
        else {
            res.redirect("/login");
        }
    }
    catch (error){
        console.log(error);
        res.redirect("/");
    }
});

/* POST logout page */
router.post("/logout", isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});

module.exports = router;
