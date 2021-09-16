"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("dotenv/config");

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _main = _interopRequireDefault(require("./routes/main"));

var _password = _interopRequireDefault(require("./routes/password"));

var _secure = _interopRequireDefault(require("./routes/secure"));

var _GameManager = _interopRequireDefault(require("./game_manager/GameManager"));

var app = (0, _express["default"])();

var server = require('http').Server(app); //const io = require("socket.io")(server);


var io = require("socket.io")(server, {
  cors: {
    origin: process.env.CORS_ORIGIN
  }
});

var gameManager = new _GameManager["default"](io);
gameManager.setup();
var port = process.env.PORT || 3000;
var uri = process.env.MONGO_CONNECTION_URL;
var mongoConfig = {
  useNewUrlParser: true,
  authSource: "admin"
};

if (process.env.MONGO_USER_NAME && process.env.MONGO_PASSWORD) {
  mongoConfig.auth = {};
  mongoConfig.auth.username = process.env.MONGO_USER_NAME;
  mongoConfig.auth.password = process.env.MONGO_PASSWORD;
} //TODO  


_mongoose["default"].connect(uri, mongoConfig);

_mongoose["default"].connection.on('error', function (error) {
  console.log(error);
  process.exit(1);
});

app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use((0, _cookieParser["default"])());
app.use((0, _cors["default"])({
  credentials: true,
  origin: process.env.CORS_ORIGIN
}));

require('./auth/auth');

app.get('/game.html', _passport["default"].authenticate('jwt', {
  session: false
}), function (request, response) {
  response.status(200).json(request.user);
});
app.use(_express["default"]["static"](_path["default"].join(__dirname, '/../public')));
app.get('/', function (request, response) {
  response.send(_path["default"].join(__dirname, '/../index.html'));
});
app.use('/', _main["default"]);
app.use('/', _password["default"]);
app.use('/', _passport["default"].authenticate('jwt', {
  session: false
}), _secure["default"]);
app.use(function (request, response) {
  response.status(404).json({
    message: '404 - Not Found',
    status: 404
  });
});
app.use(function (error, request, response, next) {
  console.log(error);
  response.status(error.status || 500).json({
    error: error.message,
    status: 500
  });
});

_mongoose["default"].connection.on('connected', function () {
  server.listen(port, function () {
    console.log('Connected');
  });
});
//# sourceMappingURL=index.js.map