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

// get item number fron url
function getItemNum (url) {
  return url.substr (url.lastIndexOf('/')+1, url.length-1);
}

// extracts and saves data from a table that represents all entries for an item
// receives a list of <tr>'s
function fetchFromTable () {
  var list = document.getElementById ("list_tbody").children
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
    textBody += "\"" + node.children[1].children[0].innerHTML + "\",";
    
    // fetch location
    textBody += "\"" + node.children[1].children[2].innerHTML + "\",";
    
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
  fileName = getItemNum (url) + "_";
  
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

function fetchAndClose () {
  var close = document.getElementById("slide_close");
  
  if (close == null) {
	  // wait until appearance
    setTimeout (fetchAndClose, subsTimeoutDur);
  } else {
    fetchFromTable ();
    close.click ();
      
    // done, proceed with the next item
    setTimeout (handleNextListItem, subsTimeoutDur);
  }
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
        
      setTimeout (fetchAndClose, subsTimeoutDur);
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

function collectCurrentDataAction (event) {
  var listLink = document.getElementsByClassName ("storage_see")[0];
  
  listLink.click ();
  setTimeout (function () {
    var close = document.getElementById("slide_close");
    
    fetchFromTable ();
    close.click ();
  }, subsTimeoutDur);
}

window.addEventListener('load', function() {
  setTimeout (function () {
    var body = document.getElementById("body");
    var buttonAll;
    var buttonCurrent;
    
    // create a button for collecting all data
    buttonAll       = document.createElement ('div');
    buttonAll.innerHTML = '<button id="collectButton" style="top: 200px;">Collect data</button>';
    body.appendChild(buttonAll);
    
    document.getElementById ("collectButton").addEventListener (
      "click", collectDataAction, false
    );
    
    // create another button for collecting just the data on the current item
    buttonCurrent       = document.createElement ('div');
    buttonCurrent.innerHTML = '<button id="collectButtonCurrent" style="top: 240px;">Collect current</button>';
    body.appendChild(buttonCurrent);
    
    document.getElementById ("collectButtonCurrent").addEventListener (
      "click", collectCurrentDataAction, false
    );
  }, firstTimeoutDur);
}, false)


