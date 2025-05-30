
// DESCRIPTION: take in typed keyboard input
// and send string over webserial to trigger pump


// VARIABLES: serial port
let port;               // port
let connectBtn;         // connect to arduino button
let reservoirBtn;       // flow back to reservoir button

// VARIABLES: flags
let nextInputReady = false; // flag that will turn true when arduino serial data gets sent back
let drainageComplete = false; // flag that will turn true when arduino is done draining to reservoir

// VARIABLES: counters
let inputMlCounter = 0; // input counter for text
let vidMlCounter = 0;   // input counter for text
let inputTotalml = 0;   // charCount input + starting 5ml text input

// VARIABLES: video 
let player;
let pumpInterval; // stores vid pump time pause intervals

// VARIABLES: font
let font;
let boldFont;

// VARIABLES: mapped visuals
smoothedRectLength = 0;


// FUNCTION: preload font
function preload(){
  font = loadFont('/assets/Helvetica-01.ttf');
  boldFont = loadFont('/assets/Helvetica-Bold-02.ttf');
}

function setup() {
  
  // INITIALISE: Canvas 
  let cnv = createCanvas(windowWidth/2, windowHeight);
  cnv.id('sketch');
  port = createSerial();

  // INITIALISE: Font
  textFont(font);

  // INITIALISE: connect to arduino button
  push(); 
  connectBtn = createButton('Connect to Arduino');
  connectBtn.size(500, 100);
  connectBtn.position(width/2-260, height/2 + 450);
  connectBtn.mousePressed(connectBtnClick);
    // styling
    connectBtn.style('font-family', 'Helvetica');
    connectBtn.style('z-index', '20');
    connectBtn.style('font-size', '40px');
  pop();

  // INITIALISE: ENTER button
  push(); 
  inputBtn = createButton('ENTER');
  inputBtn.size(500, 100);
  inputBtn.position(width/2-260, height/2 + 320);
  inputBtn.mousePressed(inputBtnClick);
    // styling
    inputBtn.style('font-family', 'Helvetica');
    inputBtn.style('z-index', '20');
    inputBtn.style('font-size', '40px');
  pop();

  // INITIALISE: 'Back to Reservoir' button
  push();
  reservoirBtn = createButton('Back to Reservoir');
  reservoirBtn.size(250,50);
  reservoirBtn.position(width/2-130, height/2 +710);
  reservoirBtn.mousePressed(reservoirBtnClick);
    // styling
    reservoirBtn.style('font-family', 'Helvetica');
    reservoirBtn.style('z-index', '20');
    reservoirBtn.style('font-size', '25px');
    // reservoirBtn.style('color', '#ffffff');
    // reservoirBtn.style('background-color', '#09203b');

  pop();
  
  // INITIALISE: input field
  myInput = createInput();
  myInput.position(200, height/2 + 160);
  myInput.size(1000,100);
    // styling
    myInput.style('z-index', '20');
    myInput.style('font-family', 'Helvetica');
    myInput.style('font-size', '60px');  // set font size 
    myInput.attribute('maxlength', '50'); // set char limit to 50 

  myInput.input(onTyping);              // calls function when text field receives input
}

// FUNCTION: Open / close serial port at 9600 baud / send typed input to arduino
function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
    nextInputReady = true;
  } else {
    port.close();
    nextInputReady = false;
  }

}
////PORT: SENDING INPUT/////
// FUNCTION: PORT: Send typed input to Arduino over webserial
function inputBtnClick(){
  if(port.opened()){
    let charCount = myInput.value().length;
    let charCountStr = String(charCount);    // Convert charcount to string
    port.write(charCountStr + '\n');         // Send charcount with newline
    // counter update
    inputMlCounter += charCount +=5; // per msg
    inputTotalml += charCount; // accumulate variable
    
    // Lock button
    nextInputReady = false;
    inputBtn.attribute('disabled', true);
  } 
}

// FUNCTION: PORT: send msg for counterflow
function reservoirBtnClick(){
  if (port.opened()){
    port.write('reverseFlow' + '\n'); // send signal to trigger reverse
    // Lock button
    reservoirBtn.attribute('disabled', true); 
  }
}

// FUNCTION: counts how much input text field receives
function onTyping(){
  let charCount = myInput.value().length;
  // console.log(charCount);
}


function draw() {
// Define character count in draw 
let charCount = myInput.value().length; 

//// BACKGROUND: Use keyboard input to drive bg  
  background(255);
  // rect that expands based on char count
  // map charcCount to rect length
  // lerp for smoothness
  push();
    rectMode(CORNER);
    let rectLength = map(charCount, 0, 50, 0, windowWidth);
    smoothedRectLength = lerp(smoothedRectLength, rectLength, 0.1); 
    noStroke();
    fill('#d4eeff');
    rect(0, 0, smoothedRectLength, windowHeight); //  change windowheight to the mapped lerped variable
  pop();

// Update button label based on connection status
  connectBtn.html(port.opened() ? 'Disconnect' : 'Connect to Arduino');


////PORT: READING ARDUINO INPUT/////
  // PORT: Read 'Word Processed message from Arduino and unlock button

  // Flag to unlock the input button
  if (nextInputReady) {
  push();
  textAlign(LEFT,CENTER);
    textFont(font);
    textSize(30);
    text('Processed.', width/7, 1190);
    text('Send more -->', width/7, 1230);
    noStroke();
    fill('green');
    circle(width/9, 1210, 30);
  pop();

    inputBtn.removeAttribute('disabled'); // unlock button
  } else {
    inputBtn.attribute('disabled', true); // lock button
  }

  // Flag to unlock reservoir button
  if (drainageComplete) {
  reservoirBtn.removeAttribute('disabled'); // btn unlock
 } else {
  reservoirBtn.attribute('disabled', true); // btn lock
 }

// Reading from the port
if (port && port.opened()){  // if port exists & if the port is opened  
  let greenLight = port.readUntil('\n');      // assign port reading to variable greenLight
  let reservoirSign = port.readUntil('\n');   // assign port reading to variable reservoirSign

  if (greenLight.length > 0) { // reading to unlock inputbtn
    if (greenLight.trim() === 'Word processed'){
      nextInputReady = true;
    } 
  } 
  if (reservoirSign.length > 0) { // read to unlock reservoirbtn
    if (reservoirSign.trim() === 'Drainage complete'){
    drainageComplete = true;
  }  
} 
}

// PORT: Read 'Drainage complete' message from Arduino and unlock button
// if (port && port.opened()){
// let reservoirSign = port.readUntil('\n');
// if (reservoirSign.length > 0) { // read variable
//   if (reservoirSign.trim() === 'Drainage complete'){
//     drainageComplete = true;
//   }  
// }
// }

if (drainageComplete) {
  reservoirBtn.removeAttribute('disabled'); // btn unlock
 } else {
  reservoirBtn.attribute('disabled', true); // btn lock
 }


////////////////////////////////
////// GRAPHICS ///////

  // title text
  push();
  textAlign(CENTER, CENTER);
  textSize(150);
  textFont(boldFont);
  fill('#002a6e');
  text('Word-To-Water', width/2, 300);


  pop();
  // instructions
  push();
    textAlign(CENTER, CENTER);
    textSize(80);
    fill('#002a6e');
    text('type something!', width/2, height/3 -50);
    textSize(40);
    text('The more you type, the more water the pump transfers.', width/2, (height/3 + 300)-200);
    text('This measures against the video to the right, which will', width/2, (height/3 + 400)-200);
    text('drive its own pump.', width/2, (height/3 + 450)-200);
    textFont(boldFont);
    text('Characters remaining:' + '  ' + (50-(charCount)), width/2, ((height/3) + 550)-200);
  pop();

  // counter
  push();
  textAlign(LEFT,CENTER);
    textFont(font);
    textSize(30);
    text('Text water usage (ml):   ' + (inputTotalml), width/2.5-40, height/3 + 880);
    text('Video water usage (ml):  ' + (vidMlCounter) , width/2.5-40, height/3 + 920);
  pop();
}


////////// LOAD YOUTUBE VIDEO

// FUNCTION: load the youtube video(s)
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '1480', 
    width: '800',
    videoId: 'EF8C4v7JIbA',
    events:{
      'onStateChange': onPlayerStateChange
    }
  });
}

// FUNCTION: triggers when video state changes
function onPlayerStateChange(event){
  if (event.data === YT.PlayerState.PLAYING){
    console.log("Video playing!");

    // Pump interval
    pumpInterval = setInterval(() =>{ 
      console.log('interval fired');
      // run code that should happen intermittently here
    if (port.opened()) {
      console.log("port.opened():", port.opened());
      port.write("runPump\n"); // send cmd to arduino for pump activation
      vidMlCounter +=1; // update vid ml counter
      console.log('working');
    } else {
      console.log('port not open');
    }
    }, 5000); // every 5 seconds
    
    
  } else {
    // stop pump if paused / stop interval function 
    clearInterval(pumpInterval); 
    console.log('not working');

  }
}

// for later: add a video queue and make it so that
// when text tank is full, send msg to arduino so that
// motor flow is reversed and tank is drained



