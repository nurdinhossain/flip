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

if __name__ == "__main__":
    # Initialize Roboflow model
    rf = roboflow.Roboflow("ROBOFLOWAPIKEY")
    project = rf.workspace().project("ROBOFLOWWORKSPACE")
    model = project.version("3").model
    model.confidence = 50
    model.overlap = 25

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

            current_time = time.time()
            
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
            if motion_detected and (current_time - last_motion_time >= COOLDOWN) and not capture_pending:
                last_motion_time = current_time
                capture_pending = True
                
                # Inline implementation of capture_after_delay function
                def inline_capture():
                    global capture_pending, frame_count, capture_counter
                    
                    # Wait for 3 seconds
                    time.sleep(3)
                    
                    # Capture the current frame
                    ret, frame = cam.read()
                    if not ret:
                        capture_pending = False
                        return
                    
                    # Save the image
                    filename = os.path.join(OUTPUT_FOLDER, f"motion_{frame_count:04d}.jpg")
                    ret, jpeg_buffer = cv2.imencode('.jpg', frame)
                    if ret:
                        with open(filename, 'wb') as f:
                            f.write(jpeg_buffer.tobytes())
                        print({filename})
                        
                        # Run prediction
                        prediction = model.predict(filename)
                        result = prediction.json()
                            
                        frame_count += 1
                        last_capture_time = current_time
                        predictionInfo = result.get("predictions")
                        
                        # Check if predictions exist
                        if predictionInfo and len(predictionInfo) > 0 and capture_counter > 0:
                            predictionInfo = predictionInfo[0].get("predictions")
                            
                            if predictionInfo and len(predictionInfo) > 0:
                                className = predictionInfo[0].get("class")
                                classId = predictionInfo[0].get("class_id")
                                confidence = predictionInfo[0].get("confidence")
                                recycleClasses = ["cardboard", "glass", "paper", "plastic"]

                                # Write to Arduino 
                                if className in recycleClasses:
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
