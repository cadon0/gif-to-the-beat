const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "./scripts")));
app.use(express.static(path.join(__dirname, "./styles")));
app.use(express.static(path.join(__dirname, "./images")));
app.use(express.static(path.join(__dirname, "./config")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.listen(727);
