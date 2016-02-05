
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


