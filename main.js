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

//Script that triggers the slideshow calls
function fTrigger(){

    //Cancels the previous run if such exists
    clearInterval(oInterval);

    oFiles  = document.getElementById('fileInput').files;

    if(oFiles.length!=0){
        //Sets the canvas overlay to opaque
        oOverlay.style.display = 'flex';

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
        //Idk, say something on the screen.
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
    if (aImagesAux.length==0){aImagesAux = shuffleArray(aImages).slice()};
    return aImagesAux.pop();
};

//Displays a given amount of pictures, each for a given amount of seconds
function fSeries(vIterations, vPeriod){

    //Displays first image
    fDisplayRand(oFiles[aImages[fBiasedRand(aImages.length)]]);

    //Display subsequent ones
    oInterval = setInterval(function(){
        fDisplayRand(oFiles[aImages[fBiasedRand(aImages.length)]])
    }, vPeriod*1000);

    //Stops the slideshow after a number of iterations and calls the next series
    setTimeout(function(){clearInterval(oInterval);fCallSeries()}, vIterations*(vPeriod)*1000-100);
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

        fSeries(vIte,vSec);
        vSeriesCount--;
    }
    else {
        oOverlay.style.display = 'none';
        oOut.src = '';
    };
};

//For randomizing the array
function shuffleArray(vArray) {
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
    oOverlay.style.display = 'none';
    oOut.src = '';
    clearInterval(oInterval);
    document.getElementById('menu-open').checked = false;
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