import IUser from "../frontend/src/interfaces/IUser";
const { MongoClient } = require("mongodb");
require("dotenv").config();
var ObjectID = require("mongodb").ObjectID;
const url = process.env.DB_URL;
const client = new MongoClient(url);

const connectionFunctions = {
  getAllFoods: async (userId: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("foods");
    const collection = db.collection("foods");
    const result = await collection.find({ user_id: userId }).toArray();
    return result;
  },
  editFood: async (id: string, newName: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("foods");
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
    const db = client.db("foods");
    const collection = db.collection("foods");
    const deleteResult = await collection.deleteOne({ _id: new ObjectID(id) });
    console.log(deleteResult);
    return deleteResult;
  },
  addFood: async (foodName: string, userId: string) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("foods");
    const collection = db.collection("foods");
    const insertResult = await collection.insertOne({
      user_id: userId,
      name: foodName,
    });
    console.log(insertResult);
    return insertResult;
  },
  findUser: async (userName: string): Promise<IUser> => {
    console.log(userName);
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.find({ name: userName }).toArray();
    return result[0];
  },
  addUser: async (user: IUser) => {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("users");
    const collection = db.collection("users");
    const result = await collection.insertOne({
      name: user.userName,
      password: user.userPassword,
    });
    return result;
  },
};
export default connectionFunctions;
