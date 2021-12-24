const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const multer = require('multer');
const logger = require('morgan');

const passport = require('passport');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');

const app = express();
app.use(express.static('./public'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/SE_PROJECT', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Database connected !');
    }
});

require('./config/passport')(passport);

app.use(cookieSession({
    name: 'user-session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['HSscS28i9sbgodSU6eplpZc5uv1DXQeXIHnEm71E']
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/main')(app, passport);

app.listen(3000, function () {
    console.log('Server is running !');
});