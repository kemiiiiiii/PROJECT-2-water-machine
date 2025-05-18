int waterPumpPin = 8;

// fan motor pins
int fanPin1= 3;
int fanPin2=  10;


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
  delay(500);
  Serial.println('MOTOR OFF');
}
