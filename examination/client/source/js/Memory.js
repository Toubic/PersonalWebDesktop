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
