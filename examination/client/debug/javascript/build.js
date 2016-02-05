(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Twitch.js":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

"use strict";

var menuBarBottom = document.querySelector("#bottomMenuBar");

/*
var TheChat = require("./NewChat.js");
var chatDiv = document.querySelector("#chatTop");
var aChat = new TheChat(chatDiv);
aChat.readyUp();


var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();
*/

var NewTwitch = require("./NewTwitch.js");

menuBarBottom.firstElementChild.addEventListener("click", function(){

    var aTemplate = document.querySelector("#twitchTemplate");
    var twitchWindow = document.importNode(aTemplate.content.firstElementChild, true);
    var theContent = document.querySelector("#content");
    theContent.appendChild(twitchWindow);
    var twitchDiv = twitchWindow.firstElementChild;
    var aTwitch = new NewTwitch(twitchDiv);
    aTwitch.readyUp();

});



},{"./NewTwitch.js":1}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvTmV3VHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9Ud2l0Y2guanMiLCJjbGllbnQvc291cmNlL2pzL2FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHdpdGNoID0gcmVxdWlyZShcIi4vVHdpdGNoLmpzXCIpO1xuXG5mdW5jdGlvbiBOZXdUd2l0Y2godGhlRGl2KXtcblxuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuXG4gICAgICAgIGFTZXR1cC5hVHdpdGNoID0gbmV3IFR3aXRjaChhU2V0dXAuYURpdik7XG4gICAgICAgIGFTZXR1cC5hVHdpdGNoLmNvbm5lY3QoKTtcbn1cblxuTmV3VHdpdGNoLnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3VHdpdGNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIFR3aXRjaChhV2luZG93KXtcblxuICAgIHRoaXMuYURpdiA9IGFXaW5kb3c7XG4gICAgdGhpcy5pbnB1dEZpZWxkID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTtcbiAgICB0aGlzLnNlYXJjaEJ1dHRvbiA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMV07XG4gICAgdGhpcy5yZW1vdmVCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzJdO1xuICAgIHRoaXMuYVJlcXVlc3QgPSBudWxsO1xuICAgIHRoaXMuYVNlYXJjaCA9IG51bGw7XG5cbn1cblxuVHdpdGNoLnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIHRoaXMuc2VhcmNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmFSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuYVNlYXJjaCA9IHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5hUmVxdWVzdC5vcGVuKFwiR0VUXCIsIFwiaHR0cHM6Ly9hcGkudHdpdGNoLnR2L2tyYWtlbi9zdHJlYW1zL1wiICsgdGhpcy5hU2VhcmNoICk7XG4gICAgICAgIHRoaXMuYVJlcXVlc3Quc2VuZCgpO1xuXG4gICAgICAgIHRoaXMuYVJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKHRoaXMuYVJlcXVlc3Quc3RhdHVzIDwgNDAwICYmIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHZhciB0aGVGcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaHR0cDovL3R3aXRjaC50di9cIiArIHRoaXMuYVNlYXJjaCArIFwiL2VtYmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoZUZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93RnVsbFNjcmVlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKHRoZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2YXIgYW5PYmplY3QgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJVc2VyIG5vdCBmb3VuZFwiO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYW5PYmplY3QuaW5wdXRGaWVsZC5wbGFjZWhvbGRlciA9IFwiU2VhcmNoIFR3aXRjaCBjaGFubmVsXCI7XG4gICAgICAgICAgICAgICAgfSwxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5yZW1vdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoZURpdiA9ICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICB0aGVEaXYucmVtb3ZlQ2hpbGQodGhlRGl2Lmxhc3RFbGVtZW50Q2hpbGQpO1xuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcbm1vZHVsZS5leHBvcnRzID0gVHdpdGNoO1xuIiwiXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbnVCYXJCb3R0b20gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2JvdHRvbU1lbnVCYXJcIik7XG5cbi8qXG52YXIgVGhlQ2hhdCA9IHJlcXVpcmUoXCIuL05ld0NoYXQuanNcIik7XG52YXIgY2hhdERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdFRvcFwiKTtcbnZhciBhQ2hhdCA9IG5ldyBUaGVDaGF0KGNoYXREaXYpO1xuYUNoYXQucmVhZHlVcCgpO1xuXG5cbnZhciBOZXdNZW1vcnkgPSByZXF1aXJlKFwiLi9OZXdNZW1vcnkuanNcIik7XG5cbnZhciB0aGVEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RoZVNldHVwXCIpO1xudmFyIGFNZW1vcnkgPSBuZXcgTmV3TWVtb3J5KHRoZURpdik7XG5hTWVtb3J5LnJlYWR5VXAoKTtcbiovXG5cbnZhciBOZXdUd2l0Y2ggPSByZXF1aXJlKFwiLi9OZXdUd2l0Y2guanNcIik7XG5cbm1lbnVCYXJCb3R0b20uZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgYVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0d2l0Y2hUZW1wbGF0ZVwiKTtcbiAgICB2YXIgdHdpdGNoV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZShhVGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgdmFyIHRoZUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgdGhlQ29udGVudC5hcHBlbmRDaGlsZCh0d2l0Y2hXaW5kb3cpO1xuICAgIHZhciB0d2l0Y2hEaXYgPSB0d2l0Y2hXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGFUd2l0Y2ggPSBuZXcgTmV3VHdpdGNoKHR3aXRjaERpdik7XG4gICAgYVR3aXRjaC5yZWFkeVVwKCk7XG5cbn0pO1xuXG5cbiJdfQ==
