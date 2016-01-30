(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function Chat(aWindow){

    this.aDiv = aWindow;
    this.address = "ws://vhost3.lnu.se:20080/socket/";
    this.aKey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.sendButton = aWindow.querySelectorAll("input")[0];
    this.wSocket = null;

}

Chat.prototype.connect = function(){

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
    this.aDiv.nextElementSibling.appendChild(dFragment);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBDaGF0KGFXaW5kb3cpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmFkZHJlc3MgPSBcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCI7XG4gICAgdGhpcy5hS2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuc2VuZEJ1dHRvbiA9IGFXaW5kb3cucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgIHRoaXMud1NvY2tldCA9IG51bGw7XG5cbn1cblxuQ2hhdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLndTb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMuYWRkcmVzcyk7XG5cbiAgICB0aGlzLnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZW5kKG1lc3NhZ2UpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMud1NvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHZhciB0aGVEYXRhID0gZXZlbnQuZGF0YTtcbiAgICAgICAgdGhlRGF0YSA9IEpTT04ucGFyc2UodGhlRGF0YSk7XG4gICAgICAgIGlmKHRoZURhdGEudHlwZSAhPT0gXCJoZWFydGJlYXRcIil7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUodGhlRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG5DaGF0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgICB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpWzBdLnZhbHVlID0gXCJcIjtcbiAgICB2YXIgdGhlRGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgICAgIHVzZXJuYW1lOiBcIlRvYmJlXCIsXG4gICAgICAgIGNoYW5uZWw6IFwiXCIsXG4gICAgICAgIGtleTogdGhpcy5hS2V5XG4gICAgfTtcblxuICAgIHRoZURhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGVEYXRhKTtcbiAgICBpZih0aGlzLndTb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgIHRoaXMud1NvY2tldC5zZW5kKHRoZURhdGEpO1xuICAgIH1cbn07XG5DaGF0LnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24odGhlRGF0YSl7XG5cbiAgICB2YXIgZEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhlRGF0YS51c2VybmFtZSArIFwiOiBcIik7XG4gICAgdmFyIHBVc2VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBVc2VybmFtZS5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocFVzZXJuYW1lKTtcbiAgICB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhlRGF0YS5kYXRhKTtcbiAgICB2YXIgcE1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwTWVzc2FnZS5hcHBlbmRDaGlsZCgodGhlVGV4dCkpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwTWVzc2FnZSk7XG4gICAgdGhpcy5hRGl2Lm5leHRFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChkRnJhZ21lbnQpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gTWVtb3J5KHJvd3MsIGNvbHMsIGFXaW5kb3cpe1xuXG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmZpcnN0QnJpY2sgPSBudWxsO1xuICAgIHRoaXMuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgIHRoaXMudmljdG9yeUNvbmRpdGlvbiA9IChyb3dzKmNvbHMpLzI7XG4gICAgdGhpcy5wYWlycyA9IDA7XG4gICAgdGhpcy50cmllcyA9IDA7XG5cblxufVxuXG5mdW5jdGlvbiB0dXJuQUJyaWNrKHRoZUluZGV4LCBicmljaywgbWVtb3J5KXtcbiAgICBpZighbWVtb3J5LnNlY29uZEJyaWNrKSB7XG4gICAgICAgIHZhciBhSW1nID0gbWVtb3J5LmFEaXYucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVt0aGVJbmRleF07XG4gICAgICAgIGFJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyBicmljayArIFwiLnBuZ1wiKTtcbiAgICAgICAgaWYgKG1lbW9yeS5maXJzdEJyaWNrICE9PSBhSW1nKSB7XG4gICAgICAgICAgICBpZiAoIW1lbW9yeS5maXJzdEJyaWNrKSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBhSW1nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gYUltZztcbiAgICAgICAgICAgICAgICBtZW1vcnkudHJpZXMrKztcblxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljay5zcmMgPT09IG1lbW9yeS5zZWNvbmRCcmljay5zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnBhaXJzKys7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYobWVtb3J5LnBhaXJzID09PSBtZW1vcnkudmljdG9yeUNvbmRpdGlvbil7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlT3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllvdSBoYXZlIHdvbiEgTnVtYmVyIG9mIHRyaWVzOiBcIiArIG1lbW9yeS50cmllcyArIFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU91dHB1dC5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5hRGl2LmFwcGVuZENoaWxkKHRoZU91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrRXZlbnQoaSwgbGlua1RvSW1nLCBtZW1vcnkpe1xuICAgIGxpbmtUb0ltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHR1cm5BQnJpY2soaSwgbWVtb3J5LmJyaWNrc1tpXSwgbWVtb3J5KTtcbiAgICB9KTtcbn1cblxuTWVtb3J5LnByb3RvdHlwZS5nZXRCcmlja3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYUltZztcbiAgICB2YXIgYUxpbmtUb0ltZztcblxuICAgIGZvciAoaSA9IDA7IGkgPCAodGhpcy5yb3dzKnRoaXMuY29scyk7IGkrKyl7XG5cbiAgICAgICAgYUxpbmtUb0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhTGlua1RvSW1nLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBhSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgYUltZy5jbGFzc0xpc3QuYWRkKFwiaW1hZ2VTaXplXCIpO1xuICAgICAgICBhSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgICAgICBhTGlua1RvSW1nLmFwcGVuZENoaWxkKGFJbWcpO1xuICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoYUxpbmtUb0ltZyk7XG4gICAgICAgIGNsaWNrRXZlbnQoaSwgYUxpbmtUb0ltZywgdGhpcyk7XG5cbiAgICAgICAgaWYoKChpKzEpICUgdGhpcy5jb2xzKSA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5NZW1vcnkucHJvdG90eXBlLmdldE1lbW9yeUFycmF5ID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMTsgaSA8PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKS8yOyBpKyspe1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgIH1cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZlbEJyaWNrcyA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgck51bTtcbiAgICB2YXIgdGVtcDtcblxuICAgIGZvciAoaSA9ICh0aGlzLnJvd3MqdGhpcy5jb2xzLTEpOyBpID4gMDsgaS0tKXtcbiAgICAgICAgIHJOdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcblxuICAgICAgICB0ZW1wID0gdGhpcy5icmlja3Nbck51bV07XG4gICAgICAgIHRoaXMuYnJpY2tzW3JOdW1dID0gdGhpcy5icmlja3NbaV07XG4gICAgICAgIHRoaXMuYnJpY2tzW2ldID0gdGVtcDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTWVtb3J5ID0gcmVxdWlyZShcIi4vTWVtb3J5LmpzXCIpO1xuZnVuY3Rpb24gTmV3TWVtb3J5KGFXaW5kb3cpe1xuXG4gICAgdGhpcy50aGVSYWRpb0J1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5zZXR1cERpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy50aGVTdWJtaXRCdXR0b24gPSB0aGlzLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlQnV0dG9uXCIpO1xuICAgIHRoaXMuYU1lbW9yeSA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIHNldHVwKGFTZXR1cCl7XG4gICAgYVNldHVwLnRoZVN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlUmVkXCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZVllbGxvd1wiKTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJ5ZWxsb3dcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVPcmFuZ2VcIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwib3JhbmdlXCI7XG4gICAgICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVGb3VyVG9Gb3VyXCIpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZUZvdXJUb0ZvdXJcIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkgPSBuZXcgTWVtb3J5KDQsIDQsIGFTZXR1cC5zZXR1cERpdi5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0TWVtb3J5QXJyYXkoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LnNodWZmZWxCcmlja3MoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldEJyaWNrcygpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yKFwiI3RoZVR3b1RvVHdvXCIpO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCAyLCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvcihcIiN0aGVUd29Ub0ZvdXJcIik7XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkgPSBuZXcgTWVtb3J5KDIsIDQsIGFTZXR1cC5zZXR1cERpdi5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0TWVtb3J5QXJyYXkoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LnNodWZmZWxCcmlja3MoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldEJyaWNrcygpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0pO1xufVxuXG5OZXdNZW1vcnkucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3TWVtb3J5O1xuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIFRoZUNoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xudmFyIGNoYXREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRUb3BcIik7XG52YXIgYUNoYXQgPSBuZXcgVGhlQ2hhdChjaGF0RGl2KTtcbmFDaGF0LmNvbm5lY3QoKTtcblxuXG52YXIgTmV3TWVtb3J5ID0gcmVxdWlyZShcIi4vTmV3TWVtb3J5LmpzXCIpO1xuXG52YXIgdGhlRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0aGVTZXR1cFwiKTtcbnZhciBhTWVtb3J5ID0gbmV3IE5ld01lbW9yeSh0aGVEaXYpO1xuYU1lbW9yeS5yZWFkeVVwKCk7XG5cblxuIl19
