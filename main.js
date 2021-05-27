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

function fSkipSlide(){
    vItCount--;
    fFadeWhite();
    clearInterval(timerInterval);
    display.textContent = minutes + ':' + seconds;

    vTimerDuration = vGlobalTime;
    setTimeout(function(){fStopClock()}, 1000);
}

function fRemoveSeries (iSeries){
    iSeries.parentElement.parentElement.remove();
}

function fAddSeries () {
    var lvContainer = document.getElementById("series"),
        lvText = '',
        lvNode = document.createElement("li");
    
    lvNode.classList.add('series-container');

    lvText += '<div>';
        lvText += '<div class="series-lines">';
            lvText += '<div class="series-buttons" onclick="fIncreaseCount(this)"><div>&#708;</div></div>';
            lvText += '<div class="series-slider">';
                lvText += '<input class="slider-input" type="range" min="1" value="5" max="100" oninput="fIterValue(this)">';
                lvText += '<label class="slider-label isRight">5</label>';
            lvText += '</div>';
            lvText += '<div class="series-buttons" onclick="fDecreaseCount(this)"><div>&#709;</div></div>';
            lvText += '<div>';
                lvText += '&nbsp;Iterations';
            lvText += '</div>';
        lvText += '</div>';
        lvText += '<br>';
        lvText += '<div class="series-lines">';
            lvText += '<div class="series-buttons time" onclick="fIncreaseCount(this)"><div>&#708;</div></div>';
            lvText += '<div class="series-slider">';
                lvText += '<input class="slider-input" type="range" min="0" value="2" max="30" oninput="fTimeValue(this)">';
                lvText += '<label class="slider-label isRight">1:00</label>';
            lvText += '</div>';
            lvText += '<div class="series-buttons time" onclick="fDecreaseCount(this)"><div>&#709;</div></div>';
            lvText += '<div>';
                lvText += '&nbsp;Pose Length';
            lvText += '</div>';
        lvText += '</div>';
    lvText += '</div>';
    lvText += '<div>';
        lvText += '<button class="rm-button" onclick="fRemoveSeries(this)">Remove</button>';
    lvText += '</div>';

    lvNode.innerHTML = lvText;

    lvContainer.appendChild(lvNode);
};

function fIncreaseCount(iButton){
    var vSlider = iButton.nextElementSibling.firstElementChild;
    vSlider.value ++;

    if (iButton.classList.contains('time')){
        fTimeValue(vSlider);
    }
    else {
        fIterValue(vSlider);
    };
};

function fDecreaseCount(iButton){
    var vSlider = iButton.previousElementSibling.firstElementChild
    vSlider.value --;

    if (iButton.classList.contains('time')){
        fTimeValue(vSlider);
    }
    else {
        fIterValue(vSlider);
    };
};

//***Visual scripts


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
  if(vValue > vMiddle && vLabel.classList.contains('isRight')) {
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
  } 
  else if (vValue <= vMiddle && vLabel.classList.contains('isLeft')){
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
  if(vValue > vMiddle && vLabel.classList.contains('isRight')) {
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
    
  } else if(vValue <= vMiddle && vLabel.classList.contains('isLeft')) {
    vLabel.classList.toggle("isRight");
    vLabel.classList.toggle("isLeft");
  };
}