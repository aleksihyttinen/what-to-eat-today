const { MongoClient } = require("mongodb");
import * as dotenv from "dotenv";
dotenv.config();
var ObjectID = require("mongodb").ObjectID;
const url = process.env.DB_URL;
const client = new MongoClient(url);
const dbName = "foods";
interface IUser {
  email: string;
  password: string;
}
//Connection functions return a promise of a sql query
const connectionFunctions = {
  //Get all user from database
  getAllFoods: async () => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const result = await collection.find({}).toArray();
    return result;
  },
  editFoods: async (id: string, newName: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const updateResult = await collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: { name: newName } }
    );
    console.log("Updated documents =>", updateResult);
  },
  deleteFood: async (id: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const deleteResult = await collection.deleteOne({ _id: new ObjectID(id) });
    console.log(deleteResult);
    return deleteResult;
  },
  addFood: async (foodName: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("foods");
    const insertResult = await collection.insertOne({ name: foodName });
    console.log(insertResult);
    return insertResult;
  },
  users: async (userEmail: string): Promise<IUser[]> => {
    console.log(userEmail);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.find({ email: userEmail }).toArray();
    return result;
  },
  addUser: async (user: IUser) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.insertOne({
      email: user.email,
      password: user.password,
    });
    return result;
  },
};
export default connectionFunctions;
