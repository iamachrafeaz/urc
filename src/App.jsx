import './App.css';
import {Outlet} from "react-router-dom";
import {Box} from "@chakra-ui/react";

function App() {

  return (
      <Box width={"100%"} height={"100vh"}>
        <Outlet/>
      </Box>
  );
}

export default App;
