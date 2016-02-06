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
    var theText = document.createTextNode(theData.username + ":");
    var pUsername = document.createElement("p");
    pUsername.appendChild(theText);
    dFragment.appendChild(pUsername);
    theText = document.createTextNode(theData.data);
    var pMessage = document.createElement("p");
    pMessage.appendChild((theText));
    dFragment.appendChild(pMessage);
    var timestamp = new Date();
    timestamp = timestamp.toTimeString();
    theText = document.createTextNode(timestamp);
    var pTimestamp = document.createElement("p");
    pTimestamp.appendChild((theText));
    dFragment.appendChild(pTimestamp);
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
    this.theSubmitButton = this.setupDiv.querySelectorAll("input")[6];
    this.aMemory = null;
}

function setup(aSetup){
    aSetup.theSubmitButton.addEventListener("click", function(){
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[0];
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "red";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[1];
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "yellow";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[2];
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.style.background = "orange";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[3];
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(4, 4, aSetup.setupDiv.nextElementSibling);
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[4];
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(2, 2, aSetup.setupDiv.nextElementSibling);
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[5];
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

var Twitch = require("./Twitch.js");

function NewTwitch(theDiv){

    this.aDiv = theDiv;

}

function setup(aSetup){

        aSetup.aTwitch = new Twitch(aSetup.aDiv);
        aSetup.aTwitch.connect();
}

NewTwitch.prototype.readyUp = function(){
    setup(this);
};

module.exports = NewTwitch;

},{"./Twitch.js":6}],6:[function(require,module,exports){
"use strict";

function Twitch(aWindow){

    this.aDiv = aWindow;
    this.inputField = this.aDiv.querySelectorAll("input")[0];
    this.searchButton = this.aDiv.querySelectorAll("input")[1];
    this.removeButton = this.aDiv.querySelectorAll("input")[2];
    this.aRequest = null;
    this.aSearch = null;

}

Twitch.prototype.connect = function(){

    this.searchButton.addEventListener("click", function(){
        this.aRequest = new XMLHttpRequest();
        this.aSearch = this.inputField.value;
        this.aRequest.open("GET", "https://api.twitch.tv/kraken/streams/" + this.aSearch );
        this.aRequest.send();

        this.aRequest.addEventListener("load", function(){
            if(this.aRequest.status < 400 && this.inputField.value !== "") {
                var theFrame = document.createElement("iframe");
                theFrame.setAttribute("src", "http://twitch.tv/" + this.aSearch + "/embed");
                theFrame.setAttribute("allowFullScreen", "");
                this.aDiv.nextElementSibling.appendChild(theFrame);
                this.inputField.value = "";
            }
            else{
                var anObject = this;
                this.inputField.value = "";
                this.inputField.placeholder = "User not found";
                setTimeout(function(){
                    anObject.inputField.placeholder = "Search Twitch channel";
                },1000);
            }
        }.bind(this));
    }.bind(this));

    this.removeButton.addEventListener("click", function(){

        var theDiv =  this.aDiv.nextElementSibling;
        theDiv.removeChild(theDiv.lastElementChild);

    }.bind(this));

};
module.exports = Twitch;

},{}],7:[function(require,module,exports){

"use strict";

var menuBarBottom = document.querySelector("#bottomMenuBar");

var wTemplate = document.querySelector("#windowTemplate");
var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[0];
var aContent = document.querySelector("#content");
aContent.appendChild(aWindow);
closeSymbol.addEventListener("click", function(){
    aContent.removeChild(aWindow);
});
aWindow.firstElementChild.addEventListener("mousedown",function(){

    aContent.addEventListener("mousemove", function moving(event) {
        aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
        aContent.addEventListener("mouseup",function(){
            aContent.removeEventListener("mousemove", moving);
        });
    });
});


var TheChat = require("./NewChat.js");

menuBarBottom.querySelectorAll("img")[1].addEventListener("click", function(){

    var aTemplate = document.querySelector("#chatTemplate");
    var chatWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    theContent.appendChild(chatWindow);
    var chatDiv = chatWindow.firstElementChild.nextElementSibling;
    var aChat = new TheChat(chatDiv);
    aChat.readyUp();

});

var NewMemory = require("./NewMemory.js");

menuBarBottom.querySelectorAll("img")[2].addEventListener("click", function(){

    var aTemplate = document.querySelector("#memoryTemplate");
    var memoryWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    theContent.appendChild(memoryWindow);
    var theDiv = memoryWindow.firstElementChild;
    var aMemory = new NewMemory(theDiv);
    aMemory.readyUp();

});

var NewTwitch = require("./NewTwitch.js");

menuBarBottom.querySelectorAll("img")[0].addEventListener("click", function(){

    var aTemplate = document.querySelector("#twitchTemplate");
    var twitchWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    theContent.appendChild(twitchWindow);
    var twitchDiv = twitchWindow.firstElementChild;
    var aTwitch = new NewTwitch(twitchDiv);
    aTwitch.readyUp();

});



},{"./NewChat.js":3,"./NewMemory.js":4,"./NewTwitch.js":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld1R3aXRjaC5qcyIsImNsaWVudC9zb3VyY2UvanMvVHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gQ2hhdChhV2luZG93LCBhVXNlcm5hbWUpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgdGhpcy5hZGRyZXNzID0gXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiO1xuICAgIHRoaXMuYUtleSA9IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIjtcbiAgICB0aGlzLnNlbmRCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgIHRoaXMud1NvY2tldCA9IG51bGw7XG4gICAgdGhpcy5hVXNlcm5hbWUgPSBhVXNlcm5hbWU7XG5cbn1cblxuQ2hhdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwic2Nyb2xsXCIpO1xuXG4gICAgdGhpcy53U29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLmFkZHJlc3MpO1xuXG4gICAgdGhpcy5zZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWU7XG4gICAgICAgIHRoaXMuc2VuZChtZXNzYWdlKTtcblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLndTb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB2YXIgdGhlRGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIHRoZURhdGEgPSBKU09OLnBhcnNlKHRoZURhdGEpO1xuICAgICAgICBpZih0aGVEYXRhLnR5cGUgIT09IFwiaGVhcnRiZWF0XCIpe1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlKHRoZURhdGEpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXG4gICAgdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZSA9IFwiXCI7XG4gICAgdmFyIHRoZURhdGEgPSB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiBtZXNzYWdlLFxuICAgICAgICB1c2VybmFtZTogdGhpcy5hVXNlcm5hbWUsXG4gICAgICAgIGNoYW5uZWw6IFwiXCIsXG4gICAgICAgIGtleTogdGhpcy5hS2V5XG4gICAgfTtcblxuICAgIHRoZURhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGVEYXRhKTtcbiAgICBpZih0aGlzLndTb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICB0aGlzLndTb2NrZXQuc2VuZCh0aGVEYXRhKTtcbiAgICB9XG59O1xuQ2hhdC5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKHRoZURhdGEpe1xuXG4gICAgdmFyIGRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoZURhdGEudXNlcm5hbWUgKyBcIjpcIik7XG4gICAgdmFyIHBVc2VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBVc2VybmFtZS5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocFVzZXJuYW1lKTtcbiAgICB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhlRGF0YS5kYXRhKTtcbiAgICB2YXIgcE1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwTWVzc2FnZS5hcHBlbmRDaGlsZCgodGhlVGV4dCkpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwTWVzc2FnZSk7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgdGltZXN0YW1wID0gdGltZXN0YW1wLnRvVGltZVN0cmluZygpO1xuICAgIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aW1lc3RhbXApO1xuICAgIHZhciBwVGltZXN0YW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcFRpbWVzdGFtcC5hcHBlbmRDaGlsZCgodGhlVGV4dCkpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwVGltZXN0YW1wKTtcbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChkRnJhZ21lbnQpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gTWVtb3J5KHJvd3MsIGNvbHMsIGFXaW5kb3cpe1xuXG4gICAgdGhpcy5yb3dzID0gcm93cztcbiAgICB0aGlzLmNvbHMgPSBjb2xzO1xuICAgIHRoaXMuYnJpY2tzID0gW107XG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmZpcnN0QnJpY2sgPSBudWxsO1xuICAgIHRoaXMuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgIHRoaXMudmljdG9yeUNvbmRpdGlvbiA9IChyb3dzKmNvbHMpLzI7XG4gICAgdGhpcy5wYWlycyA9IDA7XG4gICAgdGhpcy50cmllcyA9IDA7XG5cblxufVxuXG5mdW5jdGlvbiB0dXJuQUJyaWNrKHRoZUluZGV4LCBicmljaywgbWVtb3J5KXtcbiAgICBpZighbWVtb3J5LnNlY29uZEJyaWNrKSB7XG4gICAgICAgIHZhciBhSW1nID0gbWVtb3J5LmFEaXYucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVt0aGVJbmRleF07XG4gICAgICAgIGFJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyBicmljayArIFwiLnBuZ1wiKTtcbiAgICAgICAgaWYgKG1lbW9yeS5maXJzdEJyaWNrICE9PSBhSW1nKSB7XG4gICAgICAgICAgICBpZiAoIW1lbW9yeS5maXJzdEJyaWNrKSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBhSW1nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gYUltZztcbiAgICAgICAgICAgICAgICBtZW1vcnkudHJpZXMrKztcblxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljay5zcmMgPT09IG1lbW9yeS5zZWNvbmRCcmljay5zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnBhaXJzKys7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYobWVtb3J5LnBhaXJzID09PSBtZW1vcnkudmljdG9yeUNvbmRpdGlvbil7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlT3V0cHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllvdSBoYXZlIHdvbiEgTnVtYmVyIG9mIHRyaWVzOiBcIiArIG1lbW9yeS50cmllcyArIFwiLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZU91dHB1dC5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5hRGl2LmFwcGVuZENoaWxkKHRoZU91dHB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2suc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrRXZlbnQoaSwgbGlua1RvSW1nLCBtZW1vcnkpe1xuICAgIGxpbmtUb0ltZy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHR1cm5BQnJpY2soaSwgbWVtb3J5LmJyaWNrc1tpXSwgbWVtb3J5KTtcbiAgICB9KTtcbn1cblxuTWVtb3J5LnByb3RvdHlwZS5nZXRCcmlja3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYUltZztcbiAgICB2YXIgYUxpbmtUb0ltZztcblxuICAgIGZvciAoaSA9IDA7IGkgPCAodGhpcy5yb3dzKnRoaXMuY29scyk7IGkrKyl7XG5cbiAgICAgICAgYUxpbmtUb0ltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhTGlua1RvSW1nLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xuICAgICAgICBhSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgYUltZy5jbGFzc0xpc3QuYWRkKFwiaW1hZ2VTaXplXCIpO1xuICAgICAgICBhSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgICAgICBhTGlua1RvSW1nLmFwcGVuZENoaWxkKGFJbWcpO1xuICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoYUxpbmtUb0ltZyk7XG4gICAgICAgIGNsaWNrRXZlbnQoaSwgYUxpbmtUb0ltZywgdGhpcyk7XG5cbiAgICAgICAgaWYoKChpKzEpICUgdGhpcy5jb2xzKSA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5NZW1vcnkucHJvdG90eXBlLmdldE1lbW9yeUFycmF5ID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMTsgaSA8PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKS8yOyBpKyspe1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgIH1cbn07XG5cbk1lbW9yeS5wcm90b3R5cGUuc2h1ZmZlbEJyaWNrcyA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgaTtcbiAgICB2YXIgck51bTtcbiAgICB2YXIgdGVtcDtcblxuICAgIGZvciAoaSA9ICh0aGlzLnJvd3MqdGhpcy5jb2xzLTEpOyBpID4gMDsgaS0tKXtcbiAgICAgICAgIHJOdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBpKTtcblxuICAgICAgICB0ZW1wID0gdGhpcy5icmlja3Nbck51bV07XG4gICAgICAgIHRoaXMuYnJpY2tzW3JOdW1dID0gdGhpcy5icmlja3NbaV07XG4gICAgICAgIHRoaXMuYnJpY2tzW2ldID0gdGVtcDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2hhdCA9IHJlcXVpcmUoXCIuL0NoYXQuanNcIik7XG5cbmZ1bmN0aW9uIE5ld0NoYXQodGhlRGl2KXtcblxuICAgIHRoaXMudXNlcm5hbWUgPSBudWxsO1xuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuICAgIHZhciB1c2VybmFtZSA9IG51bGw7XG4gICAgaWYoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpICE9PSBudWxsKSB7XG4gICAgICAgIHVzZXJuYW1lID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJuYW1lXCIpO1xuICAgICAgICBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFTZXR1cC5hQ2hhdCA9IG5ldyBDaGF0KGFTZXR1cC5hRGl2LCB1c2VybmFtZSk7XG4gICAgICAgIGFTZXR1cC5hQ2hhdC5jb25uZWN0KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgdGhlVXNlcm5hbWVCdXR0b24gPSBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsxXTtcbiAgICAgICAgdGhlVXNlcm5hbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHVzZXJuYW1lID0gYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMF0udmFsdWU7XG4gICAgICAgICAgICBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICBhU2V0dXAuYUNoYXQgPSBuZXcgQ2hhdChhU2V0dXAuYURpdiwgdXNlcm5hbWUpO1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcInVzZXJuYW1lXCIsIHVzZXJuYW1lKTtcbiAgICAgICAgICAgIGFTZXR1cC5hQ2hhdC5jb25uZWN0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuTmV3Q2hhdC5wcm90b3R5cGUucmVhZHlVcCA9IGZ1bmN0aW9uKCl7XG4gICAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld0NoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIE1lbW9yeSA9IHJlcXVpcmUoXCIuL01lbW9yeS5qc1wiKTtcbmZ1bmN0aW9uIE5ld01lbW9yeShhV2luZG93KXtcblxuICAgIHRoaXMudGhlUmFkaW9CdXR0b24gPSBudWxsO1xuICAgIHRoaXMuc2V0dXBEaXYgPSBhV2luZG93O1xuICAgIHRoaXMudGhlU3VibWl0QnV0dG9uID0gdGhpcy5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbNl07XG4gICAgdGhpcy5hTWVtb3J5ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcbiAgICBhU2V0dXAudGhlU3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwieWVsbG93XCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsyXTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzNdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSg0LCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzRdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCAyLCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAuc2V0dXBEaXYuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9KTtcbn1cblxuTmV3TWVtb3J5LnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld01lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHdpdGNoID0gcmVxdWlyZShcIi4vVHdpdGNoLmpzXCIpO1xuXG5mdW5jdGlvbiBOZXdUd2l0Y2godGhlRGl2KXtcblxuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuXG4gICAgICAgIGFTZXR1cC5hVHdpdGNoID0gbmV3IFR3aXRjaChhU2V0dXAuYURpdik7XG4gICAgICAgIGFTZXR1cC5hVHdpdGNoLmNvbm5lY3QoKTtcbn1cblxuTmV3VHdpdGNoLnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3VHdpdGNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIFR3aXRjaChhV2luZG93KXtcblxuICAgIHRoaXMuYURpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy5pbnB1dEZpZWxkID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICB0aGlzLnNlYXJjaEJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgdGhpcy5yZW1vdmVCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzJdO1xuICAgIHRoaXMuYVJlcXVlc3QgPSBudWxsO1xuICAgIHRoaXMuYVNlYXJjaCA9IG51bGw7XG5cbn1cblxuVHdpdGNoLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMuc2VhcmNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmFSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuYVNlYXJjaCA9IHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5hUmVxdWVzdC5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudHdpdGNoLnR2L2tyYWtlbi9zdHJlYW1zL1wiICsgdGhpcy5hU2VhcmNoICk7XG4gICAgICAgIHRoaXMuYVJlcXVlc3Quc2VuZCgpO1xuXG4gICAgICAgIHRoaXMuYVJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHRoaXMuYVJlcXVlc3Quc3RhdHVzIDwgNDAwICYmIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHZhciB0aGVGcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaHR0cDovL3R3aXRjaC50di9cIiArIHRoaXMuYVNlYXJjaCArIFwiL2VtYmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoZUZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93RnVsbFNjcmVlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKHRoZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2YXIgYW5PYmplY3QgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJVc2VyIG5vdCBmb3VuZFwiO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYW5PYmplY3QuaW5wdXRGaWVsZC5wbGFjZWhvbGRlciA9IFwiU2VhcmNoIFR3aXRjaCBjaGFubmVsXCI7XG4gICAgICAgICAgICAgICAgfSwxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5yZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoZURpdiA9ICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICB0aGVEaXYucmVtb3ZlQ2hpbGQodGhlRGl2Lmxhc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcbm1vZHVsZS5leHBvcnRzID0gVHdpdGNoO1xuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbnVCYXJCb3R0b20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvdHRvbU1lbnVCYXJcIik7XG5cbnZhciB3VGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvd1RlbXBsYXRlXCIpO1xudmFyIGFXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHdUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbnZhciBjbG9zZVN5bWJvbCA9IGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXTtcbnZhciBhQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbmFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuY2xvc2VTeW1ib2wuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgYUNvbnRlbnQucmVtb3ZlQ2hpbGQoYVdpbmRvdyk7XG59KTtcbmFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKCl7XG5cbiAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIG1vdmluZyhldmVudCkge1xuICAgICAgICBhV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyAoZXZlbnQuY2xpZW50WCAtIDE1MCkgKyBcInB4LFwiICsgKGV2ZW50LmNsaWVudFkgLSAxNSkgKyBcInB4LCAwKVwiO1xuICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmluZyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cblxudmFyIFRoZUNoYXQgPSByZXF1aXJlKFwiLi9OZXdDaGF0LmpzXCIpO1xuXG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgYVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0VGVtcGxhdGVcIik7XG4gICAgdmFyIGNoYXRXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGFUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB2YXIgdGhlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgICB0aGVDb250ZW50LmFwcGVuZENoaWxkKGNoYXRXaW5kb3cpO1xuICAgIHZhciBjaGF0RGl2ID0gY2hhdFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgdmFyIGFDaGF0ID0gbmV3IFRoZUNoYXQoY2hhdERpdik7XG4gICAgYUNoYXQucmVhZHlVcCgpO1xuXG59KTtcblxudmFyIE5ld01lbW9yeSA9IHJlcXVpcmUoXCIuL05ld01lbW9yeS5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGFUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5VGVtcGxhdGVcIik7XG4gICAgdmFyIG1lbW9yeVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB0aGVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIHRoZUNvbnRlbnQuYXBwZW5kQ2hpbGQobWVtb3J5V2luZG93KTtcbiAgICB2YXIgdGhlRGl2ID0gbWVtb3J5V2luZG93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhTWVtb3J5ID0gbmV3IE5ld01lbW9yeSh0aGVEaXYpO1xuICAgIGFNZW1vcnkucmVhZHlVcCgpO1xuXG59KTtcblxudmFyIE5ld1R3aXRjaCA9IHJlcXVpcmUoXCIuL05ld1R3aXRjaC5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGFUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHdpdGNoVGVtcGxhdGVcIik7XG4gICAgdmFyIHR3aXRjaFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB0aGVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIHRoZUNvbnRlbnQuYXBwZW5kQ2hpbGQodHdpdGNoV2luZG93KTtcbiAgICB2YXIgdHdpdGNoRGl2ID0gdHdpdGNoV2luZG93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhVHdpdGNoID0gbmV3IE5ld1R3aXRjaCh0d2l0Y2hEaXYpO1xuICAgIGFUd2l0Y2gucmVhZHlVcCgpO1xuXG59KTtcblxuXG4iXX0=
