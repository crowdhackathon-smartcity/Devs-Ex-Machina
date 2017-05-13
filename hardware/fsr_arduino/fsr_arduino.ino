
void setup()
{
  Serial.begin(9600);

  pinMode(0, OUTPUT);
  pinMode(4, OUTPUT);
}
                                                                                                                                 
int thresh_b1 = 500 , thresh_b2 = 500;

void loop()
{
  int b1 = analogRead(A1);
  int b2 = analogRead(A2);

  Serial.print("b1: ");
  Serial.print(b1);
  Serial.print(" -- b2: ");
  Serial.println(b2); 
  
  digitalWrite(4, b1 > thresh_b1 ? HIGH : LOW);
}
