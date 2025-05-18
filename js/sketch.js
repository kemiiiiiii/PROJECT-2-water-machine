
// DESCRIPTION: take in typed keyboard input
// and send string over webserial to trigger pump


// VARIABLES: serial port
let port;               // port
let connectBtn;         // input button

// VARIABLES: flags
let nextInputReady = false; // flag that will turn true when arduino serial data gets sent back

function setup() {
  createCanvas(2960, 1600);
  port = createSerial();

  // INITIALISE: connect to arduino button
  push(); 
  connectBtn = createButton('Connect to Arduino');
  connectBtn.size(500, 100);
  connectBtn.position(width/2-260, height/2 + 600);
  connectBtn.mousePressed(connectBtnClick);
  connectBtn.style('font-size', '40px');
  pop();

  // INITIALISE: ENTER button
  push(); 
  inputBtn = createButton('ENTER');
  inputBtn.size(500, 100);
  inputBtn.position(width/2-260, height/2 + 430);
  inputBtn.mousePressed(inputBtnClick);
  inputBtn.style('font-size', '40px');
  pop();
  
  // INITIALISE: input field
  myInput = createInput();
  myInput.position(200, height/2 + 150);
  myInput.size(2500,200);
  myInput.style('font-size', '100px');  // set font size 
  myInput.attribute('maxlength', '50'); // set char limit to 50 
  myInput.input(onTyping);              // calls function when text field receives input
}

// FUNCTION: Open / close serial port at 9600 baud / send typed input to arduino
function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }

}

// FUNCTION: PORT: Send typed input to Arduino over webserial
function inputBtnClick(){
  if(port.opened()){
    let charCount = myInput.value().length;
    let charCountStr = String(charCount);    // Convert brightness to string
    port.write(charCountStr + '\n');         // Send brightness with newline
    
    // Lock button
    nextInputReady = false;
    inputBtn.attribute('disabled', true);
  } 
}

// FUNCTION: counts how much input text field receives
function onTyping(){
  let charCount = myInput.value().length;
  // console.log(charCount);
}

function draw() {
  // Use keyboard input to drive bg  
  background(255);


  // Define character count in draw 
  let charCount = myInput.value().length; 

////PORT: SENDING INPUT/////
// Update button label based on connection status
  connectBtn.html(port.opened() ? 'Disconnect' : 'Connect to Arduino');

  // PORT: Error msg if ENTER is pressed before port connect


////PORT: READING ARDUINO INPUT/////
  // PORT: Read 'Word Processed message from Arduino and unlock button
  if (nextInputReady) {
    fill('blue');
    textSize(40);
    text('Word Processed!', width/2, height/4);
    inputBtn.removeAttribute('disabled'); // unlock button
  } else {
    inputBtn.attribute('disabled', true); // lock button
  }

if (port && port.opened()){    // if port exists and if the port is opened
    port.readUntil('\n').then((greenLight) => {
    if (greenLight.trim() == 'Word processed'){
      nextInputReady = true;
    } else {
      nextInputReady = false;
    }
  });
}

   
////////////////////////////////
////// GRAPHICS ///////



  // title text
  push();
  textAlign(CENTER, CENTER);
  textSize(240);
  fill('#002a6e');
  text('Word-To-Water', width/2, 300);


  pop();
  // instructions
  push();
    textAlign(CENTER, CENTER);
    textSize(80);
    fill('black');
    text('type something!', width/2, height/3);
    textSize(40);
    text('The more you type, the more water the pump transfers.', width/2, height/3 + 150);
    text('Characters remaining:' + '  ' + (50-(charCount)), width/2, (height/3) + 280);
    pop();
  // line draw
  push();
    stroke('black');
    strokeWeight(5);
    strokeCap(ROUND);
    line((width/2)-1200, (height/2)+200, (width/2)+1200, (height/2)+200);
  pop();


}



