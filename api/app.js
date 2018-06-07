const createError = require('http-errors'),
    express = require('express'),
    session = require("express-session"),
    passport = require("passport"),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    bodyParser  = require("body-parser");

const usersRouter = require('./routes/users');
const contractorsRouter = require('./routes/contractors');
const goodsRouter = require('./routes/goods');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(session({
    secret: 'RADWAG Project works fine',
    resave: true,
    saveUninitialized: false
}));

require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, '../dist/projektRADWAG-Angular')));


app.use('/api/users', usersRouter);
app.use('/api/contractors', contractorsRouter);
app.use('/api/goods', goodsRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/projektRADWAG-Angular/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
    console.log("App is running on port " + 3000);
});
module.exports = app;
