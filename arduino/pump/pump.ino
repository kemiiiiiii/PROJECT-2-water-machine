// connect water pump
// receive data over web serial
// trigger water pump pulses based on sentence length
// ABOUT WATER PUMP: uses HIGH/LOW signals. Can be PWM but digital better

// Pump pin
int waterPumpPin = 8;

// Fan motor pins
int fanPin1= 3;
int fanPin2= 10;

// Web serial 
String data = "";


void setup() {
  // Pump initialise
  pinMode(waterPumpPin, OUTPUT);
  // Motors initialise
  pinMode(fanPin1, OUTPUT);
  pinMode(fanPin2, OUTPUT);
  // Serial initalise
  Serial.begin(9600);
}

void loop() {
// Read serial input:
if (Serial.available() > 0){
  data = Serial.readStringUntil('\n');
  if (data.length() > 0){
    int pumpCount = data.toInt();  // convert the string to an int
    
    // Pulse motor based on pump count
  for(int count = 0; count < pumpCount; count++){
    digitalWrite(waterPumpPin, HIGH);         // pump ON
    delay(500);
    digitalWrite(waterPumpPin, LOW);         // pump OFF
    delay(500);


    // Send a signal to p5 that the input has been processed
    if (count == pumpCount -1){
      Serial.println("Word processed");
    }


  }

}



}
