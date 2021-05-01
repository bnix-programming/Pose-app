//***Function scripts

var oOut = document.getElementById('outputImage');
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
        //Filters all the files and inputs the indexes of valid options in an array
        for (i=0; i < oFiles.length; i++){
            if (oFiles[i].type.includes("image/")){aImages.push(i);};
        };

        //Gets series data
        oSeries = document.getElementsByClassName('series-container');
        vSeriesCount = oSeries.length;
        fCallSeries();
    }
    else{
        oOut.src = '';
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
//Fuck JS, why do they make me use .slice() to make it so I can copy the contents for the fucking array? Why is the norm a1 = a2 making a pointer to the same memory ID!?
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
        var vSec = oSeries[vIndex].firstElementChild.nextElementSibling.value;

        switch (vSec) {
            case '0':
                vSec = 30;break;
            case '1':
                vSec = 45;break;
            default:
                vSec = vSec*30;break;
        };

        fSeries(oSeries[vIndex].firstElementChild.value,vSec);
        vSeriesCount--;
    }
    else {
        oOut.src = '';
    };
};

//Shamelessly copied this, don't even care. I did this logic three times and it didn't work because of the stupid .slice() to copy the contents of the array
function shuffleArray(array) {
    let curId = array.length;
     while (0 !== curId) {
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    };
    return array;
};

//***Visual scripts

//Function for displaying the number of seconds in the label after the slider
//This works dynamically, so I can create several sliders so to make class timers
function fTimeValue(oSlider){
    var vLabelText
    switch (oSlider.value) {
        case '0':
            vLabelText = '0:30';break;
        case '1':
            vLabelText = '0:45';break;
        default:
            if (oSlider.value%2 == 0) {
                vLabelText = (oSlider.value)/2+':00';
            }
            else {
                vLabelText = (oSlider.value-1)/2+':30';
            };break;
    };
    oSlider.nextElementSibling.innerHTML = vLabelText;
};