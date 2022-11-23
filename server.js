require("dotenv").config();
const jwt = require("jsonwebtoken");
const multer = require("multer");

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

const db = require("./models");
const authentication = require("./controller/authentication.controller");
const fileUpload = require("express-fileupload");

var corsOptions = {
  origin: "http://localhost:3001",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    var filename = `${Date.now()}-'sunedu'-${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

app.use("/public", express.static("public"));

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

db.sequelize.sync({ alter: false, force: false });

app.get("/api/validate", (req, res) => {
  authentication.validateDBToken(req, res);
});
app.get("/api/get_login_url", (req, res) => {
  authentication.getLoginUrl(req, res);
});
/*
app.post('/api/authentication', (req, res) => {
    login_data  = controller.authentication.authentication(req.body.login_token);
    res.send('Hello World!')
})*/
require("./routes")(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
