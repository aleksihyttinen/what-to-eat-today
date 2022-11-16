import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import IFood from "../interfaces/IFood";

interface IProps {
  modalOpen: boolean;
  setModalOpen: Function;
  setFoods: Function;
}

export default function AddFood({ modalOpen, setModalOpen, setFoods }: IProps) {
  const [newFood, setNewFood] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleUpdate = () => {
    axios
      .post(`https://what-to-eat-today.azurewebsites.net/foods`, {
        name: newFood,
      })
      .then((response) => {
        console.log(response);
        setModalOpen(false);
        if (response.status === 201) {
          setFoods((oldFoods: IFood[]) => [...oldFoods, response.data]);
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          alert("Kirjaudu sisään uudelleen");
          auth?.signout();
          navigate("/login", { replace: true });
        }
        console.log(err);
      });
  };
  const handleChange = (e: any) => {
    setNewFood(e.target.value);
  };
  return (
    <div>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Lisää uusi ruoka</DialogTitle>
        <DialogContent>
          <TextField
            label="Ruuan nimi"
            value={newFood}
            onChange={handleChange}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Sulje</Button>
          <Button onClick={handleUpdate}>Lisää ruoka</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
