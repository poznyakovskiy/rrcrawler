// ==UserScript==
// @name        rrcrawler
// @namespace   rrscripts
// @description Collects market data from RivalRegions
// @include     http://rivalregions.com/#storage/listed*
// @version     1
// @grant       none
// ==/UserScript==

function collectDataAction (event) {
  alert ("Stub!");
}

window.addEventListener('load', function() {
  setTimeout (function () {
    // create an additional button
    var button       = document.createElement ('div');
    button.innerHTML = '<button id="collectButton">Collect data</button>';
    document.getElementById("header_slide").appendChild(button);
    
    // connect button to event listener
    document.getElementById ("collectButton").addEventListener (
      "click", collectDataAction, false
    );
  }, 3000)
}, false);


