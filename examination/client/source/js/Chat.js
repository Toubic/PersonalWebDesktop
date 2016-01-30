"use strict";

function Chat(aWindow){

    this.aDiv = aWindow;
    this.address = "ws://vhost3.lnu.se:20080/socket/";
    this.aKey = "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd";
    this.sendButton = aWindow.querySelectorAll("input")[0];
    this.wSocket = null;

}

Chat.prototype.connect = function(){

    this.wSocket = new WebSocket(this.address);

    this.sendButton.addEventListener("click", function(){
        var message = this.aDiv.querySelectorAll("textarea")[0].value;
        this.send(message);

    }.bind(this));

};

Chat.prototype.send = function(message){

    this.aDiv.querySelectorAll("textarea")[0].value = "";
    var theData = {
        type: "message",
        data: message,
        username: "Tobbe",
        channel: "",
        key: this.aKey
    };

    theData = JSON.stringify(theData);
    if(this.wSocket.readyState === 1) {
    this.wSocket.send(theData);
    }
};
Chat.prototype.receive = function(){

};

module.exports = Chat;
