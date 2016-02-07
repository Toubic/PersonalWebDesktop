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
