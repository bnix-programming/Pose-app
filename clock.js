var minutes,
    seconds,
    isPaused,
	isStopped = true,
    workTimer = true,
	workTimeElem,
    vGlobalTime,
    vTimerDuration,
	vLineWidth = 6 * 1.5,
    display = document.querySelector('#countdown-timer');

// Variables for Canvas
var sAngle = 1.5,
	eAngle = 1.5,
	circleTime, // needed to have full set up time, to have correct circle ending angle
	displayTimerElem,
	radius;


// Set and display computed time in the clock
function setDuration(dur){
  minutes = (dur / 60) | 0;    
  seconds = dur % 60 | 0;

  minutes = minutes < 10 ? '0' + minutes : minutes;    
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  return display.textContent = minutes + ':' + seconds;
}

// Setting up Work timer
function startWorkTimer(){
  	if(!isPaused){
		setDuration(vTimerDuration);
		drawCircle();
		
		if(vTimerDuration === 0){
			fFadeWhite();
			clearInterval(timerInterval);
			display.textContent = minutes + ':' + seconds;

			vTimerDuration = vGlobalTime;
			fStopClock();
		} 
		else{
			vTimerDuration--;
		}
  	}  
}

// Create animation for watch circle
function drawCircle(){
	// Countdown Watch Drawing
	var canvasCircle = document.querySelector('#countdown-timer-circle');
	// Setting canvas height and width
	canvasCircle.height = displayTimerElem.offsetWidth;
	canvasCircle.width = displayTimerElem.offsetWidth;
	
	var contextCircle = canvasCircle.getContext('2d');
	var centerCircleX = canvasCircle.width / 2;
	var centerCircleY = canvasCircle.height / 2;
	
	contextCircle.clearRect(0, 0, canvasCircle.width, canvasCircle.height); // This clears Circle each second
	if(!isStopped){
		contextCircle.save();
		contextCircle.beginPath();
		
		contextCircle.arc(centerCircleX, centerCircleY, radius, sAngle * Math.PI, eAngle * Math.PI, false);
		contextCircle.strokeStyle = 'rgb(0, 103, 125)';
		contextCircle.lineWidth = vLineWidth;
		contextCircle.stroke();
		contextCircle.restore();
		
		eAngle += 2 / circleTime;
		
		if(eAngle > 3.5){
			eAngle = 1.5;
		}	
	}
}

var timerInterval; // set Interval Variable. Nothing in the value, as will invoke interval function


function fInitClock(){
	// Declaring Watches
	// Code for Circle Background
	displayTimerElem = document.querySelector('.timer-wrapper section');
	var canvasBg = document.querySelector('#countdown-timer-bg');
	
	// Setting canvas height and width
	canvasBg.height = displayTimerElem.offsetWidth;
	canvasBg.width = displayTimerElem.offsetWidth;
	
	var contextBG = canvasBg.getContext('2d');
	var centerBgX = canvasBg.width / 2;
	var centerBgY = canvasBg.height / 2;
	radius = displayTimerElem.offsetWidth / 2.7;

	// Circle Background
	contextBG.beginPath();
	contextBG.arc(centerBgX, centerBgY, radius, 0, 2 * Math.PI);
	contextBG.lineWidth = vLineWidth;
	contextBG.strokeStyle = 'rgb(225, 225, 225)';
	contextBG.stroke();
	contextBG.closePath();
};

function fStopClock(){ 
	isStopped = true;

	display.textContent = setDuration(vTimerDuration);

	vTimerDuration = 0;
    vGlobalTime = 0;
	
	eAngle = 1.5;
	drawCircle();
	
	clearInterval(timerInterval);
}

function fStartClock(iPeriod){
	vTimerDuration = iPeriod;
    vGlobalTime = iPeriod;
	circleTime = vTimerDuration;

	eAngle = 1.5;
	eAngle += 2 / circleTime
	
	startWorkTimer();
	timerInterval = setInterval(startWorkTimer, 1000);
	isPaused = false,
	isStopped = false;
}

function fPauseClock(playBtn){
	isPaused = true;
	playBtn.classList.toggle('pause');
	playBtn.classList.toggle('continue');
}

function fContinueClock(playBtn){
	isPaused = false;
	playBtn.classList.toggle('pause');
	playBtn.classList.toggle('continue');
};

function fButtonToggle(iBtn){
	if(iBtn.classList.contains('continue')){
		fContinueClock(iBtn);
	}
	else{
		fPauseClock(iBtn);
	};
};