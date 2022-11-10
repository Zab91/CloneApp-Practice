import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { RegisterPage } from "./Pages/RegisterPage";
import { VerificationPage } from "./Pages/VerificationPage";
import NavbarComp from "./components/NavbarComp";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LoginPage } from "./Pages/LoginPage";
import { login } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  // console.log(token);

  const keepLogin = async () => {
    try {
      const res = await axios.get(`http://localhost:1000/users/keeplogin`, {
        hearders: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data)
      dispatch(login(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    keepLogin();
  }, []);

  return (
    <div>
      <NavbarComp />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:token" element={<VerificationPage />} />
      </Routes>
    </div>
  );
}

export default App;
