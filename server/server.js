const path = require('path');
const express = require('express');
const app = express();
const rssParser = require('rss-parser');

const distFolder = path.join(__dirname, "../dist");
const indexHtml = path.join(distFolder, "index.html");

app.use(express.static(distFolder));

app.listen(8080, function () {
  console.log("Started on port 8080");
});

/*
rssParser.parseURL('http://joeroganexp.joerogan.libsynpro.com/rss', function(err, parsed) {
  console.log(parsed.feed.title);
  console.log('\n');
  debugger;
  console.log(parsed.feed.entries.length);
  console.log('\n');
  parsed.feed.entries.forEach(function(entry) {
    console.log(entry.title);
    console.log(entry.content);
    console.log('\n');
    debugger;
  })
})
*/
