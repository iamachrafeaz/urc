import React from "react";
import {Flex, Button, Spacer, Heading, Image} from "@chakra-ui/react";
import {useSessionStore} from "../../stores/session.ts";
import { useNavigate } from "react-router-dom";

function NavBar(){
    const navigate = useNavigate();
    const logout = useSessionStore(state => state.logout);

    const handleLogout = () => {
        logout();
        navigate("/login")
    }

    return <Flex width={"100%"} bg={"yellow.solid"} alignItems={"center"} py={"10px"} px={"20px"}>
            <Flex align="center" gap={3} direction="row">
                <Image src="/ubo.svg" alt="UBO logo"  />
                <Heading fontSize="lg" whiteSpace="nowrap">Relay Chat</Heading>
            </Flex>
        <Spacer/>
        <Button onClick={handleLogout}>Se déconnecter</Button>
    </Flex>
}

export default NavBar;