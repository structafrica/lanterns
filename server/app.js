var createError = require('http-errors');
const http = require('http')
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
require("dotenv").config();

const indexRouter = require('./api/routes/index');
const authRoute = require('./api/routes/auth');
const restaurantRoute = require('./api/routes/restaurant');
const menuCategoryRoute = require('./api/routes/menu_category');
const menuItemRoute = require('./api/routes/menu_item');
const orderItemRoute = require('./api/routes/order');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app)



// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname:'.hbs'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all((req, res, next) => {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/api/v1/user', authRoute);
app.use('/api/v1/restaurants', restaurantRoute);
app.use('/api/v1/menu_category', menuCategoryRoute);
app.use('/api/v1/menu_item', menuItemRoute);
app.use('/api/v1/order', orderItemRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex:true,
  useNewUrlParser:true,
  useFindAndModify:false,
  useUnifiedTopology:true
})
.then(result =>{
  server.listen(port);
  console.log(`Server running on port ${port}`);
  
});

