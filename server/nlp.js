const util = require('util');

// <TODO> Extract out

function norm(v) {
  const m = mag(v);
  if (m === 0) 
    return null;
  else
    return mult(v, 1 / m);
}

function add(v1, v2) {
  console.assert(v1.length == v2.length);
  let nv = Array(v1.length);
  for (let i = 0; i < nv.length; ++i) {
    nv[i] = v1[i] + v2[i];
  }
  return nv;
}

function mult(v, c) {
  let nv = Array(v.length);
  for (let i = 0; i < nv.length; ++i) {
    nv[i] = v[i] * c;
  }
  return nv;
}

function mag(v) {
  return Math.sqrt(dot(v, v));
}

function sub(v1, v2) {
  console.assert(v1.length == v2.length);
  let nv = Array(v1.length);
  for (let i = 0; i < nv.length; ++i) {
    nv[i] = v1[i] - v2[i];
  }
  return nv;
}

function dot(v1, v2) {
  console.assert(v1.length == v2.length);
  let sum = 0;
  for (let i = 0; i < v1.length; ++i) {
    sum += v1[i] * v2[i];
  }
  return sum;
}

function preTokenize(text) {
  return text // CAREFUL of '' vs ' '
    .replace(/<[^<>]*>/g, '') // Remove HTML tags (I think this only does one layer <TODO>)
    .replace(/[^A-za-z']/g, ' ')
    .replace(/[\ \n]+/g, ' ') // No long whitespaces
    .replace(/^\ /g, '') // Single whitespace at line start
    .toLowerCase();
}

function tokenize(text) {
  return preTokenize(text).split(' ');
}

class Vocab {
  constructor() {
    this.dict = new Map();
    // Make dimensions of all words at least 2 to support vector operations
    // This special word will never exist b/c of preTokenize
    this.counter = 1;
    this.dict.set('#', 0);
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
// *{dict}* - The vocabulary
function getIdfArr(vecs, {dict}) {
  let idfArr = Array(dict.size);
  dict.forEach((index, word) => { // For each dictionary word
    if (word === '#') {
      idfArr[index] = 1337; // This value doesn't matter, since always multiplying by zero
    } else {
      // Counter the number of TDs which contain that word
      const count = vecs.reduce((acc, vecs) => {
        return acc + (vecs[index] === 1 ? 1 : 0);
      }, 0);
      console.assert(count > 0); // Because of the way dict is constructed
      // The IDF formula - occur in every doc -> epsilon
      // This is to prevent zero vectors with no angle
      const idf = Math.log(vecs.length / count) + Number.EPSILON; 
      idfArr[index] = idf;
    }
  });
  return idfArr;
}

function vectorApplyIdf(vecs, idfArr) {
  return vecs.map((b, i) => b * idfArr[i]);
}

// 0 angle => 0 distance, 180 degrees => 2 distance
function cosDist(v1, v2) {
  const cos = dot(v1, v2) / (mag(v1) * mag(v2));
  return 1 - cos;
}

// Normalized average of the normalized versions of an array of vectors
function normAvg(vs) {
  const sumNorms = vs.reduce((acc, v) => add(acc, norm(v)));
  const avgNorms = mult(sumNorms, 1 / vs.length); 
  return norm(avgNorms); // Returns null if all zeroes
}

function isAllZeroes(v) {
  for (let i = 0; i < v.length; ++i) {
    if (v[i] !== 0) return false;
  }
  return true;
}

// Picks *num* random and unique elements from *arr*
// If *num* > |*arr*|, then just picks |*arr*| elements
function randomTake(arr, num) {
  let indices = Array(arr.length);
  for (let i = 0; i < indices.length; ++i) 
    indices[i] = i; // 1, 2, 3, ..., |arr|
  let taken = [];
  for (let i = 0; i < num; ++i) {
    if (indices.length == 0) break;
    let index = indices.splice(Math.floor(Math.random() * indices.length), 1)[0]; // Note: [0, 1)
    taken.push(arr[index]);
  }
  return taken;
}

MAX_ITERATIONS = 25;
MIN_PERCENT_DROP = 0.01;
MIN_DIST = 0.001;

function skMeans(idfVecs, k) {
  // # centroids is upper bounded by # items
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
      idfVec.dist = closest.dist;
    });

    // Compute new total dist to children & new centroid location,
    // note these two have a mismatch
    centroids.forEach(centroid => {
      centroid.dist = centroid.children.reduce(
        (acc, child) => child.dist + acc, 0);
      // Only change it if it does not degen into the origin
      const n = normAvg(centroid.children);
      if (n !== null) centroid.vector = n;
    });

    // Add all centroid distances
    const totalDist = centroids.reduce((acc, centroid) => centroid.dist + acc, 0);

    if (lastDist !== null) {
      const percentageChange = 1 - totalDist / lastDist;
      console.log(`sk-means dist=${totalDist} reduction=${percentageChange * 100}%`);
      if (percentageChange < MIN_PERCENT_DROP) break;
    } else {
      console.log(`sk-means dist=${totalDist}`);
      if (totalDist < MIN_DIST) break;
    }

    lastDist = totalDist;
  }

  return centroids;
}

function tdsToClusters(tds, k) {
  // As long as there are no empty descriptions,
  // each vector will not be the zero vector
  tds = tds.filter(td => td.description.trim() !== '');
  if (tds.length === 0) return {
    clusters: [
      {title: 'cluster', items: []}
    ]
  };

  let vocab = new Vocab;

  const tokensArr = tds.map(td => {
    const tokens = tokenize(td.description);
    addToVocab(tokens, vocab);
    tokens.title = td.title; // Keep track of original title
    return tokens;
  });
  //console.log("VOCAB", vocab);

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
  //console.log("IDF", idfVecs);

  const centroids = skMeans(idfVecs, k);
  //console.log("CENT", centroids);

  // Convert to client format
  const clusters = centroids.map(centroid => {
    const maxDist = centroid.children.reduce(
      (acc, child) => child.dist > acc ? child.dist : acc
    , -Infinity);
    const minDist = centroid.children.reduce(
      (acc, child) => child.dist < acc ? child.dist : acc
    , Infinity);
    //console.log("MAX", maxDist);
    //console.log("MIN", minDist);
    return {
      title: 'cluster',
      items: centroid.children.map(child => {
        //console.log(child.dist);
        return {
          title: child.title,
          distance: (child.dist - minDist + 0.2) / (maxDist - minDist + 0.2) 
        };
      })
    };
  });

  return {clusters};
}

// <TODO> Testing framework
function test1() { 
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
  tdsToClusters, preTokenize
};
