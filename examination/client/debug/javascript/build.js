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
            aSetup.setupDiv.parentElement.parentElement.style.background = "red";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[1];
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.parentElement.style.background = "yellow";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[2];
        if (aSetup.theRadioButton.checked) {
            aSetup.setupDiv.parentElement.parentElement.style.background = "orange";
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[3];
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(4, 4, aSetup.setupDiv.nextElementSibling);
            aSetup.setupDiv.classList.add("noneDiv");
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }

        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[4];
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(2, 2, aSetup.setupDiv.nextElementSibling);
            aSetup.setupDiv.classList.add("noneDiv");
            aSetup.aMemory.getMemoryArray();
            aSetup.aMemory.shuffelBricks();
            aSetup.aMemory.getBricks();
        }
        aSetup.theRadioButton = aSetup.setupDiv.querySelectorAll("input")[5];
        if (aSetup.theRadioButton.checked) {
            aSetup.aMemory = new Memory(2, 4, aSetup.setupDiv.nextElementSibling);
            aSetup.setupDiv.classList.add("noneDiv");
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

var TheChat = require("./NewChat.js");

menuBarBottom.querySelectorAll("img")[1].addEventListener("click", function(){

    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/chat.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    var aTemplate = document.querySelector("#chatTemplate");
    var chatWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    aWindow.firstElementChild.nextElementSibling.appendChild(chatWindow);
    var chatDiv = chatWindow.firstElementChild.nextElementSibling;
    var aChat = new TheChat(chatDiv);
    aChat.readyUp();

});

var NewMemory = require("./NewMemory.js");

menuBarBottom.querySelectorAll("img")[2].addEventListener("click", function(){

    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/memory.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    var aTemplate = document.querySelector("#memoryTemplate");
    var memoryWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    aWindow.firstElementChild.nextElementSibling.appendChild(memoryWindow);
    var theDiv = memoryWindow.firstElementChild;
    var aMemory = new NewMemory(theDiv);
    aMemory.readyUp();

});

var NewTwitch = require("./NewTwitch.js");

menuBarBottom.querySelectorAll("img")[0].addEventListener("click", function(){

    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/twitch.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    var aTemplate = document.querySelector("#twitchTemplate");
    var twitchWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    aWindow.firstElementChild.nextElementSibling.appendChild(twitchWindow);
    var twitchDiv = twitchWindow.firstElementChild;
    var aTwitch = new NewTwitch(twitchDiv);
    aTwitch.readyUp();

});



},{"./NewChat.js":3,"./NewMemory.js":4,"./NewTwitch.js":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld1R3aXRjaC5qcyIsImNsaWVudC9zb3VyY2UvanMvVHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBDaGF0KGFXaW5kb3csIGFVc2VybmFtZSl7XG5cbiAgICB0aGlzLmFEaXYgPSBhV2luZG93Lm5leHRFbGVtZW50U2libGluZztcbiAgICB0aGlzLmFkZHJlc3MgPSBcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCI7XG4gICAgdGhpcy5hS2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMuc2VuZEJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMF07XG4gICAgdGhpcy53U29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLmFVc2VybmFtZSA9IGFVc2VybmFtZTtcblxufVxuXG5DaGF0LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJzY3JvbGxcIik7XG5cbiAgICB0aGlzLndTb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMuYWRkcmVzcyk7XG5cbiAgICB0aGlzLnNlbmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtZXNzYWdlID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZW5kKG1lc3NhZ2UpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMud1NvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIHZhciB0aGVEYXRhID0gZXZlbnQuZGF0YTtcbiAgICAgICAgdGhlRGF0YSA9IEpTT04ucGFyc2UodGhlRGF0YSk7XG4gICAgICAgIGlmKHRoZURhdGEudHlwZSAhPT0gXCJoZWFydGJlYXRcIil7XG4gICAgICAgICAgICB0aGlzLnJlY2VpdmUodGhlRGF0YSk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xuXG5DaGF0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgICB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpWzBdLnZhbHVlID0gXCJcIjtcbiAgICB2YXIgdGhlRGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgICAgIHVzZXJuYW1lOiB0aGlzLmFVc2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogXCJcIixcbiAgICAgICAga2V5OiB0aGlzLmFLZXlcbiAgICB9O1xuXG4gICAgdGhlRGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoZURhdGEpO1xuICAgIGlmKHRoaXMud1NvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICAgIHRoaXMud1NvY2tldC5zZW5kKHRoZURhdGEpO1xuICAgIH1cbn07XG5DaGF0LnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24odGhlRGF0YSl7XG5cbiAgICB2YXIgZEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIHZhciB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhlRGF0YS51c2VybmFtZSArIFwiOlwiKTtcbiAgICB2YXIgcFVzZXJuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcFVzZXJuYW1lLmFwcGVuZENoaWxkKHRoZVRleHQpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwVXNlcm5hbWUpO1xuICAgIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLmRhdGEpO1xuICAgIHZhciBwTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBNZXNzYWdlLmFwcGVuZENoaWxkKCh0aGVUZXh0KSk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBNZXNzYWdlKTtcbiAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcbiAgICB0aW1lc3RhbXAgPSB0aW1lc3RhbXAudG9UaW1lU3RyaW5nKCk7XG4gICAgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpbWVzdGFtcCk7XG4gICAgdmFyIHBUaW1lc3RhbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwVGltZXN0YW1wLmFwcGVuZENoaWxkKCh0aGVUZXh0KSk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBUaW1lc3RhbXApO1xuICAgIHRoaXMuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKGRGcmFnbWVudCk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBNZW1vcnkocm93cywgY29scywgYVdpbmRvdyl7XG5cbiAgICB0aGlzLnJvd3MgPSByb3dzO1xuICAgIHRoaXMuY29scyA9IGNvbHM7XG4gICAgdGhpcy5icmlja3MgPSBbXTtcbiAgICB0aGlzLmFEaXYgPSBhV2luZG93O1xuICAgIHRoaXMuZmlyc3RCcmljayA9IG51bGw7XG4gICAgdGhpcy5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgdGhpcy52aWN0b3J5Q29uZGl0aW9uID0gKHJvd3MqY29scykvMjtcbiAgICB0aGlzLnBhaXJzID0gMDtcbiAgICB0aGlzLnRyaWVzID0gMDtcblxuXG59XG5cbmZ1bmN0aW9uIHR1cm5BQnJpY2sodGhlSW5kZXgsIGJyaWNrLCBtZW1vcnkpe1xuICAgIGlmKCFtZW1vcnkuc2Vjb25kQnJpY2spIHtcbiAgICAgICAgdmFyIGFJbWcgPSBtZW1vcnkuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpW3RoZUluZGV4XTtcbiAgICAgICAgYUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIGJyaWNrICsgXCIucG5nXCIpO1xuICAgICAgICBpZiAobWVtb3J5LmZpcnN0QnJpY2sgIT09IGFJbWcpIHtcbiAgICAgICAgICAgIGlmICghbWVtb3J5LmZpcnN0QnJpY2spIHtcbiAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IGFJbWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBhSW1nO1xuICAgICAgICAgICAgICAgIG1lbW9yeS50cmllcysrO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5maXJzdEJyaWNrLnNyYyA9PT0gbWVtb3J5LnNlY29uZEJyaWNrLnNyYykge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkucGFpcnMrKztcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZihtZW1vcnkucGFpcnMgPT09IG1lbW9yeS52aWN0b3J5Q29uZGl0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWW91IGhhdmUgd29uISBOdW1iZXIgb2YgdHJpZXM6IFwiICsgbWVtb3J5LnRyaWVzICsgXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3V0cHV0LmFwcGVuZENoaWxkKHRoZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmFEaXYuYXBwZW5kQ2hpbGQodGhlT3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY2xpY2tFdmVudChpLCBsaW5rVG9JbWcsIG1lbW9yeSl7XG4gICAgbGlua1RvSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdHVybkFCcmljayhpLCBtZW1vcnkuYnJpY2tzW2ldLCBtZW1vcnkpO1xuICAgIH0pO1xufVxuXG5NZW1vcnkucHJvdG90eXBlLmdldEJyaWNrcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpO1xuICAgIHZhciBhSW1nO1xuICAgIHZhciBhTGlua1RvSW1nO1xuXG4gICAgZm9yIChpID0gMDsgaSA8ICh0aGlzLnJvd3MqdGhpcy5jb2xzKTsgaSsrKXtcblxuICAgICAgICBhTGlua1RvSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGFMaW5rVG9JbWcuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XG4gICAgICAgIGFJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICBhSW1nLmNsYXNzTGlzdC5hZGQoXCJpbWFnZVNpemVcIik7XG4gICAgICAgIGFJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XG4gICAgICAgIGFMaW5rVG9JbWcuYXBwZW5kQ2hpbGQoYUltZyk7XG4gICAgICAgIHRoaXMuYURpdi5hcHBlbmRDaGlsZChhTGlua1RvSW1nKTtcbiAgICAgICAgY2xpY2tFdmVudChpLCBhTGlua1RvSW1nLCB0aGlzKTtcblxuICAgICAgICBpZigoKGkrMSkgJSB0aGlzLmNvbHMpID09PSAwKXtcbiAgICAgICAgICAgIHRoaXMuYURpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbk1lbW9yeS5wcm90b3R5cGUuZ2V0TWVtb3J5QXJyYXkgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGk7XG5cbiAgICBmb3IgKGkgPSAxOyBpIDw9ICh0aGlzLnJvd3MgKiB0aGlzLmNvbHMpLzI7IGkrKyl7XG4gICAgICAgIHRoaXMuYnJpY2tzLnB1c2goaSk7XG4gICAgICAgIHRoaXMuYnJpY2tzLnB1c2goaSk7XG4gICAgfVxufTtcblxuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmVsQnJpY2tzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuICAgIHZhciByTnVtO1xuICAgIHZhciB0ZW1wO1xuXG4gICAgZm9yIChpID0gKHRoaXMucm93cyp0aGlzLmNvbHMtMSk7IGkgPiAwOyBpLS0pe1xuICAgICAgICAgck51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpO1xuXG4gICAgICAgIHRlbXAgPSB0aGlzLmJyaWNrc1tyTnVtXTtcbiAgICAgICAgdGhpcy5icmlja3Nbck51bV0gPSB0aGlzLmJyaWNrc1tpXTtcbiAgICAgICAgdGhpcy5icmlja3NbaV0gPSB0ZW1wO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcblxuZnVuY3Rpb24gTmV3Q2hhdCh0aGVEaXYpe1xuXG4gICAgdGhpcy51c2VybmFtZSA9IG51bGw7XG4gICAgdGhpcy5hRGl2ID0gdGhlRGl2O1xuXG59XG5cbmZ1bmN0aW9uIHNldHVwKGFTZXR1cCl7XG4gICAgdmFyIHVzZXJuYW1lID0gbnVsbDtcbiAgICBpZihzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIikgIT09IG51bGwpIHtcbiAgICAgICAgdXNlcm5hbWUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidXNlcm5hbWVcIik7XG4gICAgICAgIGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgYVNldHVwLmFDaGF0ID0gbmV3IENoYXQoYVNldHVwLmFEaXYsIHVzZXJuYW1lKTtcbiAgICAgICAgYVNldHVwLmFDaGF0LmNvbm5lY3QoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciB0aGVVc2VybmFtZUJ1dHRvbiA9IGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzFdO1xuICAgICAgICB0aGVVc2VybmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXNlcm5hbWUgPSBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXS52YWx1ZTtcbiAgICAgICAgICAgIGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hQ2hhdCA9IG5ldyBDaGF0KGFTZXR1cC5hRGl2LCB1c2VybmFtZSk7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xuICAgICAgICAgICAgYVNldHVwLmFDaGF0LmNvbm5lY3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5OZXdDaGF0LnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3Q2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTWVtb3J5ID0gcmVxdWlyZShcIi4vTWVtb3J5LmpzXCIpO1xuZnVuY3Rpb24gTmV3TWVtb3J5KGFXaW5kb3cpe1xuXG4gICAgdGhpcy50aGVSYWRpb0J1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5zZXR1cERpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy50aGVTdWJtaXRCdXR0b24gPSB0aGlzLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVs2XTtcbiAgICB0aGlzLmFNZW1vcnkgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuXG4gICAgYVNldHVwLnRoZVN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcInJlZFwiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJ5ZWxsb3dcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzJdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwib3JhbmdlXCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVszXTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeSA9IG5ldyBNZW1vcnkoNCwgNCwgYVNldHVwLnNldHVwRGl2Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYuY2xhc3NMaXN0LmFkZChcIm5vbmVEaXZcIik7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRNZW1vcnlBcnJheSgpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuc2h1ZmZlbEJyaWNrcygpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0QnJpY2tzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzRdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCAyLCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwibm9uZURpdlwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwibm9uZURpdlwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAuc2V0dXBEaXYuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9KTtcbn1cblxuTmV3TWVtb3J5LnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld01lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHdpdGNoID0gcmVxdWlyZShcIi4vVHdpdGNoLmpzXCIpO1xuXG5mdW5jdGlvbiBOZXdUd2l0Y2godGhlRGl2KXtcblxuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuXG4gICAgICAgIGFTZXR1cC5hVHdpdGNoID0gbmV3IFR3aXRjaChhU2V0dXAuYURpdik7XG4gICAgICAgIGFTZXR1cC5hVHdpdGNoLmNvbm5lY3QoKTtcbn1cblxuTmV3VHdpdGNoLnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3VHdpdGNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIFR3aXRjaChhV2luZG93KXtcblxuICAgIHRoaXMuYURpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy5pbnB1dEZpZWxkID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICB0aGlzLnNlYXJjaEJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgdGhpcy5yZW1vdmVCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzJdO1xuICAgIHRoaXMuYVJlcXVlc3QgPSBudWxsO1xuICAgIHRoaXMuYVNlYXJjaCA9IG51bGw7XG5cbn1cblxuVHdpdGNoLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMuc2VhcmNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmFSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuYVNlYXJjaCA9IHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5hUmVxdWVzdC5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudHdpdGNoLnR2L2tyYWtlbi9zdHJlYW1zL1wiICsgdGhpcy5hU2VhcmNoICk7XG4gICAgICAgIHRoaXMuYVJlcXVlc3Quc2VuZCgpO1xuXG4gICAgICAgIHRoaXMuYVJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHRoaXMuYVJlcXVlc3Quc3RhdHVzIDwgNDAwICYmIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHZhciB0aGVGcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaHR0cDovL3R3aXRjaC50di9cIiArIHRoaXMuYVNlYXJjaCArIFwiL2VtYmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoZUZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93RnVsbFNjcmVlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKHRoZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2YXIgYW5PYmplY3QgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJVc2VyIG5vdCBmb3VuZFwiO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYW5PYmplY3QuaW5wdXRGaWVsZC5wbGFjZWhvbGRlciA9IFwiU2VhcmNoIFR3aXRjaCBjaGFubmVsXCI7XG4gICAgICAgICAgICAgICAgfSwxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5yZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoZURpdiA9ICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICB0aGVEaXYucmVtb3ZlQ2hpbGQodGhlRGl2Lmxhc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcbm1vZHVsZS5leHBvcnRzID0gVHdpdGNoO1xuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbnVCYXJCb3R0b20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvdHRvbU1lbnVCYXJcIik7XG5cbnZhciBUaGVDaGF0ID0gcmVxdWlyZShcIi4vTmV3Q2hhdC5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHdUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93VGVtcGxhdGVcIik7XG4gICAgdmFyIGFXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHdUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvY2hhdC5wbmdcIik7XG4gICAgdmFyIGNsb3NlU3ltYm9sID0gYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzFdO1xuICAgIHZhciBhQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgICBhQ29udGVudC5hcHBlbmRDaGlsZChhV2luZG93KTtcbiAgICBjbG9zZVN5bWJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgYUNvbnRlbnQucmVtb3ZlQ2hpbGQoYVdpbmRvdyk7XG4gICAgfSk7XG5cbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbigpe1xuXG4gICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LmFkZChcImlzQWN0aXZlXCIpO1xuICAgICAgICBpZihhV2luZG93Lm5leHRFbGVtZW50U2libGluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgYUNvbnRlbnQuYXBwZW5kQ2hpbGQoYVdpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiBtb3ZpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGFXaW5kb3cuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIChldmVudC5jbGllbnRYIC0gMTUwKSArIFwicHgsXCIgKyAoZXZlbnQuY2xpZW50WSAtIDE1KSArIFwicHgsIDApXCI7XG4gICAgICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYUNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3ZpbmcpO1xuICAgICAgICAgICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZShcImlzQWN0aXZlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIGFUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdFRlbXBsYXRlXCIpO1xuICAgIHZhciBjaGF0V2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShhVGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdmFyIHRoZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQoY2hhdFdpbmRvdyk7XG4gICAgdmFyIGNoYXREaXYgPSBjaGF0V2luZG93LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZztcbiAgICB2YXIgYUNoYXQgPSBuZXcgVGhlQ2hhdChjaGF0RGl2KTtcbiAgICBhQ2hhdC5yZWFkeVVwKCk7XG5cbn0pO1xuXG52YXIgTmV3TWVtb3J5ID0gcmVxdWlyZShcIi4vTmV3TWVtb3J5LmpzXCIpO1xuXG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUod1RlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9tZW1vcnkucG5nXCIpO1xuICAgIHZhciBjbG9zZVN5bWJvbCA9IGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVsxXTtcbiAgICB2YXIgYUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYUNvbnRlbnQuYXBwZW5kQ2hpbGQoYVdpbmRvdyk7XG4gICAgY2xvc2VTeW1ib2wuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGFDb250ZW50LnJlbW92ZUNoaWxkKGFXaW5kb3cpO1xuICAgIH0pO1xuXG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oKXtcblxuICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5hZGQoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgaWYoYVdpbmRvdy5uZXh0RWxlbWVudFNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgICAgICB9XG4gICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gbW92aW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBhV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyAoZXZlbnQuY2xpZW50WCAtIDE1MCkgKyBcInB4LFwiICsgKGV2ZW50LmNsaWVudFkgLSAxNSkgKyBcInB4LCAwKVwiO1xuICAgICAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92aW5nKTtcbiAgICAgICAgICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVRlbXBsYXRlXCIpO1xuICAgIHZhciBtZW1vcnlXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGFUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB2YXIgdGhlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChtZW1vcnlXaW5kb3cpO1xuICAgIHZhciB0aGVEaXYgPSBtZW1vcnlXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGFNZW1vcnkgPSBuZXcgTmV3TWVtb3J5KHRoZURpdik7XG4gICAgYU1lbW9yeS5yZWFkeVVwKCk7XG5cbn0pO1xuXG52YXIgTmV3VHdpdGNoID0gcmVxdWlyZShcIi4vTmV3VHdpdGNoLmpzXCIpO1xuXG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUod1RlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS90d2l0Y2gucG5nXCIpO1xuICAgIHZhciBjbG9zZVN5bWJvbCA9IGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVsxXTtcbiAgICB2YXIgYUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYUNvbnRlbnQuYXBwZW5kQ2hpbGQoYVdpbmRvdyk7XG4gICAgY2xvc2VTeW1ib2wuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGFDb250ZW50LnJlbW92ZUNoaWxkKGFXaW5kb3cpO1xuICAgIH0pO1xuXG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oKXtcblxuICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5hZGQoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgaWYoYVdpbmRvdy5uZXh0RWxlbWVudFNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgICAgICB9XG4gICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gbW92aW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBhV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyAoZXZlbnQuY2xpZW50WCAtIDE1MCkgKyBcInB4LFwiICsgKGV2ZW50LmNsaWVudFkgLSAxNSkgKyBcInB4LCAwKVwiO1xuICAgICAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92aW5nKTtcbiAgICAgICAgICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3R3aXRjaFRlbXBsYXRlXCIpO1xuICAgIHZhciB0d2l0Y2hXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGFUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICB2YXIgdGhlQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZCh0d2l0Y2hXaW5kb3cpO1xuICAgIHZhciB0d2l0Y2hEaXYgPSB0d2l0Y2hXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGFUd2l0Y2ggPSBuZXcgTmV3VHdpdGNoKHR3aXRjaERpdik7XG4gICAgYVR3aXRjaC5yZWFkeVVwKCk7XG5cbn0pO1xuXG5cbiJdfQ==
