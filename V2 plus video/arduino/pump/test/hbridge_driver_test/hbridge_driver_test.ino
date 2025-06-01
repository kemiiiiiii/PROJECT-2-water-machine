
//Motor pump 1
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
  // pumps on.
  // drain for 1/2 second
  digitalWrite(videoCountpin1, HIGH);
  digitalWrite(videoCountpin2, LOW);
  analogWrite(ENB, 255);  // full speed
  delay(500);

  //off
  digitalWrite(videoCountpin1, LOW);
  digitalWrite(videoCountpin2, LOW);
  delay(500);


  Serial.println("MOTOR OFF");
}
