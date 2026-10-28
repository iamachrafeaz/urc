import './App.css';
import {Outlet, redirect, useNavigate} from "react-router-dom";
import {Box} from "@chakra-ui/react";
import {useEffect} from "react";

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/messages");
    },[])
  return (
      <Box width={"100%"} height={"100vh"}>
        <Outlet/>
      </Box>
  );
}

export default App;
