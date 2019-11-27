// Polyfills that aren't done using babel go here
// In general we want to manage them with babel

/* eslint-disable no-extend-native */
import 'details-element-polyfill';
import 'url-search-params-polyfill';
import 'intersection-observer';

if (!String.prototype.trimStart) {
  String.prototype.trimStart = String.prototype.trimLeft;
}
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = String.prototype.trimRight;
}

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill
/* eslint-disable */
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var dataURL = this.toDataURL(type, quality).split(',')[1];
      setTimeout(function() {

        var binStr = atob( dataURL ),
            len = binStr.length,
            arr = new Uint8Array(len);

        for (var i = 0; i < len; i++ ) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback( new Blob( [arr], {type: type || 'image/png'} ) );

      });
    }
  });
}
/* eslint-enable */

/* eslint-enable no-extend-native */
