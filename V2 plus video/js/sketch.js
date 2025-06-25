
// DESCRIPTION: take in typed keyboard input
// and send string over webserial to trigger pump


// VARIABLES: serial port
let port;               // port
let connectBtn;         // connect to arduino button
let inputBtn;           // text button
let reservoirBtn;       // flow back to reservoir button

// VARIABLES: flags
let nextInputReady = false; // flag that will turn true when arduino serial data gets sent back
let drainageReady = false; // flag that will turn true when arduino is done draining to reservoir
let vidSignal = false; // activate video code 

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
  reservoirBtn.position(width/2-130, height/2 + 750);
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
  myInput.position(width/4.5, height/2 + 130);
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
    drainageReady = true;
  } else {
    port.close();
    nextInputReady = false;
    drainageReady = false;

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
    drainageReady = false;
    inputBtn.attribute('disabled', true);
  } 
}

// FUNCTION: PORT: send msg for counterflow
function reservoirBtnClick(){
  if (port.opened()){
    port.write('reverseFlow\n'); // send signal to trigger reverse
    // Lock buttons

    drainageReady = false;
    nextInputReady = false;

    // reset counters
    vidMlCounter = 0;
    inputMlCounter = 0;
    inputTotalml = 0;
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
    text('Processed.', width/10, 1150);
    text('Send more -->', width/10, 1190);
    noStroke();
    fill('green');
    circle(width/13, 1170, 30);
  pop();

    inputBtn.removeAttribute('disabled'); // unlock button
  } else {
    inputBtn.attribute('disabled', true); // lock button
  }

  // Flag to unlock reservoir button
  if (drainageReady) {
  reservoirBtn.removeAttribute('disabled'); // btn unlock
 } else {
  reservoirBtn.attribute('disabled', true); // btn lock
 }

// Reading from the port
if (port && port.opened()) {
  let msg = port.readUntil('\n');
  if (msg.length > 0) {
    msg = msg.trim();

    if (msg === 'Word processed') {
      vidSignal = true;
      console.log('✅ Word processed received');
    } else if (msg === 'Video pump done'){
      nextInputReady = true;
      drainageReady = true;
    } 
    
    else if (msg === 'Drainage complete') {
      drainageReady = true;
      nextInputReady = true;
      vidSignal = true;
      console.log('✅ Drainage complete received');
    } else if (msg === 'hello') {    // debug to check if arduino is getting msgs
      console.log('✅ reverseFlow acknowledged');
    } else {
      console.log('Received:', msg); // catch any debug
    }
  }
}


if (drainageReady) {
  reservoirBtn.removeAttribute('disabled'); // btn unlock
 } else {
  reservoirBtn.attribute('disabled', true); // btn lock
 }

 if (vidSignal){
    inputBtn.attribute('disabled', true); // lock button
 } else{
    inputBtn.removeAttribute('disabled'); // unlock button

 }

////////////////////////////////
////// GRAPHICS ///////

  // title text
  push();
  textAlign(CENTER, CENTER);
  textSize(200);
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
    text('Text water usage (ml):   ' + (inputTotalml), width/2.5, height/3 + 950);
    text('Video water usage (ml):  ' + (vidMlCounter) , width/2.5, height/3 + 1000);
  pop();
}


////////// LOAD YOUTUBE VIDEO

// FUNCTION: load the youtube video(s)
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '1480', 
    width: '800',
    // videoId: 'EF8C4v7JIbA',
    playerVars:{
      listType: 'playlist',
      list: 'PLyP0vkaFRFU1c5kBm0lyh29RMdCKJSqmK'
    }, 
    events:{
      'onStateChange': onPlayerStateChange
    }
  });
}

// FUNCTION: triggers when video state changes. send serial msg every 5s
function onPlayerStateChange(event){
  if (event.data === YT.PlayerState.PLAYING){
    console.log("Video playing!");

    // Pump interval
    pumpInterval = setInterval(() =>{ 
      console.log('interval fired');
      // run code that should happen intermittently here
    if (port.opened() && (vidSignal = true)) {
      console.log("port.opened():", port.opened()); // debug
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

// fix button locks for connecting to arduino Dx

