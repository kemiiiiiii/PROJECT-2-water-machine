// connect water pump
// receive data over web serial
// trigger water pump pulses based on sentence length
// ABOUT WATER PUMP: uses HIGH/LOW signals. Can be PWM but digital better
// using the L298N Bi-directional Dual Motor Driver to reverse flow

// Motor pump 1
const int motor1pin1 =
const int motor2pin2 =
const int ENA = 
// Motor pump 2
const int motor2pin1 =
const int motor2pin2 =
const int ENA = 



// Web serial 
String data = "";


void setup() {
  // Pump 1 initialise
  pinMode(motor1pin1, OUTPUT); pinMode(motor2pin2, OUTPUT); pinMode(ENA, OUTPUT); 
  // Pump 2 initialise
  pinMode(motor2pin1, OUTPUT); pinMode(motor2pin2, OUTPUT); pinMode(ENB, OUTPUT); 


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
    digitalWrite(motor2pin1, HIGH); 
    digitalWrite(motor2pin2, LOW); 
    analogWrite(ENB, 255); // full speed  
    delay(500);
    // Pump 2 OFF
    digitalWrite(motor2pin1, LOW); 
    digitalWrite(motor2pin2, LOW);  
    

    // Send completion msg to p5 
    Serial.println("Video pump done");
  }

  else if (data.length() > 0){
    int pumpCount = data.toInt();  // convert the string to an int
    
  // Pulse pump 1 based on js charCount number str
  for(int count = 0; count < pumpCount; count++){

    // Pump 1 ON
    digitalWrite(motor1pin1, HIGH); 
    digitalWrite(motor1pin2, LOW);
    analogWrite(ENA, 255); // full speed
    delay(500);
    // Pump 1 OFF
    digitalWrite(motor1pin1, LOW); 
    digitalWrite(motor1pin2, LOW);  

    // Send completion msg to p5 
    if (count == pumpCount -1){
      Serial.println("Word processed");
    }
  }

}



}
