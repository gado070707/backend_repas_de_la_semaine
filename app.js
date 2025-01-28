var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const express = require("express");
const helmet = require("helmet");
const process = require('process');

const app = express();

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/routerUsers');
var viandesRouter = require('./routes/routerViandes');
var repasdujourRouter = require('./routes/routerRepasDuJour');
var historiqueRepasDesJoursRouter = require('./routes/routerHistoriqueRepasDesJours');
var modeRouter = require('./routes/routerModes');

const port = process.env.PORT_BACKEND;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(helmet());
// By default, Helmet sets the following headers:
// Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
// Cross-Origin-Embedder-Policy: require-corp
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Resource-Policy: same-origin
// Origin-Agent-Cluster: ?1
// Referrer-Policy: no-referrer
// Strict-Transport-Security: max-age=15552000; includeSubDomains
// X-Content-Type-Options: nosniff
// X-DNS-Prefetch-Control: off
// X-Download-Options: noopen
// X-Frame-Options: SAMEORIGIN
// X-Permitted-Cross-Domain-Policies: none
// X-XSS-Protection: 0


// This disables the `contentSecurityPolicy` middleware but keeps the rest.
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



// import { vue_viandes } from "./controller/read";

// vue_viandes;
// const vv = require('./controller/read');
// vv.vue_viandes;

app.listen(port, () => console.log(`Listening on port ${port}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/viandes', viandesRouter);
app.use('/repasdujour', repasdujourRouter);
app.use('/historiquerepasdesjours', historiqueRepasDesJoursRouter);
app.use('/mode', modeRouter);


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

module.exports = app;
