require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = 5000;

const app = express();
//Solve CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,SAVE");
  res.header("Access-Control-Allow-Headers", "*");
  app.use(cors());
  next();
});

//config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// //Start react app
// const baseDir = `${__dirname}/build/`;
// app.use(express.static(`${baseDir}`));
// app.get("/", (req, res) => res.sendFile("index.html", { root: baseDir }));

//Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


//DB Connection
require("./config/db.js");

//routes
const router = require("./routes/Routes.js");
app.use(router);

app.listen(port, () => {
  console.log(`App rodando na port ${port}`);
});
