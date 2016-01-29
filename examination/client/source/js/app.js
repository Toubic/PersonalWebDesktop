
"use strict";

var TheChat = require("./Chat.js");
var chatDiv = document.querySelector("#chatTop");
var aChat = new TheChat(chatDiv);
aChat.connect();


var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();


