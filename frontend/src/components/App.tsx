import { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import Button from "@mui/material/Button";
import EditFoods from "./EditFoods";
import AddFood from "./AddFood";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { RandomReveal } from "react-random-reveal";
import AppBar from "./AppBar";
import { List, ListItem, ListItemText } from "@mui/material";
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
  const [requestDone, setRequestDone] = useState<boolean>(false);

  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${localStorage.getItem("user")}`;
    }
    axios
      .get("https://what-to-eat-today.azurewebsites.net/foods")
      .then((response) => {
        setFoods(response.data);
        console.log(response);
        setRequestDone(true);
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
      <AppBar
        setNewModalOpen={setNewModalOpen}
        setEditModalOpen={setEditModalOpen}
      />
      <div className="Container">
        {foods.length != 0 ? (
          <div style={{ fontSize: "3rem" }}>
            {btnClicked ? (
              <RandomReveal
                isPlaying
                duration={3}
                characters={foods[randomNumber].name}
              />
            ) : (
              "Mitä söisin tänään?"
            )}
          </div>
        ) : (
          <div style={{ fontSize: "3rem" }}>
            {requestDone
              ? "Lisää ruokia, jotta voit käyttää sovellusta"
              : "Ladataan"}
          </div>
        )}

        <Button
          disabled={!requestDone}
          variant="contained"
          size="large"
          onClick={onClick}
          sx={{ mt: "5rem", width: "160px" }}
        >
          {!btnClicked ? "Arvo ruoka" : "Aloita alusta"}
        </Button>

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
    </div>
  );
}

export default App;
