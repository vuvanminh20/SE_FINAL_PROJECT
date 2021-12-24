const User = require('../models/user');
const Import = require('../models/import');
const Order = require('../models/order');
const Product = require('../models/product');

const multer = require('multer');

module.exports = function (app, passport) {
    app.get('/dangnhap', (req, res) => {
        if(req.isAuthenticated()){
            res.redirect('/')
        }else{
            res.render('login', {title: 'Đăng nhập', message: req.flash('flashMsg')});
        }
    });

    app.post('/dangnhap', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/dangnhap',
            failureFlash: true,
        })
    );

    app.get('/dangxuat', (req, res) => {
        req.logout();
        res.redirect('/dangnhap');
    });

    app.get('/', (req, res) => {
        res.render('index', {
            page: 'index',
            title: 'Trang chủ',
            user: req.user,
        });

    });

    app.get('/nhaphang', async (req, res) => {
        if (req.user.userRole === 'ketoan') {
            res.render('index', {
                page: 'import',
                title: 'Tạo phiếu nhập kho',
                user: req.user,
            });
        } else {
            res.redirect('/');
        }
    });
};

function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/dangnhap');
    }
}
