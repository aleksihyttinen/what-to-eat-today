import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface IProps {
  modalOpen: boolean;
  setModalOpen: Function;
  setFoods: Function;
}
interface IFood {
  _id: string;
  user_id: string;
  name: string;
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
      .post(`http://localhost:8080/foods`, {
        name: newFood,
      })
      .then((response) => {
        console.log(newFood);
        console.log(response);
        setModalOpen(false);
        if (response.status == 201) {
          setFoods((oldFoods: IFood[]) => [...oldFoods, response.data]);
        }
      })
      .catch((err) => {
        if (err.response.status == 403) {
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
