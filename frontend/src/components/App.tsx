import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import Button from "@mui/material/Button";
import EditFoods from "./EditFoods";
import AddFood from "./AddFood";
interface IFood {
  _id: string;
  name: string;
}
function App() {
  let [foods, setFoods] = useState<IFood[]>([]);
  let [randomNumber, setRandomNumber] = useState<number>(0);
  let [btnClicked, setBtnClicked] = useState<boolean>(false);
  let [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  let [newModalOpen, setNewModalOpen] = useState<boolean>(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080/foods")
      .then((response) => {
        setFoods(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
  let onClick = () => {
    setBtnClicked(!btnClicked);
    console.log(randomNumber);
    setRandomNumber(Math.floor(Math.random() * foods.length));
  };

  return (
    <div className="App">
      <div className="container">
        <Button variant="contained" size="large" onClick={onClick}>
          {!btnClicked ? "Mitä söisin tänään?" : "Aloita alusta"}
        </Button>
        {
          <div
            style={
              btnClicked ? { visibility: "visible" } : { visibility: "hidden" }
            }
            className="food"
          >
            {btnClicked ? foods[randomNumber].name : "Ladataan"}
          </div>
        }
        <Button
          variant="contained"
          size="large"
          onClick={() => setNewModalOpen(true)}
        >
          {"Lisää uusi ruoka"}
        </Button>
        <Button
          variant="contained"
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
        />
      ) : (
        <></>
      )}
      {newModalOpen ? (
        <AddFood modalOpen={newModalOpen} setModalOpen={setNewModalOpen} />
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
