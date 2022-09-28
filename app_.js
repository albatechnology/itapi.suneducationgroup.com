require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

const db = require("./models");
const authentication = require("./controller/authentication.controller");
const fileUpload = require("express-fileupload");

var corsOptions = {
	origin: "http://it.suneducationgroup.com:5000",
};
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
/*
app.post('/api/authentication', (req, res) => {
    login_data  = controller.authentication.authentication(req.body.login_token);
    res.send('Hello World!')
})*/
require("./routes")(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
