// connect water pump
// receive data over web serial
// trigger water pump pulses based on sentence length
// ABOUT WATER PUMP: uses HIGH/LOW signals. Can be PWM but digital better
// just mosfets, no reversal


// Pump pin
int pumpCountPin = 2;
int videoCountPin = 8;

// Web serial
String data = "";


void setup() {
 // Pump initialise
 pinMode(pumpCountPin, OUTPUT);
 pinMode (videoCountPin, OUTPUT);

 // Serial initalise
 Serial.begin(9600);
}


void loop() {
// Read serial input:
if (Serial.available() > 0){
 data = Serial.readStringUntil('\n');
 data.trim();

  if (data == "runPump") {

     // Pump 2 ON
      digitalWrite(videoCountPin, HIGH);         // pump ON
      delay(500);
      digitalWrite(videoCountPin, LOW);         // pump OFF
      delay(500);  

    // Send completion msg to p5 
    Serial.println("Video pump done");
  } 

  else if (data.length() > 0){
   int pumpCount = data.toInt();  // convert the string to an int
  
   // Pulse motor based on pump count
  for(int count = 0; count < pumpCount; count++){
    digitalWrite(pumpCountPin, HIGH);         // pump ON
    delay(500);
    digitalWrite(pumpCountPin, LOW);         // pump OFF
    delay(500);


   // Send a signal to p5 that the input has been processed
   if (count == pumpCount -1){
     Serial.println("Word processed");
   }

  }

 }

}






}



