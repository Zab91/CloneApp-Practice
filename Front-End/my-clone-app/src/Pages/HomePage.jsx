import { Heading } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

export const HomePage = () => {
  const token = localStorage.getItem("token");
  return (
    <>
      {/* {!token && <Navigate to="/login" replace={true} />} */}
      <Heading>Home Page</Heading>
    </>
  );
};
