const send = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function fake(value) {
  this.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentage = Math.round((e.loaded / e.total) * 100);
      document.getElementById('loader').innerHTML = `${percentage} %`;
    }
    else {
      console.log('Unable to compute progress information since the total size is unknown');
    }
  }, false);
  send.call(this, value);
};

const transferComplete = () => {
  console.log('The transfer is complete.');
  document.getElementById('loader').classList.add('fadeOut');

  XMLHttpRequest.prototype.send = send;
};

const transferFailed = (error) => {
  console.log('An error occurred while transferring the file.', error);
};

import(/* webpackChunkName: 'app' */ 'babel-polyfill');
import(/* webpackChunkName: 'app' */ '../../App')
  .then(transferComplete)
  .catch(error => transferFailed(error));

