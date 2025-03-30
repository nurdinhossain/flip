from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://johnsmith1january2000:a3mlYLp6QoCGcb2a@cluster0.4tz7xfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["trashDatabase"]

collection = db["trashcans"]
try:
    result = collection.insert_one({
        "lastObjects": [],
        "capacity": 100,
        "lastTime": []
    })
    print(f"Inserted document with id: {result.inserted_id}")
except Exception as e:
    print("Insert failed:", e)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Enable CORS
app = Flask(__name__)


# Enable CORS
CORS(app)

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    users = []
    collection = db["users"]
    for user in collection.find():
        users.append({
            "_id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        })
    return jsonify(users)


@app.route('/trashcans', methods=['GET'])
def get_trashcans():
    trashcans = []
    collection = db["trashcans"]
    for trashcan in collection.find():
        trashcans.append({
            "_id": str(trashcan["_id"]),
            "lastObject": trashcan["lastObjects"],
            "lastTime": trashcan["lastTime"],
            "capacity": trashcan["capacity"]
        })
    return jsonify(trashcans)





if __name__ == '__main__':
    app.run(debug=True)