function tokenize(text) {
  return text.replace(/[^a-zA-Z\ ]/g, '').split(' ');
}

function tokenizeTd({title, description}) {
  return {
    titleArr: tokenize(title),
    descriptionArr: tokenize(description)
  };
}

function addToVocab(textArr, vocab) { // IMPURE
  textArr.forEach(word => {
    if (!vocab.dict.has(word)) vocab.dict.set(word, vocab.counter++)
  });
}

function addTdToVocab({titleArr, descriptionArr}, vocab) {
  addToVocab(titleArr, vocab);
  addToVocab(descriptionArr, vocab);
}

function binarize(textArr, {dict, counter}) {
  let vector = Array(dict.size).fill(0);
  textArr.forEach(word => vector[dict.get(word)] = 1);
  return vector;
}

function binarizeTd(tdArr, vocab) {
  return {
    titleBin: binarize(tdArr.titleArr, vocab),
    descriptionBin: binarize(tdArr.descriptionArr, vocab)
  };
}

function getIdfArr(tdBins, {dict}) {
  let idfArr = Array(dict.size);
  dict.forEach((index, word) => { // For each dictionary word
    // Counter the number of TDs which contain that word
    const count = tdBins.reduce((acc, tdBin) => {
      const contains = tdBin.titleBin[index] == 1 || tdBin.descriptionBin[index] == 1;
      return acc + (contains ? 1 : 0);
    }, 0);
    console.assert(count > 0); // Because of the way dict is constructed
    const idf = Math.log(tdBins.length / count); // The IDF formula - occur in every doc -> 0
    idfArr[index] = idf;
  });
  return idfArr;
}

function normalizeBin(textBin, idfArr) {
  return textBin.map((b, i) => b * idfArr[i]);
}

function normalizeTdBin(tdBin, idfArr) {
  return {
    titleIdf: normalizeBin(tdBin.titleBin, idfArr),
    descriptionIdf: normalizeBin(tdBin.descriptionBin, idfArr)
  };
}

function kMeans(tdIdfs, k) {
}

function tdsToClusters(tds) {
}

function shittyTesting() {
  let a = tokenizeTd({title: 'bob', description: 'bo___b is the best!'});
  let b = tokenizeTd({title: 'jill', description: '<<jill is the second best!'});
  let m = {dict: new Map(), counter: 0};
  addTdToVocab(a, m);
  addTdToVocab(b, m);
  console.log(m);
  console.log(a);
  console.log(b);
  let a2 = binarizeTd(a, m);
  let b2 = binarizeTd(b, m);
  console.log(a2);
  console.log(b2);
  let idfArr = getIdfArr([a2, b2], m);
  console.log(idfArr);
  let a3 = normalizeTdBin(a2, idfArr);
  let b3 = normalizeTdBin(b2, idfArr);
  console.log(a3);
  console.log(b3);
}

shittyTesting();

