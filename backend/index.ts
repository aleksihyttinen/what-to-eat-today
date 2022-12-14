import express, { response } from "express";
import connection from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import IFood from "../frontend/src/interfaces/IFood";
import IUser from "../frontend/src/interfaces/IUser";
require("dotenv").config();
const app = express();
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.static(path.join(__dirname + "/../frontend/build/")));
app.use(express.json());

//Get all
app.get(
  "/foods",
  authenticateToken,
  (req: express.Request, res: express.Response) => {
    let userId: string = req.body.user._id;
    connection
      .getAllFoods(userId)
      .then((data) => res.send(data))
      .catch((err) => {
        console.log(err);
        res.statusCode = 400;
        res.end();
      });
  }
);
app.put(
  "/foods",
  authenticateToken,
  async (req: express.Request, res: express.Response) => {
    let foods: IFood[] = req.body;
    try {
      foods.map((food) => connection.editFood(food._id, food.name));
      res.statusCode = 200;
      res.send({
        foods,
      });
      res.end();
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    }
  }
);
app.delete(
  "/foods/:id",
  authenticateToken,
  async (req: express.Request, res: express.Response) => {
    let id = req.params.id;
    try {
      let result = await connection.deleteFood(id);
      res.statusCode = 200;
      res.send(result);
      res.end();
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    }
  }
);
app.post(
  "/foods",
  authenticateToken,
  async (req: express.Request, res: express.Response) => {
    let foodName: string = req.body.name;
    let userId: string = req.body.user._id;
    try {
      let result = await connection.addFood(foodName, userId);
      res.statusCode = 201;
      res.send({
        _id: result.insertedId,
        user_id: userId,
        name: foodName,
      });
      res.end();
    } catch (err) {
      console.log(err);
      res.statusCode = 404;
      res.end();
    }
  }
);
//register
app.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { userName: req.body.name, userPassword: hashedPassword };
    let result = await connection.addUser(user);
    res.statusCode = 201;
    res.send({
      result,
    });
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});
//login
app.post("/login", async (req: express.Request, res: express.Response) => {
  const user: IUser = await connection.findUser(req.body.name);
  const accessToken = generateAccessToken(user);
  if (user == null) {
    res.status(500);
  }
  try {
    if (await bcrypt.compare(req.body.password, user.userPassword)) {
      res.send({
        accessToken: accessToken,
        msg: "Authenticated",
      });
    } else {
      res.send("Not allowed");
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

function authenticateToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.body.user = user;
    next();
  });
}
//10-30min
function generateAccessToken(user: IUser) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname + "/../frontend/build/index.html"));
});

const port: string | number = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
