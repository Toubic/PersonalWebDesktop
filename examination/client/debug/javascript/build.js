(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function Chat(aWindow, aUsername){

    this.aDiv = aWindow.nextElementSibling;
    this.address = "ws://vhost3.lnu.se:20080/socket/";
    this.aKey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.sendButton = this.aDiv.querySelectorAll("input")[0];
    this.wSocket = null;
    this.aUsername = aUsername;
}

Chat.prototype.connect = function(){

    this.aDiv.previousElementSibling.classList.add("scroll");

    this.wSocket = new WebSocket(this.address);

    this.sendButton.addEventListener("click", function(){
        var message = this.aDiv.querySelectorAll("textarea")[0].value;
        this.send(message);

    }.bind(this));

    this.wSocket.addEventListener("message", function(event){
        var theData = event.data;
        theData = JSON.parse(theData);
        if(theData.type !== "heartbeat"){
            this.receive(theData);
        }
    }.bind(this));

};

Chat.prototype.send = function(message){

    this.aDiv.querySelectorAll("textarea")[0].value = "";
    var theData = {
        type: "message",
        data: message,
        username: this.aUsername,
        channel: "",
        key: this.aKey
    };

    theData = JSON.stringify(theData);
    if(this.wSocket.readyState === 1) {
    this.wSocket.send(theData);
    }
};
Chat.prototype.receive = function(theData){

    var dFragment = document.createDocumentFragment();
    var theText = document.createTextNode(theData.username + ": ");
    var pUsername = document.createElement("p");
    pUsername.appendChild(theText);
    dFragment.appendChild(pUsername);
    theText = document.createTextNode(theData.data);
    var pMessage = document.createElement("p");
    pMessage.appendChild((theText));
    dFragment.appendChild(pMessage);
    this.aDiv.previousElementSibling.appendChild(dFragment);

};

module.exports = Chat;

},{}],2:[function(require,module,exports){
"use strict";

function Memory(rows, cols, aWindow){

    this.rows = rows;
    this.cols = cols;
    this.bricks = [];
    this.aDiv = aWindow;
    this.firstBrick = null;
    this.secondBrick = null;
    this.victoryCondition = (rows*cols)/2;
    this.pairs = 0;
    this.tries = 0;


}

function turnABrick(theIndex, brick, memory){
    if(!memory.secondBrick) {
        var aImg = memory.aDiv.querySelectorAll("img")[theIndex];
        aImg.setAttribute("src", "image/" + brick + ".png");
        if (memory.firstBrick !== aImg) {
            if (!memory.firstBrick) {
                memory.firstBrick = aImg;
            }
            else {
                memory.secondBrick = aImg;
                memory.tries++;

                if (memory.firstBrick.src === memory.secondBrick.src) {
                    memory.pairs++;
                    setTimeout(function () {
                    memory.firstBrick.parentElement.classList.add("hidden");
                    memory.secondBrick.parentElement.classList.add("hidden");
                    memory.firstBrick = null;
                    memory.secondBrick = null;
                    if(memory.pairs === memory.victoryCondition){
                        var theOutput = document.createElement("h3");
                        var theText = document.createTextNode("You have won! Number of tries: " + memory.tries + ".");
                        theOutput.appendChild(theText);
                        memory.aDiv.appendChild(theOutput);
                    }
                    }, 500);
                }
                else {
                    setTimeout(function () {
                        memory.firstBrick.setAttribute("src", "image/0.png");
                        memory.secondBrick.setAttribute("src", "image/0.png");
                        memory.firstBrick = null;
                        memory.secondBrick = null;
                    }, 1000);
                }
            }
        }
    }
}

function clickEvent(i, linkToImg, memory){
    linkToImg.addEventListener("click", function(){
            turnABrick(i, memory.bricks[i], memory);
    });
}

Memory.prototype.getBricks = function() {
    var i;
    var aImg;
    var aLinkToImg;

    for (i = 0; i < (this.rows*this.cols); i++){

        aLinkToImg = document.createElement("a");
        aLinkToImg.setAttribute("href", "#");
        aImg = document.createElement("img");
        aImg.classList.add("imageSize");
        aImg.setAttribute("src", "image/0.png");
        aLinkToImg.appendChild(aImg);
        this.aDiv.appendChild(aLinkToImg);
        clickEvent(i, aLinkToImg, this);

        if(((i+1) % this.cols) === 0){
            this.aDiv.appendChild(document.createElement("br"));
        }
    }
};



Memory.prototype.getMemoryArray = function(){

    var i;

    for (i = 1; i <= (this.rows * this.cols)/2; i++){
        this.bricks.push(i);
        this.bricks.push(i);
    }
};

Memory.prototype.shuffelBricks = function(){

    var i;
    var rNum;
    var temp;

    for (i = (this.rows*this.cols-1); i > 0; i--){
         rNum = Math.floor(Math.random() * i);

        temp = this.bricks[rNum];
        this.bricks[rNum] = this.bricks[i];
        this.bricks[i] = temp;
    }
};

module.exports = Memory;

},{}],3:[function(require,module,exports){
"use strict";

var Chat = require("./Chat.js");

function NewChat(theDiv){

    this.username = null;
    this.aDiv = theDiv;

}

function setup(aSetup){
    var username = null;
    if(sessionStorage.getItem("username") !== null) {
        username = sessionStorage.getItem("username");
        aSetup.aDiv.previousElementSibling.classList.add("hidden");
        aSetup.aChat = new Chat(aSetup.aDiv, username);
        aSetup.aChat.connect();
    }
    else {
        var theUsernameButton = aSetup.aDiv.previousElementSibling.querySelectorAll("input")[1];
        theUsernameButton.addEventListener("click", function () {
            username = aSetup.aDiv.previousElementSibling.querySelectorAll("input")[0].value;
            aSetup.aDiv.previousElementSibling.classList.add("hidden");
            aSetup.aChat = new Chat(aSetup.aDiv, username);
            sessionStorage.setItem("username", username);
            aSetup.aChat.connect();
        });
    }
}

NewChat.prototype.readyUp = function(){
    setup(this);
};

module.exports = NewChat;

},{"./Chat.js":1}],4:[function(require,module,exports){
"use strict";

var Memory = require("./Memory.js");
function NewMemory(aWindow){

    this.theRadioButton = null;
    this.setupDiv = aWindow;
    this.theSubmitButton = this.setupDiv.querySelector("#theButton");
    this.aMemory = null;
}

function setup(aSetup){
    aSetup.theSubmitButton.addEventListener("click", function(){
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theRed");
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "red";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theYellow");
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "yellow";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theOrange");
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "orange";
            aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theFourToFour");
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theFourToFour");
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(4, 4, aSetup.setupDiv.nextElementSibling);
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theTwoToTwo");
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(2, 2, aSetup.setupDiv.nextElementSibling);
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelector("#theTwoToFour");
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(2, 4, aSetup.setupDiv.nextElementSibling);
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.setupDiv.classList.add("hidden");
    });
}

NewMemory.prototype.readyUp = function(){
  setup(this);
};

module.exports = NewMemory;

},{"./Memory.js":2}],5:[function(require,module,exports){

"use strict";

var TheChat = require("./NewChat.js");
var chatDiv = document.querySelector("#chatTop");
var aChat = new TheChat(chatDiv);
aChat.readyUp();


var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();



},{"./NewChat.js":3,"./NewMemory.js":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIENoYXQoYVdpbmRvdywgYVVzZXJuYW1lKXtcblxuICAgIHRoaXMuYURpdiA9IGFXaW5kb3cubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIHRoaXMuYWRkcmVzcyA9IFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIjtcbiAgICB0aGlzLmFLZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gICAgdGhpcy5zZW5kQnV0dG9uID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICB0aGlzLndTb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuYVVzZXJuYW1lID0gYVVzZXJuYW1lO1xufVxuXG5DaGF0LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJzY3JvbGxcIik7XG5cbiAgICB0aGlzLndTb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMuYWRkcmVzcyk7XG5cbiAgICB0aGlzLnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZW5kKG1lc3NhZ2UpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMud1NvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHZhciB0aGVEYXRhID0gZXZlbnQuZGF0YTtcbiAgICAgICAgdGhlRGF0YSA9IEpTT04ucGFyc2UodGhlRGF0YSk7XG4gICAgICAgIGlmKHRoZURhdGEudHlwZSAhPT0gXCJoZWFydGJlYXRcIil7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUodGhlRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG5DaGF0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgICB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpWzBdLnZhbHVlID0gXCJcIjtcbiAgICB2YXIgdGhlRGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgICAgIHVzZXJuYW1lOiB0aGlzLmFVc2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogXCJcIixcbiAgICAgICAga2V5OiB0aGlzLmFLZXlcbiAgICB9O1xuXG4gICAgdGhlRGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoZURhdGEpO1xuICAgIGlmKHRoaXMud1NvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgdGhpcy53U29ja2V0LnNlbmQodGhlRGF0YSk7XG4gICAgfVxufTtcbkNoYXQucHJvdG90eXBlLnJlY2VpdmUgPSBmdW5jdGlvbih0aGVEYXRhKXtcblxuICAgIHZhciBkRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLnVzZXJuYW1lICsgXCI6IFwiKTtcbiAgICB2YXIgcFVzZXJuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcFVzZXJuYW1lLmFwcGVuZENoaWxkKHRoZVRleHQpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwVXNlcm5hbWUpO1xuICAgIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLmRhdGEpO1xuICAgIHZhciBwTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBNZXNzYWdlLmFwcGVuZENoaWxkKCh0aGVUZXh0KSk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBNZXNzYWdlKTtcbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChkRnJhZ21lbnQpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gTWVtb3J5KHJvd3MsIGNvbHMsIGFXaW5kb3cpe1xuXG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmZpcnN0QnJpY2sgPSBudWxsO1xuICAgIHRoaXMuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgIHRoaXMudmljdG9yeUNvbmRpdGlvbiA9IChyb3dzKmNvbHMpLzI7XG4gICAgdGhpcy5wYWlycyA9IDA7XG4gICAgdGhpcy50cmllcyA9IDA7XG5cblxufVxuXG5mdW5jdGlvbiB0dXJuQUJyaWNrKHRoZUluZGV4LCBicmljaywgbWVtb3J5KXtcbiAgICBpZighbWVtb3J5LnNlY29uZEJyaWNrKSB7XG4gICAgICAgIHZhciBhSW1nID0gbWVtb3J5LmFEaXYucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVt0aGVJbmRleF07XG4gICAgICAgIGFJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyBicmljayArIFwiLnBuZ1wiKTtcbiAgICAgICAgaWYgKG1lbW9yeS5maXJzdEJyaWNrICE9PSBhSW1nKSB7XG4gICAgICAgICAgICBpZiAoIW1lbW9yeS5maXJzdEJyaWNrKSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBhSW1nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gYUltZztcbiAgICAgICAgICAgICAgICBtZW1vcnkudHJpZXMrKztcblxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljay5zcmMgPT09IG1lbW9yeS5zZWNvbmRCcmljay5zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnBhaXJzKys7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYobWVtb3J5LnBhaXJzID09PSBtZW1vcnkudmljdG9yeUNvbmRpdGlvbil7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlT3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllvdSBoYXZlIHdvbiEgTnVtYmVyIG9mIHRyaWVzOiBcIiArIG1lbW9yeS50cmllcyArIFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU91dHB1dC5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5hRGl2LmFwcGVuZENoaWxkKHRoZU91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrRXZlbnQoaSwgbGlua1RvSW1nLCBtZW1vcnkpe1xuICAgIGxpbmtUb0ltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHR1cm5BQnJpY2soaSwgbWVtb3J5LmJyaWNrc1tpXSwgbWVtb3J5KTtcbiAgICB9KTtcbn1cblxuTWVtb3J5LnByb3RvdHlwZS5nZXRCcmlja3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYUltZztcbiAgICB2YXIgYUxpbmtUb0ltZztcblxuICAgIGZvciAoaSA9IDA7IGkgPCAodGhpcy5yb3dzKnRoaXMuY29scyk7IGkrKyl7XG5cbiAgICAgICAgYUxpbmtUb0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhTGlua1RvSW1nLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBhSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgYUltZy5jbGFzc0xpc3QuYWRkKFwiaW1hZ2VTaXplXCIpO1xuICAgICAgICBhSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgICAgICBhTGlua1RvSW1nLmFwcGVuZENoaWxkKGFJbWcpO1xuICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoYUxpbmtUb0ltZyk7XG4gICAgICAgIGNsaWNrRXZlbnQoaSwgYUxpbmtUb0ltZywgdGhpcyk7XG5cbiAgICAgICAgaWYoKChpKzEpICUgdGhpcy5jb2xzKSA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5NZW1vcnkucHJvdG90eXBlLmdldE1lbW9yeUFycmF5ID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMTsgaSA8PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKS8yOyBpKyspe1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgIH1cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZlbEJyaWNrcyA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgck51bTtcbiAgICB2YXIgdGVtcDtcblxuICAgIGZvciAoaSA9ICh0aGlzLnJvd3MqdGhpcy5jb2xzLTEpOyBpID4gMDsgaS0tKXtcbiAgICAgICAgIHJOdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcblxuICAgICAgICB0ZW1wID0gdGhpcy5icmlja3Nbck51bV07XG4gICAgICAgIHRoaXMuYnJpY2tzW3JOdW1dID0gdGhpcy5icmlja3NbaV07XG4gICAgICAgIHRoaXMuYnJpY2tzW2ldID0gdGVtcDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XG5cbmZ1bmN0aW9uIE5ld0NoYXQodGhlRGl2KXtcblxuICAgIHRoaXMudXNlcm5hbWUgPSBudWxsO1xuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuICAgIHZhciB1c2VybmFtZSA9IG51bGw7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9PSBudWxsKSB7XG4gICAgICAgIHVzZXJuYW1lID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpO1xuICAgICAgICBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFTZXR1cC5hQ2hhdCA9IG5ldyBDaGF0KGFTZXR1cC5hRGl2LCB1c2VybmFtZSk7XG4gICAgICAgIGFTZXR1cC5hQ2hhdC5jb25uZWN0KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdGhlVXNlcm5hbWVCdXR0b24gPSBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsxXTtcbiAgICAgICAgdGhlVXNlcm5hbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVzZXJuYW1lID0gYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMF0udmFsdWU7XG4gICAgICAgICAgICBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICBhU2V0dXAuYUNoYXQgPSBuZXcgQ2hhdChhU2V0dXAuYURpdiwgdXNlcm5hbWUpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcbiAgICAgICAgICAgIGFTZXR1cC5hQ2hhdC5jb25uZWN0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuTmV3Q2hhdC5wcm90b3R5cGUucmVhZHlVcCA9IGZ1bmN0aW9uKCl7XG4gICAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0NoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeS5qc1wiKTtcbmZ1bmN0aW9uIE5ld01lbW9yeShhV2luZG93KXtcblxuICAgIHRoaXMudGhlUmFkaW9CdXR0b24gPSBudWxsO1xuICAgIHRoaXMuc2V0dXBEaXYgPSBhV2luZG93O1xuICAgIHRoaXMudGhlU3VibWl0QnV0dG9uID0gdGhpcy5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZUJ1dHRvblwiKTtcbiAgICB0aGlzLmFNZW1vcnkgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuICAgIGFTZXR1cC50aGVTdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZVJlZFwiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVZZWxsb3dcIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwieWVsbG93XCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlT3JhbmdlXCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIm9yYW5nZVwiO1xuICAgICAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlRm91clRvRm91clwiKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVGb3VyVG9Gb3VyXCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSg0LCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVUd29Ub1R3b1wiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeSA9IG5ldyBNZW1vcnkoMiwgMiwgYVNldHVwLnNldHVwRGl2Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRNZW1vcnlBcnJheSgpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuc2h1ZmZlbEJyaWNrcygpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0QnJpY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlVHdvVG9Gb3VyXCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAuc2V0dXBEaXYuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9KTtcbn1cblxuTmV3TWVtb3J5LnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld01lbW9yeTtcbiIsIlxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUaGVDaGF0ID0gcmVxdWlyZShcIi4vTmV3Q2hhdC5qc1wiKTtcbnZhciBjaGF0RGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0VG9wXCIpO1xudmFyIGFDaGF0ID0gbmV3IFRoZUNoYXQoY2hhdERpdik7XG5hQ2hhdC5yZWFkeVVwKCk7XG5cblxudmFyIE5ld01lbW9yeSA9IHJlcXVpcmUoXCIuL05ld01lbW9yeS5qc1wiKTtcblxudmFyIHRoZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlU2V0dXBcIik7XG52YXIgYU1lbW9yeSA9IG5ldyBOZXdNZW1vcnkodGhlRGl2KTtcbmFNZW1vcnkucmVhZHlVcCgpO1xuXG5cbiJdfQ==
