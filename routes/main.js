const User = require('../models/user');

const multer = require('multer');

module.exports = function (app, passport) {
  app.get('/dangnhap', (req, res) => {
    res.render('login', { title: 'Đăng nhập', message: req.flash('flashMsg') });
  });

  app.post('/dangnhap',passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/dangnhap',
      failureFlash: true,
    })
  );

  app.get('/dangxuat', function (req, res) {
    req.logout();
    res.redirect('/dangnhap');
  });

  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      res.render('index', {
        page: 'index',
        title: 'Trang chủ',
        user: req.user,
      });
    } else {
      res.redirect('/dangnhap');
    }
  });
};
