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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld1R3aXRjaC5qcyIsImNsaWVudC9zb3VyY2UvanMvVHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIENoYXQoYVdpbmRvdywgYVVzZXJuYW1lKXtcblxuICAgIHRoaXMuYURpdiA9IGFXaW5kb3cubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgIHRoaXMuYWRkcmVzcyA9IFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIjtcbiAgICB0aGlzLmFLZXkgPSBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCI7XG4gICAgdGhpcy5zZW5kQnV0dG9uID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICB0aGlzLndTb2NrZXQgPSBudWxsO1xuICAgIHRoaXMuYVVzZXJuYW1lID0gYVVzZXJuYW1lO1xuXG59XG5cbkNoYXQucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXG4gICAgdGhpcy5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZChcInNjcm9sbFwiKTtcblxuICAgIHRoaXMud1NvY2tldCA9IG5ldyBXZWJTb2NrZXQodGhpcy5hZGRyZXNzKTtcblxuICAgIHRoaXMuc2VuZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpWzBdLnZhbHVlO1xuICAgICAgICB0aGlzLnNlbmQobWVzc2FnZSk7XG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy53U29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgdmFyIHRoZURhdGEgPSBldmVudC5kYXRhO1xuICAgICAgICB0aGVEYXRhID0gSlNPTi5wYXJzZSh0aGVEYXRhKTtcbiAgICAgICAgaWYodGhlRGF0YS50eXBlICE9PSBcImhlYXJ0YmVhdFwiKXtcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZSh0aGVEYXRhKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG5cbn07XG5cbkNoYXQucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlKXtcblxuICAgIHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWUgPSBcIlwiO1xuICAgIHZhciB0aGVEYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogbWVzc2FnZSxcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMuYVVzZXJuYW1lLFxuICAgICAgICBjaGFubmVsOiBcIlwiLFxuICAgICAgICBrZXk6IHRoaXMuYUtleVxuICAgIH07XG5cbiAgICB0aGVEYXRhID0gSlNPTi5zdHJpbmdpZnkodGhlRGF0YSk7XG4gICAgaWYodGhpcy53U29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgdGhpcy53U29ja2V0LnNlbmQodGhlRGF0YSk7XG4gICAgfVxufTtcbkNoYXQucHJvdG90eXBlLnJlY2VpdmUgPSBmdW5jdGlvbih0aGVEYXRhKXtcblxuICAgIHZhciBkRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLnVzZXJuYW1lICsgXCI6XCIpO1xuICAgIHZhciBwVXNlcm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwVXNlcm5hbWUuYXBwZW5kQ2hpbGQodGhlVGV4dCk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBVc2VybmFtZSk7XG4gICAgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoZURhdGEuZGF0YSk7XG4gICAgdmFyIHBNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcE1lc3NhZ2UuYXBwZW5kQ2hpbGQoKHRoZVRleHQpKTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocE1lc3NhZ2UpO1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgIHRpbWVzdGFtcCA9IHRpbWVzdGFtcC50b1RpbWVTdHJpbmcoKTtcbiAgICB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGltZXN0YW1wKTtcbiAgICB2YXIgcFRpbWVzdGFtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBUaW1lc3RhbXAuYXBwZW5kQ2hpbGQoKHRoZVRleHQpKTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocFRpbWVzdGFtcCk7XG4gICAgdGhpcy5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQoZEZyYWdtZW50KTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIE1lbW9yeShyb3dzLCBjb2xzLCBhV2luZG93KXtcblxuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuYURpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy5maXJzdEJyaWNrID0gbnVsbDtcbiAgICB0aGlzLnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICB0aGlzLnZpY3RvcnlDb25kaXRpb24gPSAocm93cypjb2xzKS8yO1xuICAgIHRoaXMucGFpcnMgPSAwO1xuICAgIHRoaXMudHJpZXMgPSAwO1xuXG5cbn1cblxuZnVuY3Rpb24gdHVybkFCcmljayh0aGVJbmRleCwgYnJpY2ssIG1lbW9yeSl7XG4gICAgaWYoIW1lbW9yeS5zZWNvbmRCcmljaykge1xuICAgICAgICB2YXIgYUltZyA9IG1lbW9yeS5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbdGhlSW5kZXhdO1xuICAgICAgICBhSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgYnJpY2sgKyBcIi5wbmdcIik7XG4gICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljayAhPT0gYUltZykge1xuICAgICAgICAgICAgaWYgKCFtZW1vcnkuZmlyc3RCcmljaykge1xuICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gYUltZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IGFJbWc7XG4gICAgICAgICAgICAgICAgbWVtb3J5LnRyaWVzKys7XG5cbiAgICAgICAgICAgICAgICBpZiAobWVtb3J5LmZpcnN0QnJpY2suc3JjID09PSBtZW1vcnkuc2Vjb25kQnJpY2suc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5wYWlycysrO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuc2Vjb25kQnJpY2sucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmKG1lbW9yeS5wYWlycyA9PT0gbWVtb3J5LnZpY3RvcnlDb25kaXRpb24pe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZU91dHB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoM1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJZb3UgaGF2ZSB3b24hIE51bWJlciBvZiB0cmllczogXCIgKyBtZW1vcnkudHJpZXMgKyBcIi5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVPdXRwdXQuYXBwZW5kQ2hpbGQodGhlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuYURpdi5hcHBlbmRDaGlsZCh0aGVPdXRwdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmZpcnN0QnJpY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjbGlja0V2ZW50KGksIGxpbmtUb0ltZywgbWVtb3J5KXtcbiAgICBsaW5rVG9JbWcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0dXJuQUJyaWNrKGksIG1lbW9yeS5icmlja3NbaV0sIG1lbW9yeSk7XG4gICAgfSk7XG59XG5cbk1lbW9yeS5wcm90b3R5cGUuZ2V0QnJpY2tzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGk7XG4gICAgdmFyIGFJbWc7XG4gICAgdmFyIGFMaW5rVG9JbWc7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgKHRoaXMucm93cyp0aGlzLmNvbHMpOyBpKyspe1xuXG4gICAgICAgIGFMaW5rVG9JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgYUxpbmtUb0ltZy5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICAgICAgYUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGFJbWcuY2xhc3NMaXN0LmFkZChcImltYWdlU2l6ZVwiKTtcbiAgICAgICAgYUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgYUxpbmtUb0ltZy5hcHBlbmRDaGlsZChhSW1nKTtcbiAgICAgICAgdGhpcy5hRGl2LmFwcGVuZENoaWxkKGFMaW5rVG9JbWcpO1xuICAgICAgICBjbGlja0V2ZW50KGksIGFMaW5rVG9JbWcsIHRoaXMpO1xuXG4gICAgICAgIGlmKCgoaSsxKSAlIHRoaXMuY29scykgPT09IDApe1xuICAgICAgICAgICAgdGhpcy5hRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuTWVtb3J5LnByb3RvdHlwZS5nZXRNZW1vcnlBcnJheSA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgaTtcblxuICAgIGZvciAoaSA9IDE7IGkgPD0gKHRoaXMucm93cyAqIHRoaXMuY29scykvMjsgaSsrKXtcbiAgICAgICAgdGhpcy5icmlja3MucHVzaChpKTtcbiAgICAgICAgdGhpcy5icmlja3MucHVzaChpKTtcbiAgICB9XG59O1xuXG5NZW1vcnkucHJvdG90eXBlLnNodWZmZWxCcmlja3MgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIHJOdW07XG4gICAgdmFyIHRlbXA7XG5cbiAgICBmb3IgKGkgPSAodGhpcy5yb3dzKnRoaXMuY29scy0xKTsgaSA+IDA7IGktLSl7XG4gICAgICAgICByTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG5cbiAgICAgICAgdGVtcCA9IHRoaXMuYnJpY2tzW3JOdW1dO1xuICAgICAgICB0aGlzLmJyaWNrc1tyTnVtXSA9IHRoaXMuYnJpY2tzW2ldO1xuICAgICAgICB0aGlzLmJyaWNrc1tpXSA9IHRlbXA7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xuXG5mdW5jdGlvbiBOZXdDaGF0KHRoZURpdil7XG5cbiAgICB0aGlzLnVzZXJuYW1lID0gbnVsbDtcbiAgICB0aGlzLmFEaXYgPSB0aGVEaXY7XG5cbn1cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcbiAgICB2YXIgdXNlcm5hbWUgPSBudWxsO1xuICAgIGlmKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICB1c2VybmFtZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICBhU2V0dXAuYUNoYXQgPSBuZXcgQ2hhdChhU2V0dXAuYURpdiwgdXNlcm5hbWUpO1xuICAgICAgICBhU2V0dXAuYUNoYXQuY29ubmVjdCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHRoZVVzZXJuYW1lQnV0dG9uID0gYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgICAgIHRoZVVzZXJuYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1c2VybmFtZSA9IGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdLnZhbHVlO1xuICAgICAgICAgICAgYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgYVNldHVwLmFDaGF0ID0gbmV3IENoYXQoYVNldHVwLmFEaXYsIHVzZXJuYW1lKTtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCB1c2VybmFtZSk7XG4gICAgICAgICAgICBhU2V0dXAuYUNoYXQuY29ubmVjdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbk5ld0NoYXQucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICAgIHNldHVwKHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBNZW1vcnkgPSByZXF1aXJlKFwiLi9NZW1vcnkuanNcIik7XG5mdW5jdGlvbiBOZXdNZW1vcnkoYVdpbmRvdyl7XG5cbiAgICB0aGlzLnRoZVJhZGlvQnV0dG9uID0gbnVsbDtcbiAgICB0aGlzLnNldHVwRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLnRoZVN1Ym1pdEJ1dHRvbiA9IHRoaXMuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzZdO1xuICAgIHRoaXMuYU1lbW9yeSA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIHNldHVwKGFTZXR1cCl7XG5cbiAgICBhU2V0dXAudGhlU3VibWl0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwicmVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsxXTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcInllbGxvd1wiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMl07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJvcmFuZ2VcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzNdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSg0LCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwibm9uZURpdlwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbNF07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkgPSBuZXcgTWVtb3J5KDIsIDIsIGFTZXR1cC5zZXR1cERpdi5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LmNsYXNzTGlzdC5hZGQoXCJub25lRGl2XCIpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0TWVtb3J5QXJyYXkoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LnNodWZmZWxCcmlja3MoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldEJyaWNrcygpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbNV07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkgPSBuZXcgTWVtb3J5KDIsIDQsIGFTZXR1cC5zZXR1cERpdi5uZXh0RWxlbWVudFNpYmxpbmcpO1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LmNsYXNzTGlzdC5hZGQoXCJub25lRGl2XCIpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0TWVtb3J5QXJyYXkoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LnNodWZmZWxCcmlja3MoKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldEJyaWNrcygpO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH0pO1xufVxuXG5OZXdNZW1vcnkucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3TWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUd2l0Y2ggPSByZXF1aXJlKFwiLi9Ud2l0Y2guanNcIik7XG5cbmZ1bmN0aW9uIE5ld1R3aXRjaCh0aGVEaXYpe1xuXG4gICAgdGhpcy5hRGl2ID0gdGhlRGl2O1xuXG59XG5cbmZ1bmN0aW9uIHNldHVwKGFTZXR1cCl7XG5cbiAgICAgICAgYVNldHVwLmFUd2l0Y2ggPSBuZXcgVHdpdGNoKGFTZXR1cC5hRGl2KTtcbiAgICAgICAgYVNldHVwLmFUd2l0Y2guY29ubmVjdCgpO1xufVxuXG5OZXdUd2l0Y2gucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICAgIHNldHVwKHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdUd2l0Y2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gVHdpdGNoKGFXaW5kb3cpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmlucHV0RmllbGQgPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgIHRoaXMuc2VhcmNoQnV0dG9uID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsxXTtcbiAgICB0aGlzLnJlbW92ZUJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMl07XG4gICAgdGhpcy5hUmVxdWVzdCA9IG51bGw7XG4gICAgdGhpcy5hU2VhcmNoID0gbnVsbDtcblxufVxuXG5Ud2l0Y2gucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXG4gICAgdGhpcy5zZWFyY2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuYVJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5hU2VhcmNoID0gdGhpcy5pbnB1dEZpZWxkLnZhbHVlO1xuICAgICAgICB0aGlzLmFSZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgXCJodHRwczovL2FwaS50d2l0Y2gudHYva3Jha2VuL3N0cmVhbXMvXCIgKyB0aGlzLmFTZWFyY2ggKTtcbiAgICAgICAgdGhpcy5hUmVxdWVzdC5zZW5kKCk7XG5cbiAgICAgICAgdGhpcy5hUmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodGhpcy5hUmVxdWVzdC5zdGF0dXMgPCA0MDAgJiYgdGhpcy5pbnB1dEZpZWxkLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoZUZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICAgICAgICAgICAgICB0aGVGcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJodHRwOi8vdHdpdGNoLnR2L1wiICsgdGhpcy5hU2VhcmNoICsgXCIvZW1iZWRcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwiYWxsb3dGdWxsU2NyZWVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYURpdi5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQodGhlRnJhbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZhciBhbk9iamVjdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQucGxhY2Vob2xkZXIgPSBcIlVzZXIgbm90IGZvdW5kXCI7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBhbk9iamVjdC5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJTZWFyY2ggVHdpdGNoIGNoYW5uZWxcIjtcbiAgICAgICAgICAgICAgICB9LDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhlRGl2ID0gIHRoaXMuYURpdi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIHRoZURpdi5yZW1vdmVDaGlsZCh0aGVEaXYubGFzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBUd2l0Y2g7XG4iLCJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVudUJhckJvdHRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm90dG9tTWVudUJhclwiKTtcblxudmFyIFRoZUNoYXQgPSByZXF1aXJlKFwiLi9OZXdDaGF0LmpzXCIpO1xuXG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUod1RlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9jaGF0LnBuZ1wiKTtcbiAgICB2YXIgY2xvc2VTeW1ib2wgPSBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV07XG4gICAgdmFyIGFDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgIGNsb3NlU3ltYm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhQ29udGVudC5yZW1vdmVDaGlsZChhV2luZG93KTtcbiAgICB9KTtcblxuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgYVdpbmRvdy5jbGFzc0xpc3QuYWRkKFwiaXNBY3RpdmVcIik7XG4gICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gbW92aW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBhV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyAoZXZlbnQuY2xpZW50WCAtIDE1MCkgKyBcInB4LFwiICsgKGV2ZW50LmNsaWVudFkgLSAxNSkgKyBcInB4LCAwKVwiO1xuICAgICAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92aW5nKTtcbiAgICAgICAgICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRUZW1wbGF0ZVwiKTtcbiAgICB2YXIgY2hhdFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB0aGVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKGNoYXRXaW5kb3cpO1xuICAgIHZhciBjaGF0RGl2ID0gY2hhdFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgdmFyIGFDaGF0ID0gbmV3IFRoZUNoYXQoY2hhdERpdik7XG4gICAgYUNoYXQucmVhZHlVcCgpO1xuXG59KTtcblxudmFyIE5ld01lbW9yeSA9IHJlcXVpcmUoXCIuL05ld01lbW9yeS5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHdUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93VGVtcGxhdGVcIik7XG4gICAgdmFyIGFXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHdUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvbWVtb3J5LnBuZ1wiKTtcbiAgICB2YXIgY2xvc2VTeW1ib2wgPSBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV07XG4gICAgdmFyIGFDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgIGNsb3NlU3ltYm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhQ29udGVudC5yZW1vdmVDaGlsZChhV2luZG93KTtcbiAgICB9KTtcblxuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKCl7XG4gICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LmFkZChcImlzQWN0aXZlXCIpO1xuICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIG1vdmluZyhldmVudCkge1xuICAgICAgICAgICAgYVdpbmRvdy5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgKGV2ZW50LmNsaWVudFggLSAxNTApICsgXCJweCxcIiArIChldmVudC5jbGllbnRZIC0gMTUpICsgXCJweCwgMClcIjtcbiAgICAgICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmluZyk7XG4gICAgICAgICAgICAgICAgYVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKFwiaXNBY3RpdmVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgYVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnlUZW1wbGF0ZVwiKTtcbiAgICB2YXIgbWVtb3J5V2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShhVGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdmFyIHRoZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQobWVtb3J5V2luZG93KTtcbiAgICB2YXIgdGhlRGl2ID0gbWVtb3J5V2luZG93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhTWVtb3J5ID0gbmV3IE5ld01lbW9yeSh0aGVEaXYpO1xuICAgIGFNZW1vcnkucmVhZHlVcCgpO1xuXG59KTtcblxudmFyIE5ld1R3aXRjaCA9IHJlcXVpcmUoXCIuL05ld1R3aXRjaC5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIHdUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93VGVtcGxhdGVcIik7XG4gICAgdmFyIGFXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKHdUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvdHdpdGNoLnBuZ1wiKTtcbiAgICB2YXIgY2xvc2VTeW1ib2wgPSBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV07XG4gICAgdmFyIGFDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgIGNsb3NlU3ltYm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhQ29udGVudC5yZW1vdmVDaGlsZChhV2luZG93KTtcbiAgICB9KTtcblxuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKCl7XG4gICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LmFkZChcImlzQWN0aXZlXCIpO1xuICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIG1vdmluZyhldmVudCkge1xuICAgICAgICAgICAgYVdpbmRvdy5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgKGV2ZW50LmNsaWVudFggLSAxNTApICsgXCJweCxcIiArIChldmVudC5jbGllbnRZIC0gMTUpICsgXCJweCwgMClcIjtcbiAgICAgICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmluZyk7XG4gICAgICAgICAgICAgICAgYVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKFwiaXNBY3RpdmVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgYVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0d2l0Y2hUZW1wbGF0ZVwiKTtcbiAgICB2YXIgdHdpdGNoV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShhVGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdmFyIHRoZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQodHdpdGNoV2luZG93KTtcbiAgICB2YXIgdHdpdGNoRGl2ID0gdHdpdGNoV2luZG93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhVHdpdGNoID0gbmV3IE5ld1R3aXRjaCh0d2l0Y2hEaXYpO1xuICAgIGFUd2l0Y2gucmVhZHlVcCgpO1xuXG59KTtcblxuXG4iXX0=
