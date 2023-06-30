#include <Arduino_JSON.h>
#include <EEPROM.h>
#include <WiFi.h>
#include "credentials.h"
#include "esp_camera.h"
#include "Arduino.h"
#include "soc/soc.h"           // Disable brownout problems
#include "soc/rtc_cntl_reg.h"  // Disable brownout problems
#include "driver/rtc_io.h"
#include <SPIFFS.h>
#include <FS.h>
#include <Firebase_ESP_Client.h>
#include <HTTPClient.h>
#include <addons/TokenHelper.h> //Provide the token generation process info.

#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define API_KEY "AIzaSyBUTIdY3DTD48Xi1neY852mnB2LzKqduEQ"
#define USER_EMAIL "dok246@gmail.com"
#define USER_PASSWORD "secstat135"
#define STORAGE_BUCKET_ID "esp32cam-photos.appspot.com"
#define PHOTO_PATH "/data/alert"
#define EEPROM_SIZE 1

HTTPClient http;
const char* ssid = ssidKey;
const char* password = passKey;
char apiUrlGet[] = "http://192.168.1.3:8080/api/getdata/last";
char apiUrlPost[] = "http://192.168.1.3:8080/api/startprocess";

bool taskCompleted = false;
bool matchFace = true;
bool activeRelay = false;
int detection = 0;
const int buzzPin = 12;
const int pirPin = 13;
const int gasPin = 14;
const int relayPin = 15;
long prevMillis = 0;
int interval = 5000;
int alertNumber = 0;
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig configF;
String filePhoto = "";

bool checkPhoto(fs::FS &fs) {
  File f_pic = fs.open(filePhoto);
  unsigned int pic_sz = f_pic.size();
  return (pic_sz > 100);
}

void initSPIFFS() {
  if (!SPIFFS.begin(true)) {
    Serial.println("An Error has occurred while mounting SPIFFS");
    ESP.restart();
  }
  else {
    delay(500);
    Serial.println("SPIFFS mounted successfully");
  }
}

// Capture Photo and Save it to SPIFFS
void capturePhotoSaveSpiffs(void) {
  camera_fb_t * fb = NULL;
  bool ok = 0; // Boolean indicating if the picture has been taken correctly

  do {
    Serial.println("Taking a photo...");

    fb = esp_camera_fb_get();

    if (!fb) {
      Serial.println("Camera capture failed");
      return;
    }

    alertNumber = EEPROM.read(0) + 1;
    filePhoto = PHOTO_PATH + String(alertNumber) + ".jpg";

    Serial.printf("Picture file name: %s\n", filePhoto);
    File file = SPIFFS.open(filePhoto, FILE_WRITE);
    // Insert the data in the photo file
    if (!file) {
      Serial.println("Failed to open file in writing mode");
    }
    else {
      file.write(fb->buf, fb->len); // payload (image), payload length
      Serial.print("The picture has been saved in ");
      Serial.print(filePhoto);
      Serial.print(" - Size: ");
      Serial.print(file.size());
      Serial.println(" bytes");
      EEPROM.write(0, alertNumber);
      EEPROM.commit();
    }

    file.close();
    esp_camera_fb_return(fb);

    // check if file has been correctly saved in SPIFFS
    ok = checkPhoto(SPIFFS);
  } while (!ok);
}

void startCameraServer();

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  pinMode(pirPin, INPUT);
  pinMode(relayPin, OUTPUT);
  //digitalWrite(relayPin, LOW);
  initSPIFFS();
  pinMode(buzzPin, OUTPUT);

  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  EEPROM.begin(EEPROM_SIZE);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  pinMode(4, INPUT);
  digitalWrite(4, LOW);
  rtc_gpio_hold_dis(GPIO_NUM_4);
  
  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality for larger pre-allocated frame buffer.
  if (psramFound()) {
    config.frame_size = FRAMESIZE_UXGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } 
  else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t * s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1); // flip it back
    s->set_brightness(s, 1); // up the brightness just a bit
    s->set_saturation(s, -2); // lower the saturation
  }
  // drop down frame size for higher initial frame rate
  s->set_framesize(s, FRAMESIZE_QVGA);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("\nWiFi connected");

  startCameraServer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");

  int httpResponseCode;

  http.begin(apiUrlPost);

  httpResponseCode = http.POST("");

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();

  configF.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  //Assign the callback function for the long running token generation task (see addons/TokenHelper.h)
  configF.token_status_callback = tokenStatusCallback;

  Firebase.begin(&configF, &auth);
  Firebase.reconnectWiFi(true);

  delay(12000);

  http.begin(apiUrlGet);
  
  httpResponseCode = http.GET();
  JSONVar jsonResponse;
  JSONVar keys;
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);

    jsonResponse = JSON.parse(response);
    keys = jsonResponse.keys();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  String response = jsonResponse[keys[0]];

  http.end();

  pinMode(4, OUTPUT);
  digitalWrite(4, LOW);
  rtc_gpio_hold_en(GPIO_NUM_4);

  if (response == "yes" && activeRelay == false) {
    activeRelay = true;
    digitalWrite(relayPin, HIGH);
    Serial.println("here");
    // delay(800);
    // prevMillis = millis();
  }
  else {
    //buzzer sound, make a photo, upload it in firebase -> send an email

    digitalWrite(buzzPin, HIGH);
    delay(2000);
    digitalWrite(buzzPin, LOW);

    capturePhotoSaveSpiffs();

    if (Firebase.ready() && !taskCompleted) {
      taskCompleted = true;
      Serial.print("Uploading picture... ");

      //MIME type should be valid to avoid the download problem. The file systems for flash and SD/SDMMC can be changed in FirebaseFS.h.
      if (Firebase.Storage.upload(&fbdo, STORAGE_BUCKET_ID, filePhoto, mem_storage_type_flash, filePhoto, "image/jpeg" /* mime type */)) {
        Serial.printf("\nDownload URL: %s\n", fbdo.downloadURL().c_str());
      }
      else {
        Serial.println(fbdo.errorReason());
      }
    }
  }

  delay(5000);
  
  if (activeRelay == true) {//&& millis() - prevMillis > interval) {
    activeRelay = false;
    matchFace = false; 
    digitalWrite(relayPin, LOW);
  }

  esp_sleep_enable_ext0_wakeup(GPIO_NUM_13, 1);
  esp_deep_sleep_start();
}

void loop() {

}
