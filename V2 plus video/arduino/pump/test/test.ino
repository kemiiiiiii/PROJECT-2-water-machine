int waterPumpPin = 8;

void setup() {
  // pump initialise
  pinMode(waterPumpPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // pump on. 
  // drain for 2 seconds 
  digitalWrite(waterPumpPin, HIGH); 
  Serial.println('MOTOR ON');
  delay(500);

  //off
  digitalWrite(waterPumpPin, LOW);
  delay(500); // 10 seconds
  Serial.println('MOTOR OFF');
}
