#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <ESP32Servo.h>

LiquidCrystal_I2C lcd(0x27,16,2);

const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {15,2,4,16};
byte colPins[COLS] = {17,5,18,19};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

Servo myservo;
const int ledVerde = 12;
const int ledVermelho = 13;

const char* ssid = "Wokwi-GUEST"; 
const char* password = "";         
const String FIREBASE_HOST = "https://fechadura-eletronica-d63a4-default-rtdb.firebaseio.com/Users.json";

String entrada = "";
const int MAX_DIGITOS = 4;

int failedAttempts = 0;
const int MAX_ATTEMPTS = 3;
bool locked = false;
unsigned long lockStart = 0;
const unsigned long LOCK_DURATION = 60000UL;

void setup() {
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  delay(100);
  lcd.setCursor(0,0);
  lcd.print("Conectando WiFi...");

  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");
  unsigned long startAttemptTime = millis();

  while(WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    delay(500);
    Serial.print(".");
    lcd.setCursor(0,1);
    lcd.print(".");
  }

  if(WiFi.status() == WL_CONNECTED){
    Serial.println("\nWiFi conectado!");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("WiFi Conectado!");
  } else {
    Serial.println("\nFalha na conexão WiFi");
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Falha WiFi");
  }
  delay(1000);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Digite a senha:");
  limpaLinha2();

  pinMode(ledVerde, OUTPUT);
  pinMode(ledVermelho, OUTPUT);
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledVermelho, LOW);

  myservo.attach(14,500,2500);
  myservo.write(0);
}

void loop() {
  if (locked) {
    unsigned long elapsed = millis() - lockStart;
    if (elapsed >= LOCK_DURATION) {
      locked = false;
      failedAttempts = 0;
      entrada = "";
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Desbloqueado");
      delay(800);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Digite a senha:");
      limpaLinha2();
    } else {
      unsigned long remaining = (LOCK_DURATION - elapsed)/1000;
      lcd.setCursor(0,0);
      lcd.print("Bloqueado - aguarde");
      lcd.setCursor(0,1);
      lcd.print("Esperar: ");
      lcd.print(remaining);
      lcd.print("s  ");
      delay(250);
    }
    return;
  }

  char tecla = keypad.getKey();
  if(tecla) {
    if(tecla == '#') {
      if(checaSenha(entrada)) {
        lcd.clear();
        lcd.print("Acesso Liberado");
        digitalWrite(ledVerde,HIGH);
        digitalWrite(ledVermelho,LOW);
        myservo.write(90);
        delay(3000);
        myservo.write(0);
        digitalWrite(ledVerde,LOW);
        failedAttempts=0;
      } else {
        failedAttempts++;
        lcd.clear();
        lcd.print("Senha Incorreta");
        digitalWrite(ledVermelho,HIGH);
        digitalWrite(ledVerde,LOW);
        delay(1500);
        digitalWrite(ledVermelho,LOW);

        if(failedAttempts>=MAX_ATTEMPTS){
          locked=true;
          lockStart=millis();
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("Bloqueado 60s");
          lcd.setCursor(0,1);
          lcd.print("Tentativas esgot.");
        }
      }
      entrada="";
      if(!locked){
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Digite a senha:");
        limpaLinha2();
      }
    } else if(tecla=='*') {
      entrada="";
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Digite a senha:");
      limpaLinha2();
    } else if(tecla=='D') {
      if(entrada.length()>0) entrada.remove(entrada.length()-1);
      mostraAsteriscos();
    } else {
      if(entrada.length()<MAX_DIGITOS && tecla>='0' && tecla<='9'){
        entrada+=tecla;
        mostraAsteriscos();
      }
    }
  }
}

void mostraAsteriscos(){
  lcd.setCursor(0,1);
  lcd.print("                ");
  lcd.setCursor(0,1);
  for(unsigned int i=0;i<entrada.length();i++) lcd.print('*');
}

void limpaLinha2(){
  lcd.setCursor(0,1);
  lcd.print("                ");
  lcd.setCursor(0,1);
}

bool checaSenha(String s){
  if(WiFi.status()!=WL_CONNECTED) {
    Serial.println("WiFi não conectado");
    return false;
  }

  HTTPClient http;
  String url = FIREBASE_HOST;
  Serial.println("Fazendo requisição para: " + url);

  http.begin(url, NULL);

  int code = http.GET();
  if(code > 0){
    Serial.println("Código HTTP: " + String(code));
    String payload = http.getString();
    Serial.println("Payload recebido:");
    Serial.println(payload);
    http.end();

    DynamicJsonDocument doc(4096);
    DeserializationError error = deserializeJson(doc, payload);
    if(error){
      Serial.print("Erro ao desserializar JSON: ");
      Serial.println(error.c_str());
      return false;
    }

    for(JsonPair kv : doc.as<JsonObject>()){
      String key = kv.key().c_str();
      String password = kv.value()["password"];
      Serial.println("Verificando senha do usuário: " + key);
      if(password == s) {
        Serial.println("Senha correta!");
        return true;
      }
    }
  } else {
    Serial.println("Erro HTTP: " + String(code));
    http.end();
  }

  return false;
}
