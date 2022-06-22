#!/usr/bin/python3

import os 
import json 
import flask
import pymongo 

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

app = Flask(__name__)
jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = "a43e86ed80f619feca1871a628d9fb73"
client = pymongo.MongoClient("mongodb+srv://dzemal:Klizimpomahali012@cluster0.ypugn.mongodb.net/?retryWrites=true&w=majority")
db = client["Access"]

@app.route('/api/login', methods=['POST'])
def login():
    collection = db["users"]
    
    if request.is_json:

        username = request.json["username"]
        password = request.json["password"]
        
    else: 
        username = request.form["username"]
        password = request.form["password"]

    check = collection.find_one({"username": username, "password": password})

    if check: 
        return jsonify(message="Login successful!"), 201
    else:
        return jsonify(message="Incorrect login credentials!"), 401

if __name__ == "__main__":
    app.debug = True
    app.run()
