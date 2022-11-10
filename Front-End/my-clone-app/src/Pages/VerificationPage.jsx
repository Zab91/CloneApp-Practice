import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const url = "http://localhost:1000/users/verify";

export const VerificationPage = () => {
  const [msg, setMsg] = useState("Loading...");
  const params = useParams();

  const verifyToken = async () => {
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${params.token}`,
        },
      });
      setMsg(res.data);
    } catch (err) {
      setMsg("Verification Failed");
    }
  };

  useEffect(() => {
    verifyToken();
  });

  return (
    <div>
      <Heading>Verification Page</Heading>
      <Heading>{msg}</Heading>
    </div>
  );
};
