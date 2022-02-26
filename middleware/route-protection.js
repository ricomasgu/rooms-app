isLoggedIn = (req, res, next) => {
    console.log(req.session);
    if(!req.session.currentUser){
        res.redirect("/");
    }
    next();
};

isLoggedOut = (req, res, next) => {
    console.log(req.session);
    if(req.session.currentUser){
        res.redirect("/");
    }
    next();
};

module.exports = {
    isLoggedIn,
    isLoggedOut
};