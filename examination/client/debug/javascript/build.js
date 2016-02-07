(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Chat(aWindow, aUsername)
 * Constructor for a chat instance.
 * @param aWindow - Reference div.
 * @param aUsername - Chosen username for the chat.
 */

function Chat(aWindow, aUsername){

    this.aDiv = aWindow.nextElementSibling;
    this.address = "ws://vhost3.lnu.se:20080/socket/";
    this.aKey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.wSocket = null;
    this.aUsername = aUsername;

}

/**
 * Chat.connect()
 * Connects the application to the chat server.
 */

Chat.prototype.connect = function(){

    //Add scroll ability to div that receives messages:
    this.aDiv.previousElementSibling.classList.add("scroll");

    this.wSocket = new WebSocket(this.address);

    //Adds ability to send messages with the enter key:
    this.aDiv.querySelectorAll("textarea")[0].addEventListener("keypress", function(event){
        if(event.keyCode === 13) {
            var message = this.aDiv.querySelectorAll("textarea")[0].value;
            this.send(message);
        }
    }.bind(this));

    this.wSocket.addEventListener("message", function(event){
        var theData = event.data;
        theData = JSON.parse(theData);
        //Ignores "heartbeat" messages from the server:
        if(theData.type !== "heartbeat"){
            this.receive(theData);
        }
    }.bind(this));

};

/**
 * Chat.send(message)
 * Prototype that sends the message from the user to the server.
 * @param message
 */

Chat.prototype.send = function(message){

    //Clears the textarea:
    this.aDiv.querySelectorAll("textarea")[0].value = "";
    //Adjusts the data so you can send it to the server:
    var theData = {
        type: "message",
        data: message,
        username: this.aUsername,
        channel: "",
        key: this.aKey
    };

    theData = JSON.stringify(theData);
    //If the websocket is ready send the data:
    if(this.wSocket.readyState === 1) {
        this.wSocket.send(theData);
    }
};

/**
 * Chat.receive(theData)
 * Prototype that receives messages from the server and presents it to the user.
 * @param theData
 */

Chat.prototype.receive = function(theData){

    var dFragment = document.createDocumentFragment();

    //Author:
    var theText = document.createTextNode(theData.username + ":");
    var pUsername = document.createElement("p");
    pUsername.appendChild(theText);
    dFragment.appendChild(pUsername);

    //The message:
    theText = document.createTextNode(theData.data);
    var pMessage = document.createElement("p");
    pMessage.appendChild((theText));
    dFragment.appendChild(pMessage);

    //Timestamp for the message:
    var timestamp = new Date();
    timestamp = timestamp.toTimeString();
    theText = document.createTextNode(timestamp);
    var pTimestamp = document.createElement("p");
    pTimestamp.appendChild((theText));
    dFragment.appendChild(pTimestamp);

    //Append to div for received messages:
    this.aDiv.previousElementSibling.appendChild(dFragment);

};

module.exports = Chat;

},{}],2:[function(require,module,exports){
"use strict";

/**
 * Memory(rows, cols, aWindow)
 * Constructor for a memory game.
 * @param rows
 * @param cols
 * @param aWindow
 */

function Memory(rows, cols, aWindow){

    this.rows = rows;
    this.cols = cols;
    this.bricks = [];
    this.aDiv = aWindow; //Reference div to set up a memory.
    this.firstBrick = null;
    this.secondBrick = null;
    this.victoryCondition = (rows*cols)/2; //Pairs required to win.
    this.pairs = 0; // Pairs achieved.
    this.tries = 0;


}

/**
 * turnABrick(theIndex, brick, memory)
 * Function to turn two memory bricks and check if it's a pair.
 * @param theIndex
 * @param brick
 * @param memory
 */

function turnABrick(theIndex, brick, memory){

    //If a second brick already hasn't been turned over:
    if(!memory.secondBrick) {
        var aImg = memory.aDiv.querySelectorAll("img")[theIndex];
        aImg.setAttribute("src", "image/" + brick + ".png");
        //Checks so you haven't clicked the same brick:
        if (memory.firstBrick !== aImg) {
            if (!memory.firstBrick) {
                memory.firstBrick = aImg;
            }
            else {
                memory.secondBrick = aImg;
                memory.tries++; //Number of tries.

                //Checks if it is a pair:
                if (memory.firstBrick.src === memory.secondBrick.src) {
                    memory.pairs++;
                    //Hide the paired bricks from the player:
                    setTimeout(function () {
                    memory.firstBrick.parentElement.classList.add("hidden");
                    memory.secondBrick.parentElement.classList.add("hidden");
                    memory.firstBrick = null;
                    memory.secondBrick = null;
                        //Check if player have won:
                    if(memory.pairs === memory.victoryCondition){
                        var theOutput = document.createElement("h3");
                        var theText = document.createTextNode("You have won! Number of tries: " + memory.tries + ".");
                        theOutput.appendChild(theText);
                        memory.aDiv.appendChild(theOutput);
                    }
                    }, 500);
                }
                else {
                    //Turn back bricks if it's not a pair:
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

/**
 * clickEvent(i, linkToImg, memory)
 * Trigger turn function when a brick is clicked.
 * @param i - index in the bricks array.
 * @param linkToImg - a-link connected to the image.
 * @param memory
 */

function clickEvent(i, linkToImg, memory){

    linkToImg.addEventListener("click", function(){
            turnABrick(i, memory.bricks[i], memory);
    });
}

/**
 * Memory.getBricks()
 * Initiates the memory board.
 */

Memory.prototype.getBricks = function() {
    var i;
    var aImg;
    var aLinkToImg;

    //Sets up the memory board and creates references to all bricks:
    for (i = 0; i < (this.rows*this.cols); i++){

        aLinkToImg = document.createElement("a");
        aLinkToImg.setAttribute("href", "#");
        aImg = document.createElement("img");
        aImg.classList.add("imageSize");
        aImg.setAttribute("src", "image/0.png");
        aLinkToImg.appendChild(aImg);
        this.aDiv.appendChild(aLinkToImg);
        clickEvent(i, aLinkToImg, this);

        //A new row of bricks:
        if(((i+1) % this.cols) === 0){
            this.aDiv.appendChild(document.createElement("br"));
        }
    }
};

/**
 * Memory.getMemoryArray()
 * Create an array of numbered pairs.
 */

Memory.prototype.getMemoryArray = function(){

    var i;

    for (i = 1; i <= (this.rows * this.cols)/2; i++){
        this.bricks.push(i);
        this.bricks.push(i);
    }
};

/**
 * Memory.shuffelBricks()
 * Shuffle array of numbered pairs using Fisher-Yates Shuffle algorithm.
 */

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

/**
 * NewChat(theDiv)
 * Constructor for the username from the user and passes it on to the chat constructor.
 * @param theDiv
 */

function NewChat(theDiv){

    this.username = null;
    this.aDiv = theDiv; //Reference div.

}

/**
 * setup(aSetup)
 * Gets the username from the user or sessionStorage.
 * @param aSetup
 */

function setup(aSetup){

    var username = null;
    //Checks if there is already a username stored in sessionStorage.
    if(sessionStorage.getItem("username") !== null) {
        username = sessionStorage.getItem("username");
        //Hides the setup area and initiates calls the Chat constructor:
        aSetup.aDiv.previousElementSibling.classList.add("hidden");
        aSetup.aChat = new Chat(aSetup.aDiv, username);
        aSetup.aChat.connect();
    }
    else {
        //Grabs username from the user input:
        var theUsernameButton = aSetup.aDiv.previousElementSibling.querySelectorAll("input")[1];
        theUsernameButton.addEventListener("click", function () {
            username = aSetup.aDiv.previousElementSibling.querySelectorAll("input")[0].value;
            //Hides the setup area and initiates calls the Chat constructor:
            aSetup.aDiv.previousElementSibling.classList.add("hidden");
            aSetup.aChat = new Chat(aSetup.aDiv, username);
            sessionStorage.setItem("username", username);
            aSetup.aChat.connect();
        });
    }
}

/**
 * NewChat.readyUp()
 * Connection to app.js.
 */

NewChat.prototype.readyUp = function(){
    setup(this);
};

module.exports = NewChat;

},{"./Chat.js":1}],4:[function(require,module,exports){
"use strict";

var Memory = require("./Memory.js");

/**
 * NewMemory(aWindow)
 * Constructor that initiates the settings before memory game.
 * @param aWindow
 */

function NewMemory(aWindow){

    this.theRadioButton = null;
    this.setupDiv = aWindow; //Reference div for the settings.
    this.theSubmitButton = this.setupDiv.querySelectorAll("input")[6];
    this.aMemory = null;
}

function setup(aSetup){

    aSetup.theSubmitButton.addEventListener("click", function(){

        //Choosing a background color:
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

        //Choosing memory size:
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
        //Hide the setup div:
        aSetup.setupDiv.classList.add("hidden");
    });
}

/**
 * NewMemory.readyUp()
 * Connection to app.js
 */

NewMemory.prototype.readyUp = function(){
  setup(this);
};

module.exports = NewMemory;

},{"./Memory.js":2}],5:[function(require,module,exports){
"use strict";

var Twitch = require("./Twitch.js");

/**
 *
 * NewTwitch(theDiv)
 * Constructor for the middle layer.
 */

function NewTwitch(theDiv){

    this.aDiv = theDiv;

}

/**
 * setup(aSetup)
 * Calls the Twitch application constructor and sets it up.
 * @param aSetup
 */

function setup(aSetup){

        aSetup.aTwitch = new Twitch(aSetup.aDiv);
        aSetup.aTwitch.connect();
}

/**
 * aTwitch.readyUp()
 * Connection to app.js.
 */

NewTwitch.prototype.readyUp = function(){
    setup(this);
};

module.exports = NewTwitch;

},{"./Twitch.js":6}],6:[function(require,module,exports){
"use strict";

/**
 *
 * Twitch(aWindow)
 * Constructor for the Twitch-search application.
 * @param aWindow
 */

function Twitch(aWindow){

    this.aDiv = aWindow; //Reference div for the application.
    this.inputField = this.aDiv.querySelectorAll("input")[0]; // Searchfield.
    this.searchButton = this.aDiv.querySelectorAll("input")[1];
    this.removeButton = this.aDiv.querySelectorAll("input")[2]; // Removes the last added.
    this.aRequest = null; // Ajax.
    this.aSearch = null; // For the value from the search field.

}

/**
 * Twitch.connect()
 * Sets up the application.
 */

Twitch.prototype.connect = function(){

    //When user presses the search button.
    this.searchButton.addEventListener("click", function(){
        this.aRequest = new XMLHttpRequest();
        this.aSearch = this.inputField.value;

        //Open requested Twitch stream.
        this.aRequest.open("GET", "https://api.twitch.tv/kraken/streams/" + this.aSearch );
        this.aRequest.send();

        this.aRequest.addEventListener("load", function(){
            //If requested user exists you don't get a bad request:
            //Then add the stream to the div.
            if(this.aRequest.status < 400 && this.inputField.value !== "") {
                var theFrame = document.createElement("iframe");
                theFrame.setAttribute("src", "http://twitch.tv/" + this.aSearch + "/embed");
                theFrame.setAttribute("allowFullScreen", "");
                this.aDiv.nextElementSibling.appendChild(theFrame);
                this.inputField.value = "";
            }
            //Else output user don't exist:
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

    //If user clicks remove button remove last added stream.
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

//Represents the Chat application:
menuBarBottom.querySelectorAll("img")[1].addEventListener("click", function(){

    //Grabs window template and creates a window:
    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/chat.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    //Add listener to window close symbol:
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    //Window in focus:
    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        //Checks if a window already on the top:
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        //Ability to move a window:
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    //Grabs chat template and creates a new chat:
    var aTemplate = document.querySelector("#chatTemplate");
    var chatWindow = document.importNode(aTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.nextElementSibling.appendChild(chatWindow);
    var chatDiv = chatWindow.firstElementChild.nextElementSibling;
    var aChat = new TheChat(chatDiv);
    aChat.readyUp();

});

var NewMemory = require("./NewMemory.js");

//Represents the Memory application:
menuBarBottom.querySelectorAll("img")[2].addEventListener("click", function(){

    //Grabs window template and creates a window:
    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/memory.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    //Add listener to window close symbol:
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    //Window in focus:
    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        //Checks if a window already on the top:
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        //Ability to move a window:
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    //Grabs memory template and creates a new memory:
    var aTemplate = document.querySelector("#memoryTemplate");
    var memoryWindow = document.importNode(aTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.nextElementSibling.appendChild(memoryWindow);
    var theDiv = memoryWindow.firstElementChild;
    var aMemory = new NewMemory(theDiv);
    aMemory.readyUp();

});

var NewTwitch = require("./NewTwitch.js");

//Represents the Twitch application:
menuBarBottom.querySelectorAll("img")[0].addEventListener("click", function(){

    //Grabs window template and creates a window:
    var wTemplate = document.querySelector("#windowTemplate");
    var aWindow = document.importNode(wTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.querySelectorAll("img")[0].setAttribute("src", "image/twitch.png");
    var closeSymbol = aWindow.firstElementChild.querySelectorAll("img")[1];
    var aContent = document.querySelector("#content");
    aContent.appendChild(aWindow);
    //Add listener to window close symbol:
    closeSymbol.addEventListener("click", function(){
        aContent.removeChild(aWindow);
    });

    //Window in focus:
    aWindow.firstElementChild.addEventListener("mousedown",function(){

        aWindow.classList.add("isActive");
        //Checks if a window already on the top:
        if(aWindow.nextElementSibling !== null) {
            aContent.appendChild(aWindow);
        }
        //Ability to move a window:
        aContent.addEventListener("mousemove", function moving(event) {
            aWindow.style.transform = "translate3d(" + (event.clientX - 150) + "px," + (event.clientY - 15) + "px, 0)";
            aContent.addEventListener("mouseup",function(){
                aContent.removeEventListener("mousemove", moving);
                aWindow.classList.remove("isActive");
            });
        });
    });

    //Grabs twitch template and creates a new twitch application:
    var aTemplate = document.querySelector("#twitchTemplate");
    var twitchWindow = document.importNode(aTemplate.content.firstElementChild, true);
    aWindow.firstElementChild.nextElementSibling.appendChild(twitchWindow);
    var twitchDiv = twitchWindow.firstElementChild;
    var aTwitch = new NewTwitch(twitchDiv);
    aTwitch.readyUp();

});



},{"./NewChat.js":3,"./NewMemory.js":4,"./NewTwitch.js":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuNS4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9OZXdNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL05ld1R3aXRjaC5qcyIsImNsaWVudC9zb3VyY2UvanMvVHdpdGNoLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9hcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDaGF0KGFXaW5kb3csIGFVc2VybmFtZSlcbiAqIENvbnN0cnVjdG9yIGZvciBhIGNoYXQgaW5zdGFuY2UuXG4gKiBAcGFyYW0gYVdpbmRvdyAtIFJlZmVyZW5jZSBkaXYuXG4gKiBAcGFyYW0gYVVzZXJuYW1lIC0gQ2hvc2VuIHVzZXJuYW1lIGZvciB0aGUgY2hhdC5cbiAqL1xuXG5mdW5jdGlvbiBDaGF0KGFXaW5kb3csIGFVc2VybmFtZSl7XG5cbiAgICB0aGlzLmFEaXYgPSBhV2luZG93Lm5leHRFbGVtZW50U2libGluZztcbiAgICB0aGlzLmFkZHJlc3MgPSBcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCI7XG4gICAgdGhpcy5hS2V5ID0gXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiO1xuICAgIHRoaXMud1NvY2tldCA9IG51bGw7XG4gICAgdGhpcy5hVXNlcm5hbWUgPSBhVXNlcm5hbWU7XG5cbn1cblxuLyoqXG4gKiBDaGF0LmNvbm5lY3QoKVxuICogQ29ubmVjdHMgdGhlIGFwcGxpY2F0aW9uIHRvIHRoZSBjaGF0IHNlcnZlci5cbiAqL1xuXG5DaGF0LnByb3RvdHlwZS5jb25uZWN0ID0gZnVuY3Rpb24oKXtcblxuICAgIC8vQWRkIHNjcm9sbCBhYmlsaXR5IHRvIGRpdiB0aGF0IHJlY2VpdmVzIG1lc3NhZ2VzOlxuICAgIHRoaXMuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJzY3JvbGxcIik7XG5cbiAgICB0aGlzLndTb2NrZXQgPSBuZXcgV2ViU29ja2V0KHRoaXMuYWRkcmVzcyk7XG5cbiAgICAvL0FkZHMgYWJpbGl0eSB0byBzZW5kIG1lc3NhZ2VzIHdpdGggdGhlIGVudGVyIGtleTpcbiAgICB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcInRleHRhcmVhXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgIGlmKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWU7XG4gICAgICAgICAgICB0aGlzLnNlbmQobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy53U29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgdmFyIHRoZURhdGEgPSBldmVudC5kYXRhO1xuICAgICAgICB0aGVEYXRhID0gSlNPTi5wYXJzZSh0aGVEYXRhKTtcbiAgICAgICAgLy9JZ25vcmVzIFwiaGVhcnRiZWF0XCIgbWVzc2FnZXMgZnJvbSB0aGUgc2VydmVyOlxuICAgICAgICBpZih0aGVEYXRhLnR5cGUgIT09IFwiaGVhcnRiZWF0XCIpe1xuICAgICAgICAgICAgdGhpcy5yZWNlaXZlKHRoZURhdGEpO1xuICAgICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcblxufTtcblxuLyoqXG4gKiBDaGF0LnNlbmQobWVzc2FnZSlcbiAqIFByb3RvdHlwZSB0aGF0IHNlbmRzIHRoZSBtZXNzYWdlIGZyb20gdGhlIHVzZXIgdG8gdGhlIHNlcnZlci5cbiAqIEBwYXJhbSBtZXNzYWdlXG4gKi9cblxuQ2hhdC5wcm90b3R5cGUuc2VuZCA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuXG4gICAgLy9DbGVhcnMgdGhlIHRleHRhcmVhOlxuICAgIHRoaXMuYURpdi5xdWVyeVNlbGVjdG9yQWxsKFwidGV4dGFyZWFcIilbMF0udmFsdWUgPSBcIlwiO1xuICAgIC8vQWRqdXN0cyB0aGUgZGF0YSBzbyB5b3UgY2FuIHNlbmQgaXQgdG8gdGhlIHNlcnZlcjpcbiAgICB2YXIgdGhlRGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgICAgIHVzZXJuYW1lOiB0aGlzLmFVc2VybmFtZSxcbiAgICAgICAgY2hhbm5lbDogXCJcIixcbiAgICAgICAga2V5OiB0aGlzLmFLZXlcbiAgICB9O1xuXG4gICAgdGhlRGF0YSA9IEpTT04uc3RyaW5naWZ5KHRoZURhdGEpO1xuICAgIC8vSWYgdGhlIHdlYnNvY2tldCBpcyByZWFkeSBzZW5kIHRoZSBkYXRhOlxuICAgIGlmKHRoaXMud1NvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICAgIHRoaXMud1NvY2tldC5zZW5kKHRoZURhdGEpO1xuICAgIH1cbn07XG5cbi8qKlxuICogQ2hhdC5yZWNlaXZlKHRoZURhdGEpXG4gKiBQcm90b3R5cGUgdGhhdCByZWNlaXZlcyBtZXNzYWdlcyBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHByZXNlbnRzIGl0IHRvIHRoZSB1c2VyLlxuICogQHBhcmFtIHRoZURhdGFcbiAqL1xuXG5DaGF0LnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24odGhlRGF0YSl7XG5cbiAgICB2YXIgZEZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgLy9BdXRob3I6XG4gICAgdmFyIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLnVzZXJuYW1lICsgXCI6XCIpO1xuICAgIHZhciBwVXNlcm5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwVXNlcm5hbWUuYXBwZW5kQ2hpbGQodGhlVGV4dCk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBVc2VybmFtZSk7XG5cbiAgICAvL1RoZSBtZXNzYWdlOlxuICAgIHRoZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGVEYXRhLmRhdGEpO1xuICAgIHZhciBwTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHBNZXNzYWdlLmFwcGVuZENoaWxkKCh0aGVUZXh0KSk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBNZXNzYWdlKTtcblxuICAgIC8vVGltZXN0YW1wIGZvciB0aGUgbWVzc2FnZTpcbiAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKTtcbiAgICB0aW1lc3RhbXAgPSB0aW1lc3RhbXAudG9UaW1lU3RyaW5nKCk7XG4gICAgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpbWVzdGFtcCk7XG4gICAgdmFyIHBUaW1lc3RhbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICBwVGltZXN0YW1wLmFwcGVuZENoaWxkKCh0aGVUZXh0KSk7XG4gICAgZEZyYWdtZW50LmFwcGVuZENoaWxkKHBUaW1lc3RhbXApO1xuXG4gICAgLy9BcHBlbmQgdG8gZGl2IGZvciByZWNlaXZlZCBtZXNzYWdlczpcbiAgICB0aGlzLmFEaXYucHJldmlvdXNFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChkRnJhZ21lbnQpO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNZW1vcnkocm93cywgY29scywgYVdpbmRvdylcbiAqIENvbnN0cnVjdG9yIGZvciBhIG1lbW9yeSBnYW1lLlxuICogQHBhcmFtIHJvd3NcbiAqIEBwYXJhbSBjb2xzXG4gKiBAcGFyYW0gYVdpbmRvd1xuICovXG5cbmZ1bmN0aW9uIE1lbW9yeShyb3dzLCBjb2xzLCBhV2luZG93KXtcblxuICAgIHRoaXMucm93cyA9IHJvd3M7XG4gICAgdGhpcy5jb2xzID0gY29scztcbiAgICB0aGlzLmJyaWNrcyA9IFtdO1xuICAgIHRoaXMuYURpdiA9IGFXaW5kb3c7IC8vUmVmZXJlbmNlIGRpdiB0byBzZXQgdXAgYSBtZW1vcnkuXG4gICAgdGhpcy5maXJzdEJyaWNrID0gbnVsbDtcbiAgICB0aGlzLnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICB0aGlzLnZpY3RvcnlDb25kaXRpb24gPSAocm93cypjb2xzKS8yOyAvL1BhaXJzIHJlcXVpcmVkIHRvIHdpbi5cbiAgICB0aGlzLnBhaXJzID0gMDsgLy8gUGFpcnMgYWNoaWV2ZWQuXG4gICAgdGhpcy50cmllcyA9IDA7XG5cblxufVxuXG4vKipcbiAqIHR1cm5BQnJpY2sodGhlSW5kZXgsIGJyaWNrLCBtZW1vcnkpXG4gKiBGdW5jdGlvbiB0byB0dXJuIHR3byBtZW1vcnkgYnJpY2tzIGFuZCBjaGVjayBpZiBpdCdzIGEgcGFpci5cbiAqIEBwYXJhbSB0aGVJbmRleFxuICogQHBhcmFtIGJyaWNrXG4gKiBAcGFyYW0gbWVtb3J5XG4gKi9cblxuZnVuY3Rpb24gdHVybkFCcmljayh0aGVJbmRleCwgYnJpY2ssIG1lbW9yeSl7XG5cbiAgICAvL0lmIGEgc2Vjb25kIGJyaWNrIGFscmVhZHkgaGFzbid0IGJlZW4gdHVybmVkIG92ZXI6XG4gICAgaWYoIW1lbW9yeS5zZWNvbmRCcmljaykge1xuICAgICAgICB2YXIgYUltZyA9IG1lbW9yeS5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbdGhlSW5kZXhdO1xuICAgICAgICBhSW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgYnJpY2sgKyBcIi5wbmdcIik7XG4gICAgICAgIC8vQ2hlY2tzIHNvIHlvdSBoYXZlbid0IGNsaWNrZWQgdGhlIHNhbWUgYnJpY2s6XG4gICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljayAhPT0gYUltZykge1xuICAgICAgICAgICAgaWYgKCFtZW1vcnkuZmlyc3RCcmljaykge1xuICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gYUltZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IGFJbWc7XG4gICAgICAgICAgICAgICAgbWVtb3J5LnRyaWVzKys7IC8vTnVtYmVyIG9mIHRyaWVzLlxuXG4gICAgICAgICAgICAgICAgLy9DaGVja3MgaWYgaXQgaXMgYSBwYWlyOlxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuZmlyc3RCcmljay5zcmMgPT09IG1lbW9yeS5zZWNvbmRCcmljay5zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnBhaXJzKys7XG4gICAgICAgICAgICAgICAgICAgIC8vSGlkZSB0aGUgcGFpcmVkIGJyaWNrcyBmcm9tIHRoZSBwbGF5ZXI6XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LnNlY29uZEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgcGxheWVyIGhhdmUgd29uOlxuICAgICAgICAgICAgICAgICAgICBpZihtZW1vcnkucGFpcnMgPT09IG1lbW9yeS52aWN0b3J5Q29uZGl0aW9uKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWW91IGhhdmUgd29uISBOdW1iZXIgb2YgdHJpZXM6IFwiICsgbWVtb3J5LnRyaWVzICsgXCIuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhlT3V0cHV0LmFwcGVuZENoaWxkKHRoZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmFEaXYuYXBwZW5kQ2hpbGQodGhlT3V0cHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9UdXJuIGJhY2sgYnJpY2tzIGlmIGl0J3Mgbm90IGEgcGFpcjpcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuZmlyc3RCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljay5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5maXJzdEJyaWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5zZWNvbmRCcmljayA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBjbGlja0V2ZW50KGksIGxpbmtUb0ltZywgbWVtb3J5KVxuICogVHJpZ2dlciB0dXJuIGZ1bmN0aW9uIHdoZW4gYSBicmljayBpcyBjbGlja2VkLlxuICogQHBhcmFtIGkgLSBpbmRleCBpbiB0aGUgYnJpY2tzIGFycmF5LlxuICogQHBhcmFtIGxpbmtUb0ltZyAtIGEtbGluayBjb25uZWN0ZWQgdG8gdGhlIGltYWdlLlxuICogQHBhcmFtIG1lbW9yeVxuICovXG5cbmZ1bmN0aW9uIGNsaWNrRXZlbnQoaSwgbGlua1RvSW1nLCBtZW1vcnkpe1xuXG4gICAgbGlua1RvSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdHVybkFCcmljayhpLCBtZW1vcnkuYnJpY2tzW2ldLCBtZW1vcnkpO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIE1lbW9yeS5nZXRCcmlja3MoKVxuICogSW5pdGlhdGVzIHRoZSBtZW1vcnkgYm9hcmQuXG4gKi9cblxuTWVtb3J5LnByb3RvdHlwZS5nZXRCcmlja3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaTtcbiAgICB2YXIgYUltZztcbiAgICB2YXIgYUxpbmtUb0ltZztcblxuICAgIC8vU2V0cyB1cCB0aGUgbWVtb3J5IGJvYXJkIGFuZCBjcmVhdGVzIHJlZmVyZW5jZXMgdG8gYWxsIGJyaWNrczpcbiAgICBmb3IgKGkgPSAwOyBpIDwgKHRoaXMucm93cyp0aGlzLmNvbHMpOyBpKyspe1xuXG4gICAgICAgIGFMaW5rVG9JbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgYUxpbmtUb0ltZy5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcbiAgICAgICAgYUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIGFJbWcuY2xhc3NMaXN0LmFkZChcImltYWdlU2l6ZVwiKTtcbiAgICAgICAgYUltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcbiAgICAgICAgYUxpbmtUb0ltZy5hcHBlbmRDaGlsZChhSW1nKTtcbiAgICAgICAgdGhpcy5hRGl2LmFwcGVuZENoaWxkKGFMaW5rVG9JbWcpO1xuICAgICAgICBjbGlja0V2ZW50KGksIGFMaW5rVG9JbWcsIHRoaXMpO1xuXG4gICAgICAgIC8vQSBuZXcgcm93IG9mIGJyaWNrczpcbiAgICAgICAgaWYoKChpKzEpICUgdGhpcy5jb2xzKSA9PT0gMCl7XG4gICAgICAgICAgICB0aGlzLmFEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogTWVtb3J5LmdldE1lbW9yeUFycmF5KClcbiAqIENyZWF0ZSBhbiBhcnJheSBvZiBudW1iZXJlZCBwYWlycy5cbiAqL1xuXG5NZW1vcnkucHJvdG90eXBlLmdldE1lbW9yeUFycmF5ID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuXG4gICAgZm9yIChpID0gMTsgaSA8PSAodGhpcy5yb3dzICogdGhpcy5jb2xzKS8yOyBpKyspe1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgICAgICB0aGlzLmJyaWNrcy5wdXNoKGkpO1xuICAgIH1cbn07XG5cbi8qKlxuICogTWVtb3J5LnNodWZmZWxCcmlja3MoKVxuICogU2h1ZmZsZSBhcnJheSBvZiBudW1iZXJlZCBwYWlycyB1c2luZyBGaXNoZXItWWF0ZXMgU2h1ZmZsZSBhbGdvcml0aG0uXG4gKi9cblxuTWVtb3J5LnByb3RvdHlwZS5zaHVmZmVsQnJpY2tzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBpO1xuICAgIHZhciByTnVtO1xuICAgIHZhciB0ZW1wO1xuXG4gICAgZm9yIChpID0gKHRoaXMucm93cyp0aGlzLmNvbHMtMSk7IGkgPiAwOyBpLS0pe1xuICAgICAgICAgck51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpO1xuXG4gICAgICAgIHRlbXAgPSB0aGlzLmJyaWNrc1tyTnVtXTtcbiAgICAgICAgdGhpcy5icmlja3Nbck51bV0gPSB0aGlzLmJyaWNrc1tpXTtcbiAgICAgICAgdGhpcy5icmlja3NbaV0gPSB0ZW1wO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDaGF0ID0gcmVxdWlyZShcIi4vQ2hhdC5qc1wiKTtcblxuLyoqXG4gKiBOZXdDaGF0KHRoZURpdilcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgdXNlcm5hbWUgZnJvbSB0aGUgdXNlciBhbmQgcGFzc2VzIGl0IG9uIHRvIHRoZSBjaGF0IGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHRoZURpdlxuICovXG5cbmZ1bmN0aW9uIE5ld0NoYXQodGhlRGl2KXtcblxuICAgIHRoaXMudXNlcm5hbWUgPSBudWxsO1xuICAgIHRoaXMuYURpdiA9IHRoZURpdjsgLy9SZWZlcmVuY2UgZGl2LlxuXG59XG5cbi8qKlxuICogc2V0dXAoYVNldHVwKVxuICogR2V0cyB0aGUgdXNlcm5hbWUgZnJvbSB0aGUgdXNlciBvciBzZXNzaW9uU3RvcmFnZS5cbiAqIEBwYXJhbSBhU2V0dXBcbiAqL1xuXG5mdW5jdGlvbiBzZXR1cChhU2V0dXApe1xuXG4gICAgdmFyIHVzZXJuYW1lID0gbnVsbDtcbiAgICAvL0NoZWNrcyBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgdXNlcm5hbWUgc3RvcmVkIGluIHNlc3Npb25TdG9yYWdlLlxuICAgIGlmKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICB1c2VybmFtZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VybmFtZVwiKTtcbiAgICAgICAgLy9IaWRlcyB0aGUgc2V0dXAgYXJlYSBhbmQgaW5pdGlhdGVzIGNhbGxzIHRoZSBDaGF0IGNvbnN0cnVjdG9yOlxuICAgICAgICBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIGFTZXR1cC5hQ2hhdCA9IG5ldyBDaGF0KGFTZXR1cC5hRGl2LCB1c2VybmFtZSk7XG4gICAgICAgIGFTZXR1cC5hQ2hhdC5jb25uZWN0KCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvL0dyYWJzIHVzZXJuYW1lIGZyb20gdGhlIHVzZXIgaW5wdXQ6XG4gICAgICAgIHZhciB0aGVVc2VybmFtZUJ1dHRvbiA9IGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzFdO1xuICAgICAgICB0aGVVc2VybmFtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdXNlcm5hbWUgPSBhU2V0dXAuYURpdi5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXS52YWx1ZTtcbiAgICAgICAgICAgIC8vSGlkZXMgdGhlIHNldHVwIGFyZWEgYW5kIGluaXRpYXRlcyBjYWxscyB0aGUgQ2hhdCBjb25zdHJ1Y3RvcjpcbiAgICAgICAgICAgIGFTZXR1cC5hRGl2LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hQ2hhdCA9IG5ldyBDaGF0KGFTZXR1cC5hRGl2LCB1c2VybmFtZSk7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwidXNlcm5hbWVcIiwgdXNlcm5hbWUpO1xuICAgICAgICAgICAgYVNldHVwLmFDaGF0LmNvbm5lY3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKipcbiAqIE5ld0NoYXQucmVhZHlVcCgpXG4gKiBDb25uZWN0aW9uIHRvIGFwcC5qcy5cbiAqL1xuXG5OZXdDaGF0LnByb3RvdHlwZS5yZWFkeVVwID0gZnVuY3Rpb24oKXtcbiAgICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3Q2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTWVtb3J5ID0gcmVxdWlyZShcIi4vTWVtb3J5LmpzXCIpO1xuXG4vKipcbiAqIE5ld01lbW9yeShhV2luZG93KVxuICogQ29uc3RydWN0b3IgdGhhdCBpbml0aWF0ZXMgdGhlIHNldHRpbmdzIGJlZm9yZSBtZW1vcnkgZ2FtZS5cbiAqIEBwYXJhbSBhV2luZG93XG4gKi9cblxuZnVuY3Rpb24gTmV3TWVtb3J5KGFXaW5kb3cpe1xuXG4gICAgdGhpcy50aGVSYWRpb0J1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5zZXR1cERpdiA9IGFXaW5kb3c7IC8vUmVmZXJlbmNlIGRpdiBmb3IgdGhlIHNldHRpbmdzLlxuICAgIHRoaXMudGhlU3VibWl0QnV0dG9uID0gdGhpcy5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbNl07XG4gICAgdGhpcy5hTWVtb3J5ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcblxuICAgIGFTZXR1cC50aGVTdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy9DaG9vc2luZyBhIGJhY2tncm91bmQgY29sb3I6XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbMF07XG4gICAgICAgIGlmIChhU2V0dXAudGhlUmFkaW9CdXR0b24uY2hlY2tlZCkge1xuICAgICAgICAgICAgYVNldHVwLnNldHVwRGl2LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzFdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IFwieWVsbG93XCI7XG4gICAgICAgIH1cbiAgICAgICAgYVNldHVwLnRoZVJhZGlvQnV0dG9uID0gYVNldHVwLnNldHVwRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsyXTtcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBcIm9yYW5nZVwiO1xuICAgICAgICB9XG4gICAgICAgIGFTZXR1cC50aGVSYWRpb0J1dHRvbiA9IGFTZXR1cC5zZXR1cERpdi5xdWVyeVNlbGVjdG9yQWxsKFwiaW5wdXRcIilbM107XG5cbiAgICAgICAgLy9DaG9vc2luZyBtZW1vcnkgc2l6ZTpcbiAgICAgICAgaWYgKGFTZXR1cC50aGVSYWRpb0J1dHRvbi5jaGVja2VkKSB7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeSA9IG5ldyBNZW1vcnkoNCwgNCwgYVNldHVwLnNldHVwRGl2Lm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICAgICAgICBhU2V0dXAuc2V0dXBEaXYuY2xhc3NMaXN0LmFkZChcIm5vbmVEaXZcIik7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRNZW1vcnlBcnJheSgpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuc2h1ZmZlbEJyaWNrcygpO1xuICAgICAgICAgICAgYVNldHVwLmFNZW1vcnkuZ2V0QnJpY2tzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzRdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCAyLCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwibm9uZURpdlwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBhU2V0dXAudGhlUmFkaW9CdXR0b24gPSBhU2V0dXAuc2V0dXBEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzVdO1xuICAgICAgICBpZiAoYVNldHVwLnRoZVJhZGlvQnV0dG9uLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5ID0gbmV3IE1lbW9yeSgyLCA0LCBhU2V0dXAuc2V0dXBEaXYubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICAgICAgICAgIGFTZXR1cC5zZXR1cERpdi5jbGFzc0xpc3QuYWRkKFwibm9uZURpdlwiKTtcbiAgICAgICAgICAgIGFTZXR1cC5hTWVtb3J5LmdldE1lbW9yeUFycmF5KCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5zaHVmZmVsQnJpY2tzKCk7XG4gICAgICAgICAgICBhU2V0dXAuYU1lbW9yeS5nZXRCcmlja3MoKTtcbiAgICAgICAgfVxuICAgICAgICAvL0hpZGUgdGhlIHNldHVwIGRpdjpcbiAgICAgICAgYVNldHVwLnNldHVwRGl2LmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfSk7XG59XG5cbi8qKlxuICogTmV3TWVtb3J5LnJlYWR5VXAoKVxuICogQ29ubmVjdGlvbiB0byBhcHAuanNcbiAqL1xuXG5OZXdNZW1vcnkucHJvdG90eXBlLnJlYWR5VXAgPSBmdW5jdGlvbigpe1xuICBzZXR1cCh0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV3TWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUd2l0Y2ggPSByZXF1aXJlKFwiLi9Ud2l0Y2guanNcIik7XG5cbi8qKlxuICpcbiAqIE5ld1R3aXRjaCh0aGVEaXYpXG4gKiBDb25zdHJ1Y3RvciBmb3IgdGhlIG1pZGRsZSBsYXllci5cbiAqL1xuXG5mdW5jdGlvbiBOZXdUd2l0Y2godGhlRGl2KXtcblxuICAgIHRoaXMuYURpdiA9IHRoZURpdjtcblxufVxuXG4vKipcbiAqIHNldHVwKGFTZXR1cClcbiAqIENhbGxzIHRoZSBUd2l0Y2ggYXBwbGljYXRpb24gY29uc3RydWN0b3IgYW5kIHNldHMgaXQgdXAuXG4gKiBAcGFyYW0gYVNldHVwXG4gKi9cblxuZnVuY3Rpb24gc2V0dXAoYVNldHVwKXtcblxuICAgICAgICBhU2V0dXAuYVR3aXRjaCA9IG5ldyBUd2l0Y2goYVNldHVwLmFEaXYpO1xuICAgICAgICBhU2V0dXAuYVR3aXRjaC5jb25uZWN0KCk7XG59XG5cbi8qKlxuICogYVR3aXRjaC5yZWFkeVVwKClcbiAqIENvbm5lY3Rpb24gdG8gYXBwLmpzLlxuICovXG5cbk5ld1R3aXRjaC5wcm90b3R5cGUucmVhZHlVcCA9IGZ1bmN0aW9uKCl7XG4gICAgc2V0dXAodGhpcyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ld1R3aXRjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqXG4gKiBUd2l0Y2goYVdpbmRvdylcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgVHdpdGNoLXNlYXJjaCBhcHBsaWNhdGlvbi5cbiAqIEBwYXJhbSBhV2luZG93XG4gKi9cblxuZnVuY3Rpb24gVHdpdGNoKGFXaW5kb3cpe1xuXG4gICAgdGhpcy5hRGl2ID0gYVdpbmRvdzsgLy9SZWZlcmVuY2UgZGl2IGZvciB0aGUgYXBwbGljYXRpb24uXG4gICAgdGhpcy5pbnB1dEZpZWxkID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVswXTsgLy8gU2VhcmNoZmllbGQuXG4gICAgdGhpcy5zZWFyY2hCdXR0b24gPSB0aGlzLmFEaXYucXVlcnlTZWxlY3RvckFsbChcImlucHV0XCIpWzFdO1xuICAgIHRoaXMucmVtb3ZlQnV0dG9uID0gdGhpcy5hRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbnB1dFwiKVsyXTsgLy8gUmVtb3ZlcyB0aGUgbGFzdCBhZGRlZC5cbiAgICB0aGlzLmFSZXF1ZXN0ID0gbnVsbDsgLy8gQWpheC5cbiAgICB0aGlzLmFTZWFyY2ggPSBudWxsOyAvLyBGb3IgdGhlIHZhbHVlIGZyb20gdGhlIHNlYXJjaCBmaWVsZC5cblxufVxuXG4vKipcbiAqIFR3aXRjaC5jb25uZWN0KClcbiAqIFNldHMgdXAgdGhlIGFwcGxpY2F0aW9uLlxuICovXG5cblR3aXRjaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAvL1doZW4gdXNlciBwcmVzc2VzIHRoZSBzZWFyY2ggYnV0dG9uLlxuICAgIHRoaXMuc2VhcmNoQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmFSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHRoaXMuYVNlYXJjaCA9IHRoaXMuaW5wdXRGaWVsZC52YWx1ZTtcblxuICAgICAgICAvL09wZW4gcmVxdWVzdGVkIFR3aXRjaCBzdHJlYW0uXG4gICAgICAgIHRoaXMuYVJlcXVlc3Qub3BlbihcIkdFVFwiLCBcImh0dHBzOi8vYXBpLnR3aXRjaC50di9rcmFrZW4vc3RyZWFtcy9cIiArIHRoaXMuYVNlYXJjaCApO1xuICAgICAgICB0aGlzLmFSZXF1ZXN0LnNlbmQoKTtcblxuICAgICAgICB0aGlzLmFSZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvL0lmIHJlcXVlc3RlZCB1c2VyIGV4aXN0cyB5b3UgZG9uJ3QgZ2V0IGEgYmFkIHJlcXVlc3Q6XG4gICAgICAgICAgICAvL1RoZW4gYWRkIHRoZSBzdHJlYW0gdG8gdGhlIGRpdi5cbiAgICAgICAgICAgIGlmKHRoaXMuYVJlcXVlc3Quc3RhdHVzIDwgNDAwICYmIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHZhciB0aGVGcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgdGhlRnJhbWUuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaHR0cDovL3R3aXRjaC50di9cIiArIHRoaXMuYVNlYXJjaCArIFwiL2VtYmVkXCIpO1xuICAgICAgICAgICAgICAgIHRoZUZyYW1lLnNldEF0dHJpYnV0ZShcImFsbG93RnVsbFNjcmVlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFEaXYubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKHRoZUZyYW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RmllbGQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9FbHNlIG91dHB1dCB1c2VyIGRvbid0IGV4aXN0OlxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2YXIgYW5PYmplY3QgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRGaWVsZC52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dEZpZWxkLnBsYWNlaG9sZGVyID0gXCJVc2VyIG5vdCBmb3VuZFwiO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYW5PYmplY3QuaW5wdXRGaWVsZC5wbGFjZWhvbGRlciA9IFwiU2VhcmNoIFR3aXRjaCBjaGFubmVsXCI7XG4gICAgICAgICAgICAgICAgfSwxMDAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy9JZiB1c2VyIGNsaWNrcyByZW1vdmUgYnV0dG9uIHJlbW92ZSBsYXN0IGFkZGVkIHN0cmVhbS5cbiAgICB0aGlzLnJlbW92ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhlRGl2ID0gIHRoaXMuYURpdi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgIHRoZURpdi5yZW1vdmVDaGlsZCh0aGVEaXYubGFzdEVsZW1lbnRDaGlsZCk7XG5cbiAgICB9LmJpbmQodGhpcykpO1xuXG59O1xubW9kdWxlLmV4cG9ydHMgPSBUd2l0Y2g7XG4iLCJcblwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVudUJhckJvdHRvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm90dG9tTWVudUJhclwiKTtcblxudmFyIFRoZUNoYXQgPSByZXF1aXJlKFwiLi9OZXdDaGF0LmpzXCIpO1xuXG4vL1JlcHJlc2VudHMgdGhlIENoYXQgYXBwbGljYXRpb246XG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAvL0dyYWJzIHdpbmRvdyB0ZW1wbGF0ZSBhbmQgY3JlYXRlcyBhIHdpbmRvdzpcbiAgICB2YXIgd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUod1RlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9jaGF0LnBuZ1wiKTtcbiAgICB2YXIgY2xvc2VTeW1ib2wgPSBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMV07XG4gICAgdmFyIGFDb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb250ZW50XCIpO1xuICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgIC8vQWRkIGxpc3RlbmVyIHRvIHdpbmRvdyBjbG9zZSBzeW1ib2w6XG4gICAgY2xvc2VTeW1ib2wuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGFDb250ZW50LnJlbW92ZUNoaWxkKGFXaW5kb3cpO1xuICAgIH0pO1xuXG4gICAgLy9XaW5kb3cgaW4gZm9jdXM6XG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oKXtcblxuICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5hZGQoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgLy9DaGVja3MgaWYgYSB3aW5kb3cgYWxyZWFkeSBvbiB0aGUgdG9wOlxuICAgICAgICBpZihhV2luZG93Lm5leHRFbGVtZW50U2libGluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgYUNvbnRlbnQuYXBwZW5kQ2hpbGQoYVdpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgLy9BYmlsaXR5IHRvIG1vdmUgYSB3aW5kb3c6XG4gICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24gbW92aW5nKGV2ZW50KSB7XG4gICAgICAgICAgICBhV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlM2QoXCIgKyAoZXZlbnQuY2xpZW50WCAtIDE1MCkgKyBcInB4LFwiICsgKGV2ZW50LmNsaWVudFkgLSAxNSkgKyBcInB4LCAwKVwiO1xuICAgICAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGFDb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92aW5nKTtcbiAgICAgICAgICAgICAgICBhV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0FjdGl2ZVwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vR3JhYnMgY2hhdCB0ZW1wbGF0ZSBhbmQgY3JlYXRlcyBhIG5ldyBjaGF0OlxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXRUZW1wbGF0ZVwiKTtcbiAgICB2YXIgY2hhdFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKGNoYXRXaW5kb3cpO1xuICAgIHZhciBjaGF0RGl2ID0gY2hhdFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgdmFyIGFDaGF0ID0gbmV3IFRoZUNoYXQoY2hhdERpdik7XG4gICAgYUNoYXQucmVhZHlVcCgpO1xuXG59KTtcblxudmFyIE5ld01lbW9yeSA9IHJlcXVpcmUoXCIuL05ld01lbW9yeS5qc1wiKTtcblxuLy9SZXByZXNlbnRzIHRoZSBNZW1vcnkgYXBwbGljYXRpb246XG5tZW51QmFyQm90dG9tLnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIilbMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cbiAgICAvL0dyYWJzIHdpbmRvdyB0ZW1wbGF0ZSBhbmQgY3JlYXRlcyBhIHdpbmRvdzpcbiAgICB2YXIgd1RlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3dUZW1wbGF0ZVwiKTtcbiAgICB2YXIgYVdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUod1RlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9tZW1vcnkucG5nXCIpO1xuICAgIHZhciBjbG9zZVN5bWJvbCA9IGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVsxXTtcbiAgICB2YXIgYUNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gICAgYUNvbnRlbnQuYXBwZW5kQ2hpbGQoYVdpbmRvdyk7XG4gICAgLy9BZGQgbGlzdGVuZXIgdG8gd2luZG93IGNsb3NlIHN5bWJvbDpcbiAgICBjbG9zZVN5bWJvbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgYUNvbnRlbnQucmVtb3ZlQ2hpbGQoYVdpbmRvdyk7XG4gICAgfSk7XG5cbiAgICAvL1dpbmRvdyBpbiBmb2N1czpcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixmdW5jdGlvbigpe1xuXG4gICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LmFkZChcImlzQWN0aXZlXCIpO1xuICAgICAgICAvL0NoZWNrcyBpZiBhIHdpbmRvdyBhbHJlYWR5IG9uIHRoZSB0b3A6XG4gICAgICAgIGlmKGFXaW5kb3cubmV4dEVsZW1lbnRTaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICBhQ29udGVudC5hcHBlbmRDaGlsZChhV2luZG93KTtcbiAgICAgICAgfVxuICAgICAgICAvL0FiaWxpdHkgdG8gbW92ZSBhIHdpbmRvdzpcbiAgICAgICAgYUNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBmdW5jdGlvbiBtb3ZpbmcoZXZlbnQpIHtcbiAgICAgICAgICAgIGFXaW5kb3cuc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIChldmVudC5jbGllbnRYIC0gMTUwKSArIFwicHgsXCIgKyAoZXZlbnQuY2xpZW50WSAtIDE1KSArIFwicHgsIDApXCI7XG4gICAgICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYUNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3ZpbmcpO1xuICAgICAgICAgICAgICAgIGFXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZShcImlzQWN0aXZlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy9HcmFicyBtZW1vcnkgdGVtcGxhdGUgYW5kIGNyZWF0ZXMgYSBuZXcgbWVtb3J5OlxuICAgIHZhciBhVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeVRlbXBsYXRlXCIpO1xuICAgIHZhciBtZW1vcnlXaW5kb3cgPSBkb2N1bWVudC5pbXBvcnROb2RlKGFUZW1wbGF0ZS5jb250ZW50LmZpcnN0RWxlbWVudENoaWxkLCB0cnVlKTtcbiAgICBhV2luZG93LmZpcnN0RWxlbWVudENoaWxkLm5leHRFbGVtZW50U2libGluZy5hcHBlbmRDaGlsZChtZW1vcnlXaW5kb3cpO1xuICAgIHZhciB0aGVEaXYgPSBtZW1vcnlXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmFyIGFNZW1vcnkgPSBuZXcgTmV3TWVtb3J5KHRoZURpdik7XG4gICAgYU1lbW9yeS5yZWFkeVVwKCk7XG5cbn0pO1xuXG52YXIgTmV3VHdpdGNoID0gcmVxdWlyZShcIi4vTmV3VHdpdGNoLmpzXCIpO1xuXG4vL1JlcHJlc2VudHMgdGhlIFR3aXRjaCBhcHBsaWNhdGlvbjpcbm1lbnVCYXJCb3R0b20ucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKVswXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblxuICAgIC8vR3JhYnMgd2luZG93IHRlbXBsYXRlIGFuZCBjcmVhdGVzIGEgd2luZG93OlxuICAgIHZhciB3VGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvd1RlbXBsYXRlXCIpO1xuICAgIHZhciBhV2luZG93ID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh3VGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZCwgdHJ1ZSk7XG4gICAgYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzBdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL3R3aXRjaC5wbmdcIik7XG4gICAgdmFyIGNsb3NlU3ltYm9sID0gYVdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpWzFdO1xuICAgIHZhciBhQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKTtcbiAgICBhQ29udGVudC5hcHBlbmRDaGlsZChhV2luZG93KTtcbiAgICAvL0FkZCBsaXN0ZW5lciB0byB3aW5kb3cgY2xvc2Ugc3ltYm9sOlxuICAgIGNsb3NlU3ltYm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICBhQ29udGVudC5yZW1vdmVDaGlsZChhV2luZG93KTtcbiAgICB9KTtcblxuICAgIC8vV2luZG93IGluIGZvY3VzOlxuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgYVdpbmRvdy5jbGFzc0xpc3QuYWRkKFwiaXNBY3RpdmVcIik7XG4gICAgICAgIC8vQ2hlY2tzIGlmIGEgd2luZG93IGFscmVhZHkgb24gdGhlIHRvcDpcbiAgICAgICAgaWYoYVdpbmRvdy5uZXh0RWxlbWVudFNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGFDb250ZW50LmFwcGVuZENoaWxkKGFXaW5kb3cpO1xuICAgICAgICB9XG4gICAgICAgIC8vQWJpbGl0eSB0byBtb3ZlIGEgd2luZG93OlxuICAgICAgICBhQ29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIG1vdmluZyhldmVudCkge1xuICAgICAgICAgICAgYVdpbmRvdy5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgKGV2ZW50LmNsaWVudFggLSAxNTApICsgXCJweCxcIiArIChldmVudC5jbGllbnRZIC0gMTUpICsgXCJweCwgMClcIjtcbiAgICAgICAgICAgIGFDb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhQ29udGVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmluZyk7XG4gICAgICAgICAgICAgICAgYVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKFwiaXNBY3RpdmVcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL0dyYWJzIHR3aXRjaCB0ZW1wbGF0ZSBhbmQgY3JlYXRlcyBhIG5ldyB0d2l0Y2ggYXBwbGljYXRpb246XG4gICAgdmFyIGFUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHdpdGNoVGVtcGxhdGVcIik7XG4gICAgdmFyIHR3aXRjaFdpbmRvdyA9IGRvY3VtZW50LmltcG9ydE5vZGUoYVRlbXBsYXRlLmNvbnRlbnQuZmlyc3RFbGVtZW50Q2hpbGQsIHRydWUpO1xuICAgIGFXaW5kb3cuZmlyc3RFbGVtZW50Q2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nLmFwcGVuZENoaWxkKHR3aXRjaFdpbmRvdyk7XG4gICAgdmFyIHR3aXRjaERpdiA9IHR3aXRjaFdpbmRvdy5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2YXIgYVR3aXRjaCA9IG5ldyBOZXdUd2l0Y2godHdpdGNoRGl2KTtcbiAgICBhVHdpdGNoLnJlYWR5VXAoKTtcblxufSk7XG5cblxuIl19
