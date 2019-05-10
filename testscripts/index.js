import _ from 'lodash';
import changeMe from './change.js';
import './test.css';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = changeMe;

  element.appendChild(btn);

  return element;
}

window.onload = function() {
  let element = component(); // Store the element to re-render on print.js changes
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./change.js', function() {
      console.log('Accepting the updated changeMe module!');
      document.body.removeChild(element);
      element = component(); // Re-render the "component" to update the click handler.
      document.body.appendChild(element);
    });
  }
}

