const mag = require('vectors/mag-nd');
const add = require('vectors/add-nd');
const mult = require('vectors/mult-nd');
const sub = require('vectors/sub-nd');
const dot = require('vectors/dot-nd');
const normalize = require('vectors/normalize-nd');
const util = require('util');

function tokenize(text) {
  return text.replace(/[^a-zA-Z\ ]/g, '').split(' ');
}

class Vocab {
  constructor() {
    this.dict = new Map();
    this.counter = 0;
  }
}

function addToVocab(tokens, vocab) { // IMPURE
  tokens.forEach(word => {
    if (!vocab.dict.has(word)) vocab.dict.set(word, vocab.counter++)
  });
}

function tokensToVec(tokens, {dict, counter}) {
  let vector = Array(dict.size).fill(0);
  tokens.forEach(word => vector[dict.get(word)] = 1);
  return vector;
}

// Returns an array containing the IDF factor for each word in the vocabulary
// *vecs* - All the documents represented as vectors
// *{dict} - The vocabulary
function getIdfArr(vecs, {dict}) {
  let idfArr = Array(dict.size);
  dict.forEach((index, word) => { // For each dictionary word
    // Counter the number of TDs which contain that word
    const count = vecs.reduce((acc, vecs) => {
      return acc + (vecs[index] === 1 ? 1 : 0);
    }, 0);
    console.assert(count > 0); // Because of the way dict is constructed
    const idf = Math.log(vecs.length / count); // The IDF formula - occur in every doc -> 0
    idfArr[index] = idf;
  });
  return idfArr;
}

function vectorApplyIdf(vecs, idfArr) {
  return vecs.map((b, i) => b * idfArr[i]);
}

// 0 angle => 0 distance, 180 degrees => 2 distance
function cosDist(v1, v2) {
  console.assert(v1.length == v2.length);
  //console.assert(mag(v1) != 0 && mag(v2) != 0);
  const cos = dot(v1, v2) / (mag(v1) * mag(v2));
  return 1 - cos;
}

// Normalized average of the normalized versions of an array of vectors
function normAvg(vs) {
  console.assert(vs.length != 0);
  const sumNorms = vs.reduce((acc, v) => add(acc, normalize(v)));
  const avgNorms = mult(sumNorms, 1 / vs[0].length); // assert(All same length)
  return normalize(avgNorms);
}

// Picks *num* random and unique elements from *arr*
function randomTake(arr, num) {
  let indices = Array(arr.length);
  for (let i = 0; i < indices.length; ++i) 
    indices[i] = i; // 1, 2, 3, ..., |arr|
  let taken = [];
  for (let i = 0; i < num; ++i) {
    let index = indices.splice(Math.floor(Math.random() * indices.length), 1)[0]; // Note: [0, 1)
    taken.push(arr[index]);
  }
  return taken;
}

MAX_ITERATIONS = 25;
MIN_PERCENT_DROP = 0.01;
MIN_DIST = 0.001;

function skMeans(idfVecs, k) {
  let centroids = randomTake(idfVecs, k).map(c => {
    return {vector: c, children: null, dist: null};
  });

  let lastDist = null;

  for (let i = 0; i < MAX_ITERATIONS; ++i) {

    // Refresh children
    centroids.forEach(centroid => {
      centroid.children = [];
    });

    // Assign TDs to closest centroid
    idfVecs.forEach(idfVec => {
      const defaultAcc = {centroid: null, dist: Infinity};
      const closest = centroids.reduce((shortest, centroid) => {
        const dist = cosDist(centroid.vector, idfVec); 
        return dist < shortest.dist ? {centroid, dist} : shortest;
      }, defaultAcc);
      closest.centroid.children.push(idfVec);
    });

    // Compute new centroid location
    centroids.forEach(centroid => {
      centroid.vector = normAvg(centroid.children);
    });

    // Compute total distance from centroid to children
    centroids.forEach(centroid => {
      centroid.children.forEach(child => {
        child.dist = cosDist(centroid.vector, child);
      });
      centroid.dist = centroid.children.reduce(
        (acc, child) => child.dist + acc
      , 0);
    });

    // Add all centroid distances
    const totalDist = centroids.reduce((acc, centroid) => centroid.dist + acc, 0);

    if (lastDist !== null) {
      const percentageChange = 1 - totalDist / lastDist;
      console.log(`sk-means dist=${totalDist} reduction=${percentageChange * 100}%`);
      if (percentageChange < MIN_PERCENT_DROP) break;
    } else {
      console.log(`skin-means dist=${totalDist}`);
      if (totalDist < MIN_DIST) break;
    }

    lastDist = totalDist;
  }

  return centroids;
}

function tdsToClusters(tds, k) {
  let vocab = new Vocab;

  const tokensArr = tds.map(td => {
    const tokens = tokenize(td.description);
    addToVocab(tokens, vocab);
    tokens.title = td.title; // Keep track of original title
    return tokens;
  });

  const vecs = tokensArr.map(tokens => {
    const vec = tokensToVec(tokens, vocab);
    vec.title = tokens.title; 
    return vec;
  });

  const idfArr = getIdfArr(vecs, vocab);

  const idfVecs = vecs.map(vec => {
    const idfVec = vectorApplyIdf(vec, idfArr);
    idfVec.title = vec.title;
    return idfVec;
  });

  const centroids = skMeans(idfVecs, k);

  // Convert to client format
  const clusters = centroids.map(centroid => {

    // Highest centroid to child distance in this cluster
    const maxDist = centroid.children.reduce(
      (acc, child) => child.dist > acc ? child.dist : acc
    , -Infinity);

    return {
      title: 'cluster',
      items: centroid.children.map(child => {
        return {
          title: child.title,
          distance: (child.dist + 1) / (maxDist + 1)
        };
      })
    };
  });

  return {clusters};
}

function shittyTesting() {
  const tds = [
    {
      title: 'a',
      description: 'bo___b is the best!'
    },
    {
      title: 'b',
      description: '<<jill is the second best!'
    },
    {
      title: 'c',
      description: 'happy happy holiday yes i hooray'
    },
    {
      title: 'd',
      description: 'hooray yes whee holiday is here no wait'
    }
  ];
  console.log(util.inspect(tdsToClusters(tds, 1), {depth: null}));
}

module.exports = {
  tdsToClusters
};
