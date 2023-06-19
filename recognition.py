import numpy as np
import pandas as pd
import cv2
import os
import face_recognition
from datetime import datetime, timedelta
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"
client = storage.Client(project='esp32cam-photos')
bucket = client.get_bucket('esp32cam-photos.appspot.com')

for blob in bucket.list_blobs(prefix='users'):
   photo = storage.Blob(blob.name, bucket)
   if blob.name != 'users/':
      photo.download_to_filename('C:/Users/Fujitsu/Documents/Arduino/CameraProject/' + blob.name)
 
path = r'C:/Users/Fujitsu/Documents/Arduino/CameraProject/users'
url = 'http://192.168.100.12'

#if 'Attendance.csv' in os.listdir(os.path.join(os.getcwd(),'attendance')):
# if 'Attendance.csv' in os.listdir('C:\\Users\\Fujitsu\\Documents\\Arduino\\CameraProject\\'):
#     print("there is..")
#     os.remove("Attendance.csv")
# else:
#     df = pd.DataFrame(list())
#     df.to_csv("Attendance.csv")
 
images = []
classNames = []
myList = os.listdir(path)
print(myList)

for cl in myList:
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])
print(classNames)
 
def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList
 
def markAttendance(name):
    with open("Attendance.csv", 'r+') as f:
        myDataList = f.readlines()
        nameList = []
        for line in myDataList:
            entry = line.split(',')
            nameList.append(entry[0])
            if name not in nameList:
                now = datetime.now()
                dtString = now.strftime('%H:%M:%S')
                f.writelines(f'\n{name},{dtString}')
 
encodeListKnown = findEncodings(images)
print('Encoding completed.')
 
cap = cv2.VideoCapture(url + ":81/stream")
counter = 0
 
while True:
    success, img = cap.read()
    # img_resp = urllib.request.urlopen(url)
    # imgnp = np.array(bytearray(img_resp.read()), dtype = np.uint8)
    # img = cv2.imdecode(imgnp, -1)
    #print(img)
    #img = captureScreen()
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
 
    facesCurFrame = face_recognition.face_locations(imgS)
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)
 
    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        print(faceDis)
        matchIndex = np.argmin(faceDis)
 
        if matches[matchIndex] and counter < 10:
            name = classNames[matchIndex].upper()
            print(name)
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
            cv2.putText(img, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            markAttendance(name)

        counter += 1

    cv2.imshow('Webcam', img)

    if (counter == 7):
        break

    key = cv2.waitKey(5)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
cv2.imread