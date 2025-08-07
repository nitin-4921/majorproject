const User = require("../models/user");




module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}



module.exports.signup = async (req, res) => {
    try{
    let { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
        req.flash("success", "Welcome to our Wanderlust!");
        res.redirect("/listing");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}









module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}






module.exports.login =  async(req, res) => {
    let redirectUrl = res.locals.redirectUrl || "/listing"; // Use saved redirect URL or default to /listing
    
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(redirectUrl);
}






module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listing");
    });
}