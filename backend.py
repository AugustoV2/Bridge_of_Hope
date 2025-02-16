from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://augu:bzHOV28wdOKH4XdK@bridgeofhope.yswec.mongodb.net/BridgeOfHope"
app.config["SECRET_KEY"] = "AIzaSyBJDY0aaMmot7gJGb1iPEINDxlgG9tj0bk"


mongo = PyMongo(app)
bcrypt = Bcrypt(app)
CORS(app)

# Collection
donors = mongo.db.donors
organizations = mongo.db.organizations
donors_collection =mongo.db.donors_collection

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    if not ( email and password):
        return jsonify({"error": "All fields are required"}), 400
    


    if user_type != "donor":
        existing_user = organizations.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        organizations_id = organizations.insert_one({ "email": email, "password": hashed_password,"Details" : "No"}).inserted_id

        return jsonify({"message": "Registration successful", "organizations_id": str(organizations_id)}), 201




    if user_type == "donor":
        existing_user = donors.find_one({"email": email})
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
        donor_id = donors.insert_one({ "email": email, "password": hashed_password}).inserted_id

        return jsonify({"message": "Registration successful", "donor_id": str(donor_id)}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")



    if user_type == "donor":
        donor = donors.find_one({"email": email})
        if not donor or not bcrypt.check_password_hash(donor["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401

        session["donor_id"] = str(donor["_id"])

        if donor["Details"] == "Yes":
            return jsonify({"message": "Login successful", "donor_id": session["donor_id"], "Details": "Yes"}), 200
        return jsonify({"message": "Login successful", "donor_id": session["donor_id"]}), 200
    

    if user_type != "donor":
        organization = organizations.find_one({"email": email})
        if not organization or not bcrypt.check_password_hash(organization["password"], password):
            return jsonify({"error": "Invalid email or password"}), 401
        

        session["organizations_id"] = str(donor["_id"])
        return jsonify({"message": "Login successful", "organizations_id": session["organizations_id"]}), 200

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("donor_id", None)
    return jsonify({"message": "Logged out successfully"}), 200





@app.route("/donor", methods=["POST"])
def get_donor():
  
  try:
    data = request.json
    full_name = data.get("full_name")
    email = data.get("email")
    phone_number = data.get("phone_number")
    address = data.get("address")
    donation_preferences = data.get("donation_preferences")
    donor_id = data.get("donor_id")

   


    required_fields = ["full_name", "phone_number", "address", "donation_preferences"]
    for field in required_fields:
                if field not in data or not data[field]:
                    return jsonify({"error": f"Missing field: {field}"}), 400
                

    existing_donor = donors_collection.find_one({"donor_id": data["donor_id"]})
    if existing_donor:
        return jsonify({"error": "Donor profile already exists"}), 400

    donors_id = donors_collection.insert_one({
                "full_name": data["full_name"],
                "phone_number": data["phone_number"],
                "address": data["address"],
                "donation_preferences": data["donation_preferences"],
                "donor_id": data["donor_id"] 
            }).inserted_id
    
    donor_i=donors.update_one({"_id": ObjectId(donor_id)}, {"$set": {"Details": "Yes"}})

    return jsonify({"message": "Profile created successfully!", "donor_id": str(donor_id)}), 201

  except Exception as e:
    return jsonify({"error": str(e)}), 500


    


@app.route('/donordetails', methods=['GET'])
def get_donor_data():
    try:
        data = request.args.get("donor_id")
        donor = donors_collection.find_one({"donor_id": data})  

        if not donor:
            return jsonify({"error": "Donor not found"}), 404

        donor_data = {
            "full_name": donor["full_name"],
            "totalDonations": donor["total_donations"] if "total_donations" in donor else 0,
            "itemsDonated": donor["items_donated"] if "items_donated" in donor else 0,
            "lastDonation": donor["last_donation"] if "last_donation" in donor else None,
            "impactScore": donor["impact_score"] if "impact_score" in donor else 0,
            "recentDonations": donor["recent_donations"] if "recent_donations" in donor else []
        }

        return jsonify(donor_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True)
