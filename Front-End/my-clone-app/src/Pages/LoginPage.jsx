import {
  Alert,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/userSlice";
import { Navigate } from "react-router-dom";
import { RegisterPage } from "../Pages/RegisterPage";
const url = "http://localhost:1000/users/login";

export const LoginPage = () => {
  const usernameEmailPhone = useRef("");
  const password = useRef("");
  const dispatch = useDispatch();
  const [move, setMove] = useState(false);
  // console.log(move)

  const onLogin = async () => {
    // console.log(usernameEmailPhone.current.value)
    // console.log(password.current.value)

    try {
      const user = {
        password: password.current.value,
        data: usernameEmailPhone.current.value,
      };
      // console.log(user)
      const result = await axios.post(url, user);
      // console.log(result.data)

      dispatch(login(result.data.user));
      localStorage.setItem("token", result.data.token);
      setMove(true);
    } catch (err) {
      console.log(err);
    }
  };

  return move ? (
    <Navigate to="/" replace={true} />
  ) : (
    <>
      <Container bg="#ADD8E6" w="250px" h="250px" mt={20}>
        <Heading mb={10}>Login</Heading>
        <FormLabel>Username/Email/Phone Number</FormLabel>
        <Input ref={usernameEmailPhone} />
        <FormLabel>Password</FormLabel>
        <Input ref={password} />
        <Button mt={10} w="100%" onClick={onLogin}>
          Login
        </Button>
        <Button mt={10} w="100%" onClick={RegisterPage}>
          Register
        </Button>
      </Container>
    </>
  );
};
