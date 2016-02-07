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
