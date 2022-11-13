import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { ProvideAuth, useAuth } from "./hooks/useAuth";
function RequireAuth({ children }: any) {
  //Get current auth status from useAuth hook and route accordingly
  const auth = useAuth();
  //If authorized route to oroginal route, else route to login page
  return auth?.authenticated || localStorage.getItem("user") ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ProvideAuth>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <App />
            </RequireAuth>
          }
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </BrowserRouter>
  </ProvideAuth>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
