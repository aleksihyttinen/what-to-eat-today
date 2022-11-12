import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import Button from "@mui/material/Button";
import EditFoods from "./EditFoods";
import AddFood from "./AddFood";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
interface IFood {
  _id: string;
  user_id: string;
  name: string;
}
function App() {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [randomNumber, setRandomNumber] = useState<number>(0);
  const [btnClicked, setBtnClicked] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [newModalOpen, setNewModalOpen] = useState<boolean>(false);

  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("user")}`;
    }
    axios
      .get("http://localhost:8080/foods")
      .then((response) => {
        setFoods(response.data);
        console.log(response);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          alert("Kirjaudu sisään uudelleen");
          auth?.signout();
          navigate("/login", { replace: true });
        }
        console.log(err);
      });
  }, []);
  let onClick = () => {
    setBtnClicked(!btnClicked);
    console.log(randomNumber);
    setRandomNumber(Math.floor(Math.random() * foods.length));
  };

  return (
    <div className="App">
      <Button
        sx={{ position: "absolute", top: "1rem", right: "1rem" }}
        variant="text"
        size="large"
        onClick={() => {
          auth?.signout();
          navigate("/login", { replace: true });
        }}
      >
        Kirjaudu ulos
      </Button>
      {
        <h1
          className="word"
          style={
            btnClicked ? { visibility: "visible" } : { visibility: "hidden" }
          }
        >
          {btnClicked ? foods[randomNumber].name : "Ladataan"}
        </h1>
      }
      <div className="buttons">
        <Button variant="contained" size="large" onClick={onClick}>
          {!btnClicked ? "Mitä söisin tänään?" : "Aloita alusta"}
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => setNewModalOpen(true)}
        >
          {"Lisää uusi ruoka"}
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => setEditModalOpen(true)}
        >
          {"Muokkaa ruokia"}
        </Button>
      </div>
      {editModalOpen ? (
        <EditFoods
          modalOpen={editModalOpen}
          setModalOpen={setEditModalOpen}
          foods={foods}
          setFoods={setFoods}
        />
      ) : (
        <></>
      )}
      {newModalOpen ? (
        <AddFood
          modalOpen={newModalOpen}
          setModalOpen={setNewModalOpen}
          setFoods={setFoods}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
