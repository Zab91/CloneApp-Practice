import {
  Button,
  Container,
  FormLabel,
  Alert,
  AlertIcon,
  Input,
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { Formik, ErrorMessage, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
const url = "http://localhost:1000/users/register";

export const RegisterPage = () => {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword;
  const registerSchema = Yup.object().shape({
    password: Yup.string().required().min(8, "password minimal 8 karakter"),
  });

  const onRegister = async (data) => {
    try {
      // console.log(data)
      const result = await axios.post(url, data);
      console.log(result);
    } catch (err) {
      console.log(err);
      Alert("Register Error mohon coba lagi");
    }
  };

  const AlertComp = () => {
    return (
      <Alert show="false" status="success">
        <AlertIcon />
        Register Berhasil!
      </Alert>
    );
  };

  return (
    <Container>
      <Flex
        flexDirection="column"
        width="100w"
        height="100vh"
        backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Heading color="blue">Sign up here!</Heading>
          <Box minw={{ base: "90%", md: "500px" }}>
            <Formik
              initialValues={{
                username: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={registerSchema}
              onSubmit={(values, action) => {
                onRegister(values);
                action.setFieldValue("username", "");
                action.setFieldValue("email", "");
                action.setFieldValue("phoneNumber", "");
                action.setFieldValue("password", "");
                action.setFieldValue("confirmPassword", "");
              }}
            >
              {(props) => {
                console.log(props);
                return (
                  <>
                    {show ? <AlertComp /> : null}
                    <Form>
                      <FormLabel>Username</FormLabel>
                      <Input
                        as={Field}
                        name="username"
                        placeholder="Username"
                      />
                      <FormLabel>Email</FormLabel>
                      <Input as={Field} name="email" placeholder="Email" />
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        as={Field}
                        name="phoneNumber"
                        placeholder="Phone Number"
                      />
                      <FormLabel>Password</FormLabel>
                      <Input
                        as={Field}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="Container"
                        style={{ color: "red" }}
                      />
                      <FormLabel>Confirm Password</FormLabel>
                      <Input
                        as={Field}
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="Container"
                        style={{ color: "red" }}
                      />
                      <Button colorScheme="facebook" type="submit">
                        Register
                      </Button>
                    </Form>
                  </>
                );
              }}
            </Formik>
          </Box>
        </Stack>
      </Flex>
    </Container>
  );
};
