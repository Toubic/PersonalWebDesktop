(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function Chat(aWindow){

    this.aDiv = aWindow.nextElementSibling;
    this.address = "ws://vhost3.lnu.se:20080/socket/";
    this.aKey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.sendButton = this.aDiv.querySelectorAll("input")[0];
    this.wSocket = null;
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
        username: "Tobbe",
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

},{"./Memory.js":2}],4:[function(require,module,exports){

"use strict";

var TheChat = require("./Chat.js");
var chatDiv = document.querySelector("#chatTop");
var aChat = new TheChat(chatDiv);
aChat.connect();


var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();



},{"./Chat.js":1,"./NewMemory.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIENoYXQoYVdpbmRvdyl7XG5cbiAgICB0aGlzLmFEaXYgPSBhV2luZG93Lm5leHRFbGVtZW50U2libGluZztcbiAgICB0aGlzLmFkZHJlc3MgPSBcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCI7XG4gICAgdGhpcy5hS2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuc2VuZEJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMF07XG4gICAgdGhpcy53U29ja2V0ID0gbnVsbDtcbn1cblxuQ2hhdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwic2Nyb2xsXCIpO1xuXG4gICAgdGhpcy53U29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLmFkZHJlc3MpO1xuXG4gICAgdGhpcy5zZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWU7XG4gICAgICAgIHRoaXMuc2VuZChtZXNzYWdlKTtcblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLndTb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB2YXIgdGhlRGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIHRoZURhdGEgPSBKU09OLnBhcnNlKHRoZURhdGEpO1xuICAgICAgICBpZih0aGVEYXRhLnR5cGUgIT09IFwiaGVhcnRiZWF0XCIpe1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlKHRoZURhdGEpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXG4gICAgdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZSA9IFwiXCI7XG4gICAgdmFyIHRoZURhdGEgPSB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiBtZXNzYWdlLFxuICAgICAgICB1c2VybmFtZTogXCJUb2JiZVwiLFxuICAgICAgICBjaGFubmVsOiBcIlwiLFxuICAgICAgICBrZXk6IHRoaXMuYUtleVxuICAgIH07XG5cbiAgICB0aGVEYXRhID0gSlNPTi5zdHJpbmdpZnkodGhlRGF0YSk7XG4gICAgaWYodGhpcy53U29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICB0aGlzLndTb2NrZXQuc2VuZCh0aGVEYXRhKTtcbiAgICB9XG59O1xuQ2hhdC5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKHRoZURhdGEpe1xuXG4gICAgdmFyIGRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoZURhdGEudXNlcm5hbWUgKyBcIjogXCIpO1xuICAgIHZhciBwVXNlcm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwVXNlcm5hbWUuYXBwZW5kQ2hpbGQodGhlVGV4dCk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBVc2VybmFtZSk7XG4gICAgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoZURhdGEuZGF0YSk7XG4gICAgdmFyIHBNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcE1lc3NhZ2UuYXBwZW5kQ2hpbGQoKHRoZVRleHQpKTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocE1lc3NhZ2UpO1xuICAgIHRoaXMuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKGRGcmFnbWVudCk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBNZW1vcnkocm93cywgY29scywgYVdpbmRvdyl7XG5cbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICB0aGlzLmFEaXYgPSBhV2luZG93O1xuICAgIHRoaXMuZmlyc3RCcmljayA9IG51bGw7XG4gICAgdGhpcy5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgdGhpcy52aWN0b3J5Q29uZGl0aW9uID0gKHJvd3MqY29scykvMjtcbiAgICB0aGlzLnBhaXJzID0gMDtcbiAgICB0aGlzLnRyaWVzID0gMDtcblxuXG59XG5cbmZ1bmN0aW9uIHR1cm5BQnJpY2sodGhlSW5kZXgsIGJyaWNrLCBtZW1vcnkpe1xuICAgIGlmKCFtZW1vcnkuc2Vjb25kQnJpY2spIHtcbiAgICAgICAgdmFyIGFJbWcgPSBtZW1vcnkuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpW3RoZUluZGV4XTtcbiAgICAgICAgYUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIGJyaWNrICsgXCIucG5nXCIpO1xuICAgICAgICBpZiAobWVtb3J5LmZpcnN0QnJpY2sgIT09IGFJbWcpIHtcbiAgICAgICAgICAgIGlmICghbWVtb3J5LmZpcnN0QnJpY2spIHtcbiAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IGFJbWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBhSW1nO1xuICAgICAgICAgICAgICAgIG1lbW9yeS50cmllcysrO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5maXJzdEJyaWNrLnNyYyA9PT0gbWVtb3J5LnNlY29uZEJyaWNrLnNyYykge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkucGFpcnMrKztcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZihtZW1vcnkucGFpcnMgPT09IG1lbW9yeS52aWN0b3J5Q29uZGl0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWW91IGhhdmUgd29uISBOdW1iZXIgb2YgdHJpZXM6IFwiICsgbWVtb3J5LnRyaWVzICsgXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3V0cHV0LmFwcGVuZENoaWxkKHRoZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmFEaXYuYXBwZW5kQ2hpbGQodGhlT3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xpY2tFdmVudChpLCBsaW5rVG9JbWcsIG1lbW9yeSl7XG4gICAgbGlua1RvSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdHVybkFCcmljayhpLCBtZW1vcnkuYnJpY2tzW2ldLCBtZW1vcnkpO1xuICAgIH0pO1xufVxuXG5NZW1vcnkucHJvdG90eXBlLmdldEJyaWNrcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpO1xuICAgIHZhciBhSW1nO1xuICAgIHZhciBhTGlua1RvSW1nO1xuXG4gICAgZm9yIChpID0gMDsgaSA8ICh0aGlzLnJvd3MqdGhpcy5jb2xzKTsgaSsrKXtcblxuICAgICAgICBhTGlua1RvSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGFMaW5rVG9JbWcuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgICAgIGFJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBhSW1nLmNsYXNzTGlzdC5hZGQoXCJpbWFnZVNpemVcIik7XG4gICAgICAgIGFJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgIGFMaW5rVG9JbWcuYXBwZW5kQ2hpbGQoYUltZyk7XG4gICAgICAgIHRoaXMuYURpdi5hcHBlbmRDaGlsZChhTGlua1RvSW1nKTtcbiAgICAgICAgY2xpY2tFdmVudChpLCBhTGlua1RvSW1nLCB0aGlzKTtcblxuICAgICAgICBpZigoKGkrMSkgJSB0aGlzLmNvbHMpID09PSAwKXtcbiAgICAgICAgICAgIHRoaXMuYURpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbk1lbW9yeS5wcm90b3R5cGUuZ2V0TWVtb3J5QXJyYXkgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGk7XG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9ICh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpLzI7IGkrKyl7XG4gICAgICAgIHRoaXMuYnJpY2tzLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYnJpY2tzLnB1c2goaSk7XG4gICAgfVxufTtcblxuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmVsQnJpY2tzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuICAgIHZhciByTnVtO1xuICAgIHZhciB0ZW1wO1xuXG4gICAgZm9yIChpID0gKHRoaXMucm93cyp0aGlzLmNvbHMtMSk7IGkgPiAwOyBpLS0pe1xuICAgICAgICAgck51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpO1xuXG4gICAgICAgIHRlbXAgPSB0aGlzLmJyaWNrc1tyTnVtXTtcbiAgICAgICAgdGhpcy5icmlja3Nbck51bV0gPSB0aGlzLmJyaWNrc1tpXTtcbiAgICAgICAgdGhpcy5icmlja3NbaV0gPSB0ZW1wO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnkuanNcIik7XG5mdW5jdGlvbiBOZXdNZW1vcnkoYVdpbmRvdyl7XG5cbiAgICB0aGlzLnRoZVJhZGlvQnV0dG9uID0gbnVsbDtcbiAgICB0aGlzLnNldHVwRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLnRoZVN1Ym1pdEJ1dHRvbiA9IHRoaXMuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVCdXR0b25cIik7XG4gICAgdGhpcy5hTWVtb3J5ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcbiAgICBhU2V0dXAudGhlU3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVSZWRcIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwicmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlWWVsbG93XCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcInllbGxvd1wiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZU9yYW5nZVwiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZUZvdXJUb0ZvdXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlRm91clRvRm91clwiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeSA9IG5ldyBNZW1vcnkoNCwgNCwgYVNldHVwLnNldHVwRGl2Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRNZW1vcnlBcnJheSgpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuc2h1ZmZlbEJyaWNrcygpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0QnJpY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlVHdvVG9Ud29cIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkgPSBuZXcgTWVtb3J5KDIsIDIsIGFTZXR1cC5zZXR1cERpdi5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0TWVtb3J5QXJyYXkoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LnNodWZmZWxCcmlja3MoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldEJyaWNrcygpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZVR3b1RvRm91clwiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeSA9IG5ldyBNZW1vcnkoMiwgNCwgYVNldHVwLnNldHVwRGl2Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRNZW1vcnlBcnJheSgpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuc2h1ZmZlbEJyaWNrcygpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0QnJpY2tzKCk7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnNldHVwRGl2LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfSk7XG59XG5cbk5ld01lbW9yeS5wcm90b3R5cGUucmVhZHlVcCA9IGZ1bmN0aW9uKCl7XG4gIHNldHVwKHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdNZW1vcnk7XG4iLCJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgVGhlQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XG52YXIgY2hhdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdFRvcFwiKTtcbnZhciBhQ2hhdCA9IG5ldyBUaGVDaGF0KGNoYXREaXYpO1xuYUNoYXQuY29ubmVjdCgpO1xuXG5cbnZhciBOZXdNZW1vcnkgPSByZXF1aXJlKFwiLi9OZXdNZW1vcnkuanNcIik7XG5cbnZhciB0aGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RoZVNldHVwXCIpO1xudmFyIGFNZW1vcnkgPSBuZXcgTmV3TWVtb3J5KHRoZURpdik7XG5hTWVtb3J5LnJlYWR5VXAoKTtcblxuXG4iXX0=
