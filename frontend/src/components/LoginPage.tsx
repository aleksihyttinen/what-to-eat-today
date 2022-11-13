import { Box, Button, Link, TextField, Typography } from "@mui/material";
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
  }, [auth?.authenticated, navigate]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (loginType) {
      auth?.signup({
        userName: e.target.username.value,
        userPassword: e.target.password.value,
      });
    } else {
      auth?.signin({
        userName: e.target.username.value,
        userPassword: e.target.password.value,
      });
    }
  };
  return (
    <div className="Login">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {!loginType ? "Kirjaudu sisään" : "Rekisteröidy"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 1, maxWidth: "500px" }}
        method="POST"
      >
        <Typography variant="subtitle1" sx={{ color: "grey", mb: 3 }}>
          Kirjaudu sisään, jotta voit luoda oman ruokalistasi.
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Käyttäjänimi"
          name="username"
          autoComplete="username"
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
