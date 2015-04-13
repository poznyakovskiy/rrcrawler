// ==UserScript==
// @name        rrcrawler
// @namespace   rrscripts
// @description Collects market data from RivalRegions
// @include     http://rivalregions.com/#storage
// @version     1
// @grant       none
// @require     https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.min.js
// ==/UserScript==

var firstTimeoutDur = 5000;
var subsTimeoutDur = 2000;
var itemsList = [];
var currentItemIndex = 0;

// auxiliary function for getting strings with leading zeros
// source: http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

// extracts and saves data from a table that represents all entries for an item
// receives a list of <tr>'s
function fetchFromTable (list) {
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

function handleStorageItem (item) {
  
  item.click();

  // wait until the storage data loads
  setTimeout (function () {
    var listLink = document.getElementsByClassName ("storage_see");
      
    if (listLink.length == 0) {
      // something has gone wrong; proceed with next item
      handleNextListItem ();
    } else {
      listLink = listLink[0];
      listLink.click ();
        
      setTimeout (function () {
        var close = document.getElementById("slide_close");
          
        fetchFromTable (document.getElementById ("list_tbody").children);
        close.click ();
          
        // done, proceed with the next item
        setTimeout ( handleNextListItem, subsTimeoutDur);
      }, subsTimeoutDur);
    }
  }, subsTimeoutDur);
}

function handleNextListItem () {
  if (currentItemIndex < itemsList.length) {
    handleStorageItem (itemsList[currentItemIndex]);
    ++currentItemIndex;
  } else {
    alert ("Done loading data");
  }
}

function collectDataAction (event) {
  itemsList = document.getElementsByClassName ("storage_item");
  currentItemIndex = 0;
  
  handleNextListItem ();
}

window.addEventListener('load', function() {
  setTimeout (function () {
    // create an additional button
    var button       = document.createElement ('div');
    button.innerHTML = '<button id="collectButton" style="top: 200px;">Collect data</button>';
    document.getElementById("body").appendChild(button);
    
    // connect button to event listener
    document.getElementById ("collectButton").addEventListener (
      "click", collectDataAction, false
    );
  }, firstTimeoutDur);
}, false)


