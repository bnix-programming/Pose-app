//***Function scripts

var oOut = document.getElementById('outputImage');
var oOverlay = document.getElementById('overlay-container');
let aImagesAux = [];
let aImages = [];
var oFiles;
var vCount  = 0;
var oSeries;
var vSeriesCount;
var oInterval;
var vItCount
var oNextImageContainer = document.getElementById('image-end');
var oImageEndBg = document.getElementById('image-end-bg');
var gvIterations;
var gvPeriod;

//Script that triggers the slideshow calls
function fTrigger(){

    //Cancels the previous run if such exists
    clearInterval(oInterval);

    oFiles  = document.getElementById('fileInput').files;

    if(oFiles.length!=0){
        //Sets the canvas overlay to opaque
        oOverlay.style.display = 'flex';
        fInitClock();

        //Makes sure the image filter worked in the input and puts the entries in an array
        for (i=0; i < oFiles.length; i++){
            if (oFiles[i].type.includes("image/")){aImages.push(i);};
        };

        //Gets series data
        oSeries = document.getElementsByClassName('series-container');
        vSeriesCount = oSeries.length;
        fCallSeries();
    }
    else{
        //Idk, say something on the screen about the user missing the files.
    };
};

//Function that displays a random image based on a image file object
function fDisplayRand(oImage){
    //FileReader object for loading the files as URL
    const oReader  = new FileReader();
    oReader.onload = function() {oOut.src = oReader.result;};
    oReader.readAsDataURL(oImage);
};

//Biased randomizer that doesn't repeat images twice.
function fBiasedRand(vRange){
    if (aImagesAux.length==0){aImagesAux = fShuffleArray(aImages).slice()};
    return aImagesAux.pop();
};

//Displays a given amount of pictures, each for a given amount of seconds
function fSeries(vIterations, vPeriod){
    gvIterations = vIterations;
    gvPeriod =  vPeriod;

    if (vItCount == vIterations){
        fCallSeries();
    }
    else {
        vItCount++;
        fDisplayRand(oFiles[aImages[fBiasedRand(aImages.length)]]);

        fStartClock(vPeriod);
    };
};

function fFadeWhite() {
    oNextImageContainer.style.display = 'flex';
    setTimeout(function(){oImageEndBg.style.opacity = '40%';oNextImageContainer.style.opacity = '100%'},1000);
};

function fNextImage(){
    fSeries(gvIterations,gvPeriod);
    oNextImageContainer.style.opacity = '0%';
    oImageEndBg.style.opacity = '0%';
    setTimeout(function(){oNextImageContainer.style.display = 'none';},1000);
};

//This is the main function of the program as it defines how the series are processed
function fCallSeries() {
    if (vSeriesCount != 0){
        var vIndex = oSeries.length - vSeriesCount;
        var oSeriesSliders = oSeries[vIndex].getElementsByClassName("series-slider");
        var vIte = oSeriesSliders[0].firstElementChild.value;
        var vSec = oSeriesSliders[1].firstElementChild.value;

        switch (vSec) {
            case '0':
                vSec = 30;break;
            case '1':
                vSec = 45;break;
            default:
                vSec = vSec*30;break;
        };

        vItCount = 0;
        fSeries(vIte,vSec);
        vSeriesCount--;
    }
    else {
        oOverlay.style.display = 'none';
        oOut.src = '';
    };
};

//For randomizing the array
function fShuffleArray(vArray) {
    let vCurId = vArray.length;
     while (0 !== vCurId) {
        let vRandId = Math.floor(Math.random() * vCurId);
        vCurId -= 1;
        let vTmp = vArray[vCurId];
        vArray[vCurId] = vArray[vRandId];
        vArray[vRandId] = vTmp;
    };
    return vArray;
};

//This is the exit function from the slide for the menu
function fStopSlide(){
    oNextImageContainer.style.display = 'none';
    oNextImageContainer.style.opacity = '0%';
    oImageEndBg.style.opacity = '0%';
    oOverlay.style.display = 'none';
    oOut.src = '';
    clearInterval(oInterval);
    document.getElementById('menu-open').checked = false;
    fStopClock();
}

//***Visual scripts

var vSide = "right";

//Function to display the time of each pose inside the container
function fTimeValue(oSlider){
  var vLabel = oSlider.nextElementSibling;
  var vValue = oSlider.value;
  var vMiddle = oSlider.max/2;
  
  switch (vValue) {
      case '0':
          vLabel.innerHTML = '0:30';break;
      case '1':
          vLabel.innerHTML = '0:45';break;
      default:
          if (oSlider.value%2 == 0) {
            vLabel.innerHTML = (oSlider.value)/2+':00';
          }
          else {
            vLabel.innerHTML = (oSlider.value-1)/2+':30';
          };break;
  };
  
  //This part is for switching from one side to another of the container
  if(vValue > vMiddle && vSide == "right") {
    vSide = "left";
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
    
  } else if(vValue <= vMiddle && vSide == "left") {
    vSide = "right";
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
  };
};

//Function to display the number of poses inside the container
function fIterValue(oSlider){
  var vLabel = oSlider.nextElementSibling;
  var vValue = oSlider.value;
  var vMiddle = oSlider.max/2;

  vLabel.innerHTML = vValue;

  //This part is for switching from one side to another of the container
  if(vValue > vMiddle && vSide == "right") {
    vSide = "left";
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
    
  } else if(vValue <= vMiddle && vSide == "left") {
    vSide = "right";
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
  };
}