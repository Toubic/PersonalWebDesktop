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
