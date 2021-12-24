const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //local authentication
    passport.use('local-login', new LocalStrategy({
            passReqToCallback: true
        },
        function (req, username, password, done) {
            console.log(username, password);
            User.findOne({'Email': username}, function (err, user) {
                if (err) {
                    return done(err, null);
                }
                if (!user) {
                    return done(null, false, req.flash('flashMsg', 'Tài khoản không tồn tại !'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('flashMsg', 'Sai mật khẩu ! Vui lòng đăng nhập lại'));
                }
                if(user && user.validPassword(password)){
                    return done(null, user);
                }
            });
        })
    );

}