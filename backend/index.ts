import express from "express";
import connection from "./db";
import bcrypt from "bcrypt";
const app = express();
const path = require("path");
const cors = require("cors");
interface IFood {
  _id: string;
  name: string;
}
interface IUser {
  email: string;
  password: string;
}
app.use(cors());
app.use(express.static(path.join(__dirname + "/../frontend/build/")));
app.use(express.json());

//Get all
app.get("/foods", (req: express.Request, res: express.Response) => {
  connection
    .getAllFoods()
    .then((data) => res.send(data))
    .catch((err) => {
      console.log(err);
      res.statusCode = 400;
      res.end();
    });
});
app.put("/foods", async (req: express.Request, res: express.Response) => {
  let foods: IFood[] = req.body;
  console.log(foods);
  try {
    foods.map((food) => connection.editFoods(food._id, food.name));
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
});
app.delete(
  "/foods/:id",
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
app.post("/foods", async (req: express.Request, res: express.Response) => {
  let foodName: string = req.body.name;
  console.log(req.body);
  try {
    let result = await connection.addFood(foodName);
    res.statusCode = 201;
    res.send({
      result,
    });
    res.end();
  } catch (err) {
    console.log(err);
    res.statusCode = 404;
    res.end();
  }
});
//register
app.post("/register", async (req: express.Request, res: express.Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { email: req.body.email, password: hashedPassword };
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
  const user: IUser[] = await connection.users(req.body.email);
  if (user == null) {
    res.status(500);
  }
  try {
    if (await bcrypt.compare(req.body.password, user[0].password)) {
      res.send("Authenticated");
    } else {
      res.send("Not allowed");
    }
  } catch (err) {
    res.status(500);
    res.send(err);
  }
});

app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname + "/../frontend/build/index.html"));
});

const port: string | number = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
