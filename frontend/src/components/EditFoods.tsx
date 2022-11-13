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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Typography } from "@mui/material";

interface IProps {
  modalOpen: boolean;
  setModalOpen: Function;
  foods: IFood[];
  setFoods: Function;
}

interface IFood {
  _id: string;
  user_id: string;
  name: string;
}

export default function EditFoods({
  modalOpen,
  setModalOpen,
  foods,
  setFoods,
}: IProps) {
  const [editedFoods, setEditedFoods] = useState<IFood[]>(
    JSON.parse(JSON.stringify(foods))
  );
  const auth = useAuth();
  const navigate = useNavigate();
  const handleClose = () => {
    setEditedFoods(foods);
    setModalOpen(false);
  };
  const handleChange = (index: number) => (e: any) => {
    console.log(e.target.value);
    let tempArr = [...editedFoods];
    tempArr[index].name = e.target.value;
    setEditedFoods(tempArr);
  };
  const handleUpdate = () => {
    let newArr: IFood[] = [];
    foods.forEach((food, index) => {
      if (food.name !== editedFoods[index].name) {
        newArr.push(editedFoods[index]);
      }
    });

    axios
      .put(`https://what-to-eat-today.azurewebsites.net/foods`, newArr)
      .then((response) => {
        console.log(response);
        setModalOpen(false);
        if (response.status == 200) {
          setFoods(editedFoods);
        }
      });
  };
  const deleteFood = (id: any) => () => {
    console.log(id);
    axios
      .delete(`https://what-to-eat-today.azurewebsites.net/foods/${id}`)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          setEditedFoods(editedFoods.filter((food) => food._id != id));
          setFoods(foods.filter((food) => food._id != id));
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
  return (
    <div>
      <Dialog open={modalOpen} onClose={handleClose}>
        <DialogTitle>Muokkaa ruokia</DialogTitle>
        <DialogContent>
          {editedFoods.length != 0 ? (
            editedFoods.map((food, index) => (
              <span key={food._id}>
                <TextField
                  value={food.name}
                  onChange={handleChange(index)}
                ></TextField>
                <IconButton aria-label="delete" onClick={deleteFood(food._id)}>
                  <DeleteIcon />
                </IconButton>
              </span>
            ))
          ) : (
            <Typography>Ruokia ei löytynyt</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Sulje</Button>
          <Button onClick={handleUpdate}>Päivitä</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
