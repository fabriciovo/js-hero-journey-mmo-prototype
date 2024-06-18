import "dotenv/config";
import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";

import routes from "./routes/main";
import passwordRoutes from "./routes/password";
import secureRoutes from "./routes/secure";
import GameManager from "./game_manager/GameManager";

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

const gameManager = new GameManager(io);
gameManager.setup();
const port = process.env.PORT || 3000;

const uri = process.env.MONGO_CONNECTION_URL;
const mongoConfig = {
  useNewUrlParser: true,
  authSource: "admin",
};

if (process.env.MONGO_USER_NAME && process.env.MONGO_PASSWORD) {
  mongoConfig.auth = {};
  mongoConfig.auth.username = process.env.MONGO_USER_NAME;
  mongoConfig.auth.password = process.env.MONGO_PASSWORD;
}

//TODO
mongoose.connect(uri, mongoConfig);
mongoose.connection.on("error", (error) => {
  console.log(error);
  process.exit(1);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

require("./auth/auth");

app.get(
  "/game.html",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    response.status(200).json(request.user);
  }
);

app.use(express.static(path.join(__dirname, "/../public")));

app.get("/", (request, response) => {
  response.send(path.join(__dirname, "/../index.html"));
});

app.use("/", routes);
app.use("/", passwordRoutes);
app.use("/", passport.authenticate("jwt", { session: false }), secureRoutes);

app.use((request, response) => {
  response.status(404).json({ message: "404 - Not Found", status: 404 });
});

app.use((error, request, response, next) => {
  console.log(error);
  response
    .status(error.status || 500)
    .json({ error: error.message, status: 500 });
});

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.log("Connected");
  });
});
