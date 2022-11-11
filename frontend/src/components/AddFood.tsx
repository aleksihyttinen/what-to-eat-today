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

interface IProps {
  modalOpen: boolean;
  setModalOpen: Function;
}

export default function AddFood({ modalOpen, setModalOpen }: IProps) {
  const [newFood, setNewFood] = useState("");
  const handleClose = () => {
    setModalOpen(false);
  };

  const handleUpdate = () => {
    axios
      .post(`http://localhost:8080/foods`, { name: newFood })
      .then((response) => {
        console.log(newFood);
        console.log(response);
        setModalOpen(false);
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
