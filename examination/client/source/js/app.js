
"use strict";

var TheChat = require("./NewChat.js");
var chatDiv = document.querySelector("#chatTop");
var aChat = new TheChat(chatDiv);
aChat.readyUp();


var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();

var NewTwitch = require("./NewTwitch.js");

var twitchDiv = document.querySelector("#twitchTop");
var aTwitch = new NewTwitch(twitchDiv);
aTwitch.readyUp();


