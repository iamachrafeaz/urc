import './App.css';
import {Outlet, redirect} from "react-router-dom";
import {Box} from "@chakra-ui/react";

function App() {
    redirect("/messenger");
  return (
      <Box width={"100%"} height={"100vh"}>
        <Outlet/>
      </Box>
  );
}

export default App;
