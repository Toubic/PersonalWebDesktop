
"use strict";

var NewMemory = require("./NewMemory.js");

var theDiv = document.querySelector("#theSetup");
var aMemory = new NewMemory(theDiv);
aMemory.readyUp();

var theDiv2 = document.querySelector("#theSetup2");
var aMemory2 = new NewMemory(theDiv2);
aMemory2.readyUp();
