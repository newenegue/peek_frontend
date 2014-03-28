// ===========================================================
// Intro Animation
// ===========================================================

$(window).load(function(){ 


});

// ===========================================================
// Global Variables
// ===========================================================
var tl = new TimelineLite(),
  bothStaticRectangles = document.getElementsByClassName("staticRectangles"),
  staticArticle = document.getElementById("staticArticle"),
  staticArticle2 = document.getElementById("staticArticle2"),
  selectedRectang = document.getElementById("movingRect"),
  newspaper = document.getElementById("newspaper"),
  pointer = document.getElementById("pointer"),
  speechbubble = document.getElementById("speechbubble"),
  pointer2 = document.getElementById("pointer2"),
  introBucketStage = document.getElementById("introBucketStage"),
  regularIntroBucket = document.getElementById("regularIntroBucket"),
  openEyesIntro = document.getElementById("openEyesIntro"),
  introLeftEyeFull = document.getElementById("leftEyeFullIntro"),
  introRightEyeFull = document.getElementById("rightEyeFullIntro"),
  shot2 = document.getElementById("shot2"),
  welcomeText = document.getElementById("welcomeText"),
  openEyesWelcome = document.getElementById("openEyesWelcome"),
  welcomeIntroBucket = document.getElementById("welcomeIntroBucket"),
  enterButton = document.getElementsByClassName("closeIntroButton"),
  shot0 = document.getElementById("shot0"),
  shot1 = document.getElementById("shot1"); 

var introFront = document.getElementById("introFront");
var introCenter = document.getElementById("introCenter");
var introBack = document.getElementById("introBack");

// var screenVisibility = $("#shot1").css("visibility", "hidden");

function introTextContent1() {   
  introFront.innerHTML = "Wel";
  introCenter.innerHTML = "c";
  introBack.innerHTML = "ome";
};

function introTextContent2() {

  introFront.innerHTML = "";
  introCenter.innerHTML = "t";
  introBack.innerHTML = "o"; 
};

function introTextContent3() {

  introFront.innerHTML = "P";
  introCenter.innerHTML = "e";
  introBack.innerHTML = "ek."; 
};

function introTextContent4() {

  introFront.innerHTML = "Re";
  introCenter.innerHTML = "a";
  introBack.innerHTML = "dy"; 
};

function introTextContent5() {

  introFront.innerHTML = "S";
  introCenter.innerHTML = "e";
  introBack.innerHTML = "t"; 
};

function introTextContent6() {

  introFront.innerHTML = "G";
  introCenter.innerHTML = "o";
  introBack.innerHTML = "!"; 
};



function doAfterPageLoad() {
  $("#shot1").css("visibility", "visible");
  // tl.to(shot0, 0.1, {autoAlpha:0}, "+=.1");
  tl.set(shot1, {top:0}, "+=.1");
  tl.from(shot1, .5, {autoAlpha:0}, "+=.5");

  tl.from(newspaper, .5, {scale:0, autoAlpha:0}, "+=.1");

  // tl.from(selectedRectang, .5, {scale:0, autoAlpha:0}, "+=.1");
  // tl.from(staticArticle2, .5, {scale:0, autoAlpha:0}, "+=.1");



// ------------------------------------------
// Create Timeline for Animation to Run On
// ------------------------------------------
  
  //Create Timeline Instance

// ------------------------------------------
// Append action to Static Rectangles
// ------------------------------------------

  //Figure out how to fade in and move to the left to select article
  
  tl.from(pointer, .5, {right:-400, autoAlpha:0}, "+=.5");
  tl.from(newspaper_article, .5, {scale: 0, autoAlpha: 0}, "+=.5");

  tl.to(newspaper, .5, {right: "200px", top: "100px"}, "+=.1");
  tl.to(newspaper, 1, {right:"600px", ease:Circ.easeIn}, "+=.3");
  tl.to(newspaper, .5, {autoAlpha:0}, "-=.5" );

  tl.to(newspaper_article, 1, {scaleX: 0.6, scaleY: 0.6}, "-=.2");
  tl.to(newspaper_article, .5, {top:100, autoAlpha:0}, "+=.5"); 

  //Select Rectangle
  // tl.to(selectedRectang, .5, {backgroundColor:"red"}, "+=.2"); 

  //Shift Static Rects Diagonally (down/left)
  // tl.to(bothStaticRectangles, .5, {right: "100px", top: "50px"}, "+=.1");

  //Drift Static Rects to the Left
  // tl.to(bothStaticRectangles, 1, {right:"600px", ease:Circ.easeIn}, "+=.3");
  
  //Make Static Rects Fade Away
  // tl.to(bothStaticRectangles, .5, {autoAlpha:0}, "-=.5" );

  // tl.to(shot1, 1.0, {css:{backgroundPosition: "-100px 0px"}, ease:Quart.easeOut}, "+=0");

  //Shift Selected Rectangle Back
  // tl.to(selectedRectang, 1, {scaleX: 0.7, scaleY: 0.7}, "-=.2");

  //Drop Selected Rectangle
  // tl.to(selectedRectang, 1, {top:100, autoAlpha:0}, "+=1");

  // tl.set(shot1, {top:0, onComplete: pan}, "5.8");

  // tl.to(shot1, 2.0, {css:{backgroundPosition: "-300px -100px"}, ease:Quart.easeOut}, "-.5");
  // pan()
  //Bucket Appears
  tl.from(regularIntroBucket, .5, {bottom:-200, autoAlpha:0}, "-=1.5");
  tl.to(regularIntroBucket, .01, {css:{backgroundPosition: "-304px -6px"}, ease:Circ.easeIn}, "+=1");
  tl.to(regularIntroBucket, .5, {bottom:'100px', ease:Circ.easeIn}, "+=.5");

  //Bucket Eyes get Happy
  // tl.to(openEyesIntro, .1, {autoAlpha:0}, "+=.2");

  //Speech Bubble
  tl.from(speechbubble, 1, {bottom:-100, scaleY: 0, autoAlpha:0}, "+=1");
  tl.from(pointer2, 1, {left:-100, autoAlpha:0}, "+=.5");

  //Switch to Second Shot
  tl.from(shot2, .5, {autoAlpha:0}, "+=.5");
  
  tl.set(shot2, {top:0, onComplete: introTextContent1}, "-=.5");
  tl.set(shot2, {top:0, onComplete: introTextContent2}, "+=.2");
  tl.set(shot2, {top:0, onComplete: introTextContent3}, "+=.5");
  tl.set(shot2, {top:0, onComplete: introTextContent4}, "+=1");
  tl.set(shot2, {top:0, onComplete: introTextContent5}, "+=.5");
  tl.set(shot2, {top:0, onComplete: introTextContent6}, "+=.5");
  
  //Switch to Third Shot
  tl.set(shot3, {top:0}, "+=1");
  tl.from(shot3, .5, {bottom:-200, autoAlpha:0}, "+=.5");
  // tl.to(openEyesWelcome, .2, {autoAlpha:0, overwrite: 2}, "+=.5");
  tl.from(welcomeIntroBucket, .5, {top:-200, autoAlpha:0}, "-=1.5");
  tl.to(welcomeIntroBucket, .01, {css:{backgroundPosition: "-304px -6px"}, ease:Circ.easeIn}, "+=1");
  // tl.to(welcomeIntroBucket, .2, {autoAlpha:0, overwrite: 2}, "+=.5");
  tl.from(welcomeText, .5, {bottom:-100, scaleY: 0, autoAlpha: 0}, "+=.5");

  //Enter Button Appears
  tl.from(enterButton, .5, {autoAlpha: 0}, "+=1");
  // tl.restart();

};

function pan() {
  $("shot1").addClass("fadeInLeft");
}

var animation = function() {

  // $(window).load(function(){ 


  // });

};
