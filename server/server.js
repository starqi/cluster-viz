const path = require('path');
const express = require('express');
const app = express();

const distFolder = path.join(__dirname, "../dist");
const indexHtml = path.join(distFolder, "index.html");

app.use(express.static(distFolder));

app.listen(8080, function () {
  console.log("Started on port 8080");
});
