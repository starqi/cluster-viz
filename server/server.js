const path = require('path');
const express = require('express');
const app = express();
const rssParser = require('rss-parser');
const bodyParser = require('body-parser');
const _ = require('lodash');
const nlp = require('./nlp.js');

const distFolder = path.join(__dirname, '../dist');
const indexHtml = path.join(distFolder, 'index.html');

app.use(bodyParser.json());
app.use(express.static(distFolder));

app.listen(8080, () => {
  console.log('Started on port 8080');
});

const MAX_ENTRIES = 20;
app.get('/rss', (req, res) => {
  try { 
    const url = req.query.url;
    console.log(`RSS request for ${url}`);
    rssParser.parseURL(url, (err, parsed) => {
      if (err !== null) {
        res.status(400).json({err});
      } else {
        const entries = parsed.feed.entries;
        console.log(`${url} gave ${entries.length} entries`);
        const trimmed = entries.length > MAX_ENTRIES ? _.take(entries, MAX_ENTRIES) : entries;
        const saved = trimmed.map(({title, content}) => ({title, description: nlp.preTokenize(content)})); // Remove HTML tags
        res.json(saved);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
});

app.post('/cluster', (req, res) => {
  try {
    console.log(`Cluster request with ${req.body.tds.length} items`);
    const clusterCount = parseInt(req.body.clusterCount); // <TODO> Middleware?
    console.assert(!isNaN(clusterCount));
    res.json(nlp.tdsToClusters(req.body.tds, clusterCount));
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
});
