// ABOUT WATER PUMP: uses HIGH/LOW signals. Can be PWM but digital better
// Use the L298N Bi-directional Dual Motor Driver to reverse flow

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
  pinMode(pumpCountpin1, OUTPUT);
  pinMode(pumpCountpin2, OUTPUT);
  pinMode(ENA, OUTPUT);
  // Pump 2 initialise
  pinMode(videoCountpin1, OUTPUT);
  pinMode(videoCountpin2, OUTPUT);
  pinMode(ENB, OUTPUT);

  // Serial initalise
  Serial.begin(9600);
}

void loop() {
  // Reverse TEXT PUMP flow
  digitalWrite(pumpCountpin1, LOW);
  digitalWrite(pumpCountpin2, HIGH);
  delay(500);

  // Reverse VIDEO PUMP flow
  digitalWrite(videoCountpin1, LOW);
  digitalWrite(videoCountpin2, HIGH);
  delay(500);
}