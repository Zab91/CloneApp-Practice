const express = require("express");
const cors = require("cors");
const PORT = 1000;
const server = express();
const db = require("./models");
const bearerToken = require("express-bearer-token");
require("dotenv").config();

server.use(express.json());
server.use(cors());
server.use(bearerToken());

const { user } = require("./routers");
server.use("/users", user);

server.listen(PORT, () => {
  // db.sequelize.sync({ alter: true });
  console.log("SERVER RUNNING AT PORT :" + PORT);
});
