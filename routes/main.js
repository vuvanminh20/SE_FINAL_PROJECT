const User = require('../models/user');
const Import = require('../models/import');
const Order = require('../models/order');
const Product = require('../models/product');

const multer = require('multer');

module.exports = function (app, passport) {
    app.get('/dangnhap', (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            res.render('login', {title: 'Đăng nhập', message: req.flash('flashMsg')});
        }
    });

    app.post('/dangnhap', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/dangnhap',
            failureFlash: true,
        }));

    app.get('/dangxuat', (req, res) => {
        req.logout();
        res.redirect('/dangnhap');
    });

    app.get('/', isLogin, (req, res) => {
        res.render('index', {
            page: 'index',
            title: 'Trang chủ',
            user: req.user,
        });

    });

    app.get('/nhaphang', isLogin, async (req, res) => {
        if (req.user.userRole === 'ketoan') {
            try {
                let product = await Product.find();
                res.render('index', {
                    page: 'import',
                    title: 'Tạo phiếu nhập kho',
                    user: req.user,
                    product: product
                });
            } catch (e) {
                console.log(e);
                res.redirect('/')
            }

        } else {
            res.redirect('/');
        }
    });

    app.post('/nhaphang', isLogin, async (req, res) => {
        let productList = req.body.productList;
        if (req.user.userRole === 'ketoan') {
            let newImport = new Import({
                Date: Date.now(),
                importList: productList,
                User: req.user._id
            });
            let saveImport = await newImport.save();

            for (let p of productList) {
               await Product.findByIdAndUpdate(p.Product,{$inc:{Qty:parseInt(p.importQty)}});
            }
            res.json({code: 200});
        } else {
            res.redirect('/');
        }
    });

    app.get('/donhang', isLogin, async (req, res) => {
        if (req.user.userRole === 'daily') {
            try {
                let product = await Product.find({Qty:{$gt:0}});
                res.render('index', {
                    page: 'order',
                    title: 'Tạo đơn hàng',
                    user: req.user,
                    product: product
                });
            } catch (e) {
                console.log(e);
                res.redirect('/')
            }
        } else {
            res.redirect('/');
        }
    });

    app.post('/donhang', isLogin, async (req, res) => {
        let Address = req.body.Address;
        let Phone = req.body.Phone;
        let paymentType = req.body.paymentType;
        let orderList = req.body.orderList;
        let totalPayment = req.body.totalPayment;

        if (req.user.userRole === 'daily') {
            let newOrder = new Order({
                User: req.user._id,
                Date: Date.now(),
                Address: Address,
                Phone: Phone,
                orderList: orderList,
                totalPayment: totalPayment,
                paymentType: paymentType,
                paymentStatus: 0,
                deliveryStatus: 0,
            });
            let saveOrder = await newOrder.save();

            for (let p of orderList) {
                await Product.findByIdAndUpdate(p.Product,{$inc:{Qty:- parseInt(p.Qty)}});
            }
            res.json({code: 200});
        } else {
            res.redirect('/');
        }
    });

    app.get('/quanlydonhang',isLogin,async (req,res)=>{
        if (req.user.userRole === 'ketoan') {
            try {
                let order = await Order.find().populate('User').populate('orderList.Product');
                res.render('index', {
                    page: 'orderManage',
                    title: 'Quản lý đơn hàng',
                    user: req.user,
                    order: order
                });
            } catch (e) {
                console.log(e);
                res.redirect('/')
            }

        } else {
            res.redirect('/');
        }
    });

    app.post('/capnhatdonhang',isLogin, (req,res)=>{
        let id = req.body.id;
        let action = req.body.action;
        let status = req.body.status;
        console.log(id)
        if (req.user.userRole === 'ketoan') {
            if (action === 'payment'){
                let newStatus;
                if (status == 0){
                    newStatus = 1
                }else{
                    newStatus = 0
                }
                Order.findByIdAndUpdate(id,{paymentStatus:newStatus},(err,data)=>{
                   if(err){
                       console.log(err);
                   } else{
                       res.json({code: 200});
                   }
                });
            }
            if (action === 'delivery'){
                let newStatus;
                if (status == 0){
                    newStatus = 1
                }
                if (status == 1){
                    newStatus = 2
                }
                if (status == 2){
                    newStatus = 0
                }
                console.log(newStatus)
                Order.findByIdAndUpdate(id,{deliveryStatus:newStatus},(err,data)=>{
                    if(err){
                        console.log(err);
                    } else{
                        res.json({code: 200});
                    }
                });
            }

        } else {
            res.redirect('/');
        }

    });

    app.get('/theodoidonhang',isLogin,async (req,res)=>{
        if (req.user.userRole === 'daily') {
            try {
                let order = await Order.find({User:req.user._id}).populate('User').populate('orderList.Product');
                res.render('index', {
                    page: 'orderTrack',
                    title: 'Theo dõi đơn hàng',
                    user: req.user,
                    order: order
                });
            } catch (e) {
                console.log(e);
                res.redirect('/')
            }

        } else {
            res.redirect('/');
        }
    });

    app.get('/thongkehanghoa',isLogin,async (req,res)=>{
        if (req.user.userRole === 'ketoan') {
            try {
                let order = await Order.find().populate('orderList.Product');
                let product = await Product.find();
                let importP =  await Import.find().populate('importList.Product');
                res.render('index', {
                    page: 'productStatis',
                    title: 'Thống kê hàng hoá',
                    user: req.user,
                    order: order,
                    product: product,
                    importP:importP
                });
            } catch (e) {
                console.log(e);
                res.redirect('/')
            }

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
