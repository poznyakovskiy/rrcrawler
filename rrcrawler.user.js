// ==UserScript==
// @name        rrcrawler
// @namespace   rrscripts
// @description Collects market data from RivalRegions
// @include     http://rivalregions.com/#storage/listed*
// @version     1
// @grant       none
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.min.js
// ==/UserScript==

// auxiliary function for getting strings with leading zeros
// source: http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function collectDataAction (event) {
  var list = document.getElementById ("list_tbody").children;
  var textBody = "";
  var fileName;
  var dateTime;
  var node;
  var blob;
  var url;
  var i;
  var j;
  
  // create file content
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
  
  // create file name
  // get resource id from url
  url = window.location.href;
  fileName = url.substr (url.lastIndexOf('/')+1, url.length-1) + "_";
  
  // get current date and time
  dateTime = new Date ();
  fileName += String(dateTime.getFullYear()).substr(2,3) +
                pad(dateTime.getMonth()+1,2) +
                pad(dateTime.getDate(),2) + "_" +
                pad(dateTime.getHours(),2) + 
                pad(dateTime.getMinutes(),2);
  
  // that's the format
  fileName += ".csv";
  
  blob = new Blob([textBody], {type: "text/plain;charset=utf-16"});
  saveAs(blob, fileName);
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


