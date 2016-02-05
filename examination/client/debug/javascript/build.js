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

},{"./Chat.js":1}],3:[function(require,module,exports){
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

},{"./Twitch.js":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){

"use strict";

var menuBarBottom = document.querySelector("#bottomMenuBar");
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

/*
var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();
*/

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



},{"./NewChat.js":2,"./NewTwitch.js":3}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTmV3Q2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTmV3VHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9Ud2l0Y2guanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gQ2hhdChhV2luZG93LCBhVXNlcm5hbWUpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdy5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgdGhpcy5hZGRyZXNzID0gXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiO1xuICAgIHRoaXMuYUtleSA9IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIjtcbiAgICB0aGlzLnNlbmRCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgIHRoaXMud1NvY2tldCA9IG51bGw7XG4gICAgdGhpcy5hVXNlcm5hbWUgPSBhVXNlcm5hbWU7XG5cbn1cblxuQ2hhdC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwic2Nyb2xsXCIpO1xuXG4gICAgdGhpcy53U29ja2V0ID0gbmV3IFdlYlNvY2tldCh0aGlzLmFkZHJlc3MpO1xuXG4gICAgdGhpcy5zZW5kQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWU7XG4gICAgICAgIHRoaXMuc2VuZChtZXNzYWdlKTtcblxuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLndTb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB2YXIgdGhlRGF0YSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIHRoZURhdGEgPSBKU09OLnBhcnNlKHRoZURhdGEpO1xuICAgICAgICBpZih0aGVEYXRhLnR5cGUgIT09IFwiaGVhcnRiZWF0XCIpe1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlKHRoZURhdGEpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXG4gICAgdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0YXJlYVwiKVswXS52YWx1ZSA9IFwiXCI7XG4gICAgdmFyIHRoZURhdGEgPSB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiBtZXNzYWdlLFxuICAgICAgICB1c2VybmFtZTogdGhpcy5hVXNlcm5hbWUsXG4gICAgICAgIGNoYW5uZWw6IFwiXCIsXG4gICAgICAgIGtleTogdGhpcy5hS2V5XG4gICAgfTtcblxuICAgIHRoZURhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGVEYXRhKTtcbiAgICBpZih0aGlzLndTb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICB0aGlzLndTb2NrZXQuc2VuZCh0aGVEYXRhKTtcbiAgICB9XG59O1xuQ2hhdC5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKHRoZURhdGEpe1xuXG4gICAgdmFyIGRGcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoZURhdGEudXNlcm5hbWUgKyBcIjpcIik7XG4gICAgdmFyIHBVc2VybmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBVc2VybmFtZS5hcHBlbmRDaGlsZCh0aGVUZXh0KTtcbiAgICBkRnJhZ21lbnQuYXBwZW5kQ2hpbGQocFVzZXJuYW1lKTtcbiAgICB0aGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhlRGF0YS5kYXRhKTtcbiAgICB2YXIgcE1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwTWVzc2FnZS5hcHBlbmRDaGlsZCgodGhlVGV4dCkpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwTWVzc2FnZSk7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgdGltZXN0YW1wID0gdGltZXN0YW1wLnRvVGltZVN0cmluZygpO1xuICAgIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aW1lc3RhbXApO1xuICAgIHZhciBwVGltZXN0YW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgcFRpbWVzdGFtcC5hcHBlbmRDaGlsZCgodGhlVGV4dCkpO1xuICAgIGRGcmFnbWVudC5hcHBlbmRDaGlsZChwVGltZXN0YW1wKTtcbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChkRnJhZ21lbnQpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENoYXQgPSByZXF1aXJlKFwiLi9DaGF0LmpzXCIpO1xuXG5mdW5jdGlvbiBOZXdDaGF0KHRoZURpdil7XG5cbiAgICB0aGlzLnVzZXJuYW1lID0gbnVsbDtcbiAgICB0aGlzLmFEaXYgPSB0aGVEaXY7XG5cbn1cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcbiAgICB2YXIgdXNlcm5hbWUgPSBudWxsO1xuICAgIGlmKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICB1c2VybmFtZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICBhU2V0dXAuYUNoYXQgPSBuZXcgQ2hhdChhU2V0dXAuYURpdiwgdXNlcm5hbWUpO1xuICAgICAgICBhU2V0dXAuYUNoYXQuY29ubmVjdCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHRoZVVzZXJuYW1lQnV0dG9uID0gYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgICAgIHRoZVVzZXJuYW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB1c2VybmFtZSA9IGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdLnZhbHVlO1xuICAgICAgICAgICAgYVNldHVwLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICAgICAgYVNldHVwLmFDaGF0ID0gbmV3IENoYXQoYVNldHVwLmFEaXYsIHVzZXJuYW1lKTtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJ1c2VybmFtZVwiLCB1c2VybmFtZSk7XG4gICAgICAgICAgICBhU2V0dXAuYUNoYXQuY29ubmVjdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbk5ld0NoYXQucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICAgIHNldHVwKHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUd2l0Y2ggPSByZXF1aXJlKFwiLi9Ud2l0Y2guanNcIik7XG5cbmZ1bmN0aW9uIE5ld1R3aXRjaCh0aGVEaXYpe1xuXG4gICAgdGhpcy5hRGl2ID0gdGhlRGl2O1xuXG59XG5cbmZ1bmN0aW9uIHNldHVwKGFTZXR1cCl7XG5cbiAgICAgICAgYVNldHVwLmFUd2l0Y2ggPSBuZXcgVHdpdGNoKGFTZXR1cC5hRGl2KTtcbiAgICAgICAgYVNldHVwLmFUd2l0Y2guY29ubmVjdCgpO1xufVxuXG5OZXdUd2l0Y2gucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICAgIHNldHVwKHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXdUd2l0Y2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gVHdpdGNoKGFXaW5kb3cpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdztcbiAgICB0aGlzLmlucHV0RmllbGQgPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzBdO1xuICAgIHRoaXMuc2VhcmNoQnV0dG9uID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsxXTtcbiAgICB0aGlzLnJlbW92ZUJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMl07XG4gICAgdGhpcy5hUmVxdWVzdCA9IG51bGw7XG4gICAgdGhpcy5hU2VhcmNoID0gbnVsbDtcblxufVxuXG5Ud2l0Y2gucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbigpe1xuXG4gICAgdGhpcy5zZWFyY2hCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuYVJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgdGhpcy5hU2VhcmNoID0gdGhpcy5pbnB1dEZpZWxkLnZhbHVlO1xuICAgICAgICB0aGlzLmFSZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgXCJodHRwczovL2FwaS50d2l0Y2gudHYva3Jha2VuL3N0cmVhbXMvXCIgKyB0aGlzLmFTZWFyY2ggKTtcbiAgICAgICAgdGhpcy5hUmVxdWVzdC5zZW5kKCk7XG5cbiAgICAgICAgdGhpcy5hUmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYodGhpcy5hUmVxdWVzdC5zdGF0dXMgPCA0MDAgJiYgdGhpcy5pbnB1dEZpZWxkLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoZUZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICAgICAgICAgICAgICB0aGVGcmFtZS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJodHRwOi8vdHdpdGNoLnR2L1wiICsgdGhpcy5hU2VhcmNoICsgXCIvZW1iZWRcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwiYWxsb3dGdWxsU2NyZWVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuYURpdi5uZXh0RWxlbWVudFNpYmxpbmcuYXBwZW5kQ2hpbGQodGhlRnJhbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZhciBhbk9iamVjdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQucGxhY2Vob2xkZXIgPSBcIlVzZXIgbm90IGZvdW5kXCI7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBhbk9iamVjdC5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJTZWFyY2ggVHdpdGNoIGNoYW5uZWxcIjtcbiAgICAgICAgICAgICAgICB9LDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLnJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhlRGl2ID0gIHRoaXMuYURpdi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIHRoZURpdi5yZW1vdmVDaGlsZCh0aGVEaXYubGFzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBUd2l0Y2g7XG4iLCJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVudUJhckJvdHRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm90dG9tTWVudUJhclwiKTtcbnZhciBUaGVDaGF0ID0gcmVxdWlyZShcIi4vTmV3Q2hhdC5qc1wiKTtcbm1lbnVCYXJCb3R0b20ucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVsxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRUZW1wbGF0ZVwiKTtcbiAgICB2YXIgY2hhdFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB0aGVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIHRoZUNvbnRlbnQuYXBwZW5kQ2hpbGQoY2hhdFdpbmRvdyk7XG4gICAgdmFyIGNoYXREaXYgPSBjaGF0V2luZG93LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZztcbiAgICB2YXIgYUNoYXQgPSBuZXcgVGhlQ2hhdChjaGF0RGl2KTtcbiAgICBhQ2hhdC5yZWFkeVVwKCk7XG5cbn0pO1xuXG4vKlxudmFyIE5ld01lbW9yeSA9IHJlcXVpcmUoXCIuL05ld01lbW9yeS5qc1wiKTtcblxudmFyIHRoZURpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdGhlU2V0dXBcIik7XG52YXIgYU1lbW9yeSA9IG5ldyBOZXdNZW1vcnkodGhlRGl2KTtcbmFNZW1vcnkucmVhZHlVcCgpO1xuKi9cblxudmFyIE5ld1R3aXRjaCA9IHJlcXVpcmUoXCIuL05ld1R3aXRjaC5qc1wiKTtcblxubWVudUJhckJvdHRvbS5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGFUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHdpdGNoVGVtcGxhdGVcIik7XG4gICAgdmFyIHR3aXRjaFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIHZhciB0aGVDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIHRoZUNvbnRlbnQuYXBwZW5kQ2hpbGQodHdpdGNoV2luZG93KTtcbiAgICB2YXIgdHdpdGNoRGl2ID0gdHdpdGNoV2luZG93LmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZhciBhVHdpdGNoID0gbmV3IE5ld1R3aXRjaCh0d2l0Y2hEaXYpO1xuICAgIGFUd2l0Y2gucmVhZHlVcCgpO1xuXG59KTtcblxuXG4iXX0=
