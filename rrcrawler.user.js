// ==UserScript==
// @name        rrcrawler
// @namespace   rrscripts
// @description Collects market data from RivalRegions
// @include     http://rivalregions.com/#storage/listed*
// @version     1
// @grant       none
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.min.js
// ==/UserScript==

function collectDataAction (event) {
  var list = document.getElementById ("list_tbody").children;
  var textBody = "";
  var fileName = "";
  var node;
  var blob;
  var i;
  var j;
  
  for (i = 0; i < list.length; ++i) {
    node = list[i];
    
    // fetch bidder's name
    textBody += node.children[1].children[0].innerHTML + ",";
    
    // fetch location
    textBody += node.children[1].children[2].innerHTML + ",";
    
    // fetch amount, distance, price and adjusted price
    for (j = 2; j <= 5; ++j) {
      textBody += node.children[j].getAttribute("rat");
      if (j != 5) {
        textBody += ",";
      }
    }
    
    // end line
    textBody += "\n";
  }
  blob = new Blob([textBody], {type: "text/plain;charset=utf-16"});
  saveAs(blob, "data.csv");
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


