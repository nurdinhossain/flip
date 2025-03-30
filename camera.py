# Code for Raspberry Pi
import cv2
import time
import os
import roboflow
import threading
import serial
import numpy as np
import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from bson.objectid import ObjectId

from google import genai
from google.genai import types
import PIL.Image

if __name__ == "__main__":

    # Configuration
    OUTPUT_FOLDER = "captures"
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)


    # Initialize camera
    cam = cv2.VideoCapture('/dev/video0')
    if not cam.isOpened():
        exit()
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

<<<<<<< HEAD

# Get frame dimensions
ret, frame = cam.read()
if not ret:
    exit()
    
frame_height, frame_width = frame.shape[:2]

# Create a mask for the bottom part of the frame
# This will mask the bottom 30% of the frame - adjust the percentage as needed
mask_height = int(frame_height * 0.3)#here                                                    # 30% of the frame height
motion_mask = np.ones((frame_height, frame_width), dtype=np.uint8) * 255
motion_mask[frame_height - mask_height:frame_height, :] = 0  # Bottom part is masked (black)

# Background subtractor setup
bg_subtractor = cv2.createBackgroundSubtractorMOG2(
    history=500, 
    varThreshold=25, 
    detectShadows=False
)
MIN_MOTION_AREA = 500  # Minimum contour area to consider as motion
COOLDOWN = 2.0  # Seconds between motion triggers
last_motion_time = 0
frame_count = 0
capture_pending = False

uri = "MONGODBURI"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["MONGODB"]
collection = db["trashcans"]
capture_counter = 0

isRecyclable = 0

def rotateArduino(recylclable):
    ser = serial.Serial('/dev/ttyACM1', 9600, timeout=1)
    ser.flush()

    if recylclable:
        #rotate to the right
        ser.write(b"1\n")
    else:
        #rotate to the left
        ser.write(b"0\n")
    time.sleep(3)



try:
    while True:
        ret, frame = cam.read()
        if not ret:
            break

        current_time = time.time()
=======
    # Get frame dimensions
    ret, frame = cam.read()
    if not ret:
        exit()
>>>>>>> 820359cb8cea9ce6fc31894fb8f1bae9ab1a56d3
        
    frame_height, frame_width = frame.shape[:2]

# Create a mask for the bottom part of the frame
# This will mask the bottom 30% of the frame - adjust the percentage as needed
mask_height = int(frame_height * 0.3)#here                                                    # 30% of the frame height
motion_mask = np.ones((frame_height, frame_width), dtype=np.uint8) * 255
motion_mask[frame_height - mask_height:frame_height, :] = 0  # Bottom part is masked (black)

    # Background subtractor setup
    bg_subtractor = cv2.createBackgroundSubtractorMOG2(
        history=500, 
        varThreshold=25, 
        detectShadows=False
    )
    MIN_MOTION_AREA = 500  # Minimum contour area to consider as motion
    COOLDOWN = 2.0  # Seconds between motion triggers
    last_motion_time = 0
    frame_count = 0
    capture_pending = False

    uri = "MONGODBURI"
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client["MONGODB"]
    collection = db["trashcans"]
    capture_counter = 0

    # Initialize serial
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
    ser.reset_input_buffer()

    try:
        while True:
            ret, frame = cam.read()
            if not ret:
                break

            # Process frame with background subtractor
            fg_mask = bg_subtractor.apply(frame)
            
            # Apply the motion mask to the foreground mask
            masked_fg = cv2.bitwise_and(fg_mask, fg_mask, mask=motion_mask)
            
            # Find contours in the masked foreground
            contours, _ = cv2.findContours(masked_fg, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Check for significant motion
            motion_detected = False
            for contour in contours:
                if cv2.contourArea(contour) > MIN_MOTION_AREA:
                    motion_detected = True
                    break
            
            # If motion is detected and we're not in cooldown or already pending capture
            if motion_detected:
                # Wait for 3 seconds
                time.sleep(3)
                
                # Capture the current frame
                ret, frame = cam.read()
                if not ret:
                    raise Exception()
                
                # Save the image
                filename = os.path.join(OUTPUT_FOLDER, f"motion_{frame_count:04d}.jpg")
                ret, jpeg_buffer = cv2.imencode('.jpg', frame)
                if ret:
                    with open(filename, 'wb') as f:
                        f.write(jpeg_buffer.tobytes())
                    print({filename})
                    
            

                    # Run prediction
                    image = PIL.Image.open(filename)
                    google_client = genai.Client(api_key="AIzaSyAZSuxKfrMEs0qPuzXNZCqDFl5-xijUWYM")
                    response = google_client.models.generate_content(
                        model="gemini-2.0-flash",
                        contents=["Use only ONE word to describe the object in this image (IGNORE THE BACKGROUND) that comes from these categories: [plastic, metal, glass, cloth, other].", image])
                    frame_count += 1
                    
                    # Check if predictions exist
                    response = response.text 
                    if response.lower() in ["plastic", "glass", "cloth", "metal", "other"]:
                            # Write to Arduino 
                            if response.lower() in ["plastic", "glass", "metal"]:
                                ser.write(b"1\n")
                            else:
                                ser.write(b"0\n")

                                # await response
                                lines = []
                                while len(lines) < 2:
                                    line = ser.readline().decode('utf-8').rstrip()
                                    if ":" in line:
                                        lines.append(line)
                                    
                                try:
                                    collection.update_one(
                                        {"_id": ObjectId("OBJECTID")},
                                        {
                                            "$push": {
                                                "lastObjects": className,
                                                "lastTime": datetime.now()
                                            },
                                            "$inc": {"capacity": 1}
                                        }
                                    )
                                    print(f"Database updated for capture {capture_counter}")
                                except Exception as e:
                                    print(f"Error updating document: {e}")
                    
                    capture_pending = False
                    capture_counter += 1


    
                
                # Start a thread for delayed capture
                capture_thread = threading.Thread(target=inline_capture)
                capture_thread.daemon = True
                capture_thread.start()
                

<<<<<<< HEAD

 
            
            # Start a thread for delayed capture
            capture_thread = threading.Thread(target=inline_capture)
            capture_thread.daemon = True
            capture_thread.start()
            
            rotateArduino(isRecyclable)
finally:
    cam.release()
=======
    finally:
        cam.release()
>>>>>>> 820359cb8cea9ce6fc31894fb8f1bae9ab1a56d3
