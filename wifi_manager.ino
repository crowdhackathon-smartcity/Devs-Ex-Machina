#include <ESP8266WiFi.h>

#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>  

// BTN pins
#define PIN_BTN1 1
#define BTN_DELAY 2000

// AP Creds
char ap_name[] = "MagicButton";
char ap_psk[] = "1241234";

// Host creds
char host_url[] = "example.com";
char host_path[] = "/";
char host_port = 80;



void setup()
{
	Serial.begin(115200);

	Serial.println("Starting");

	//
	// Init wifi manager
	// 
	WiFiManager wifi_manager;
Serial.println("Starting2");
	
	wifi_manager.setAPStaticIPConfig(IPAddress(10,0,0,1), IPAddress(10,0,0,1), IPAddress(255,255,255,0));\
Serial.println("Starting3");
	Serial.println("Connecting...");
	wifi_manager.autoConnect(ap_name, ap_psk);
Serial.println("Starting4");
	wifi_manager.autoConnect("MagicButton", "12341234");
Serial.println("Starting5");
	Serial.println("Connected!");

	// Set IO
	pinMode(0, INPUT);
}


void loop()
{

}
