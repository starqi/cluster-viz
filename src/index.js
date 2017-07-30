import _ from 'lodash';
import './style.css';
import tuxIconUrl from './tux.png';

function component() {
  var e = document.createElement("div");
  e.innerHTML = _.join(['Hello', 'webpack'], ' ');
  e.classList.add('redify');

  var i = new Image();
  i.src = tuxIconUrl;
  e.appendChild(i);

  return e;
}

document.body.appendChild(component());
