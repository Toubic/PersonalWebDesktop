
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


