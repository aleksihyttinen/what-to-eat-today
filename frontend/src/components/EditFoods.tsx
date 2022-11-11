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
  foods: IFood[];
}

interface IFood {
  _id: string;
  name: string;
}

export default function EditFoods({ modalOpen, setModalOpen, foods }: IProps) {
  const [editedFoods, setEditedFoods] = useState<IFood[]>(
    JSON.parse(JSON.stringify(foods))
  );
  const handleClose = () => {
    setEditedFoods(foods);
    setModalOpen(false);
  };
  const handleChange = (index: number) => (e: any) => {
    let tempArr = [...editedFoods];
    tempArr[index].name = e.target.value;
    setEditedFoods(tempArr);
  };
  const handleUpdate = () => {
    axios.put(`http://localhost:8080/foods`, editedFoods).then((response) => {
      console.log(response);
      setModalOpen(false);
    });
  };
  const deleteFood = (id: any) => () => {
    console.log(id);
    axios.delete(`http://localhost:8080/foods/${id}`).then((response) => {
      console.log(response);
      setModalOpen(false);
    });
  };
  return (
    <div>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Muokkaa ruokia</DialogTitle>
        <DialogContent>
          {editedFoods.map((food, index) => (
            <span key={food._id}>
              <TextField
                value={food.name}
                onChange={handleChange(index)}
              ></TextField>
              <IconButton aria-label="delete" onClick={deleteFood(food._id)}>
                <DeleteIcon />
              </IconButton>
            </span>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Sulje</Button>
          <Button onClick={handleUpdate}>Päivitä</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
