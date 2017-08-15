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

// http://joeroganexp.joerogan.libsynpro.com/rss

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
        const saved = trimmed.map(({title, content}) => ({title, description: content}));
        res.json(saved);
      }
    });
  } catch (err) {
    res.status(400).json({err});
  }
});

app.post('/cluster', (req, res) => {
  try {
    console.log(`Cluster request with ${req.body.tds.length} items`);
    console.log(req.body.tds);
    res.json(nlp.tdsToClusters(req.body.tds, 2));
  } catch (err) {
    console.log(err);
    res.status(400).json({err});
  }
});
