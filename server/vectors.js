
// PURE vector operations
// (NPM "vectors" lib is NOT PURE)

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

function isAllZeroes(v) {
  for (let i = 0; i < v.length; ++i) {
    if (v[i] !== 0) return false;
  }
  return true;
}

module.exports = {
  norm, add, mult, mag, sub, dot, isAllZeroes
};
