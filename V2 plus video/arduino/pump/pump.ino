// connect water pump
// receive data over web serial
// trigger water pump pulses based on sentence length
// ABOUT WATER PUMP: uses HIGH/LOW signals. Can be PWM but digital better
// using the L298N Bi-directional Dual Motor Driver to reverse flow

// Motor pump 1
const int pumpCountpin1 = 8;
const int pumpCountpin2 = 7;
const int ENA = 3;
// Motor pump 2
const int videoCountpin1 = 12;
const int videoCountpin2 = 13;
const int ENB = 10;



// Web serial 
String data = "";


void setup() {
  // Pump 1 initialise
  pinMode(pumpCountpin1, OUTPUT); pinMode(pumpCountpin2, OUTPUT); pinMode(ENA, OUTPUT); 
  // Pump 2 initialise
  pinMode(videoCountpin1, OUTPUT); pinMode(videoCountpin2, OUTPUT); pinMode(ENB, OUTPUT); 


  // Serial initalise
  Serial.begin(9600);
}

void loop() {
// Read serial input:
if (Serial.available() > 0){
  data = Serial.readStringUntil('\n');
  data.trim();
  
  // Run pump 2 based on js runPump command string
  if (data == "runPump") {
     // Pump 2 ON
    digitalWrite(videoCountpin1, HIGH); 
    digitalWrite(videoCountpin2, LOW); 
    analogWrite(ENB, 255); // full speed  
    delay(500);
    // Pump 2 OFF
    digitalWrite(videoCountpin1, LOW); 
    digitalWrite(videoCountpin2, LOW);  
    

    // Send completion msg to p5 
    Serial.println("Video pump done");
  }

  else if (data.length() > 0){
    int pumpCount = data.toInt();  // convert the string to an int
    
  // Pulse pump 1 based on js charCount number str
  for(int count = 0; count < pumpCount; count++){

    // Pump 1 ON
    digitalWrite(pumpCountpin1, HIGH); 
    digitalWrite(pumpCountpin2, LOW);
    analogWrite(ENA, 255); // full speed
    delay(500);
    // Pump 1 OFF
    digitalWrite(pumpCountpin1, LOW); 
    digitalWrite(pumpCountpin2, LOW);  
    delay(500);

    // Send completion msg to p5 
    if (count == pumpCount -1){
      Serial.println("Word processed");
    }
  }

}



} 
}
