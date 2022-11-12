import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { useAuth } from "../hooks/useAuth";
export default function LoginPage() {
  const navigate = useNavigate();
  //true = register, false = login
  const [loginType, setLoginType] = useState(false);
  const auth = useAuth();
  useEffect(() => {
    if (auth?.authenticated) {
      navigate("/", { replace: true });
    }
  }, [auth?.authenticated]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (loginType) {
      auth?.signup({
        userEmail: e.target.email.value,
        userPassword: e.target.password.value,
      });
    } else {
      auth?.signin({
        userEmail: e.target.email.value,
        userPassword: e.target.password.value,
      });
    }
  };
  return (
    <div className="App">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {!loginType ? "Kirjaudu sisään" : "Rekisteröidy"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, width: "25%" }}
        method="POST"
      >
        <Typography variant="subtitle1" sx={{ color: "grey", mb: 3 }}>
          Sisäänkirjautuneena, voit luoda oman ruokalistasi, muuten käytössäsi
          on vain ennalta määritellyt ruuat.
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Sähköposti"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Salasana"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {!loginType ? "Kirjaudu sisään" : "Rekisteröidy"}
        </Button>
        <Typography sx={{ color: "red" }}>
          {auth?.authFailed ? "Kirjautuminen epäonnistui" : ""}
        </Typography>
        <Link onClick={() => setLoginType(!loginType)} variant="body2">
          {loginType ? "Kirjaudu sisään" : "Rekisteröidy"}
        </Link>
      </Box>
    </div>
  );
}
