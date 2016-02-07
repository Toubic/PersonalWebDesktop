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
