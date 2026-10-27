import React from "react";
import {Flex} from "@chakra-ui/react";
import MessageList from "./MessageList.tsx";
import MessageInput from "./MessageInput.tsx";

function Conversation() {

    return <Flex
        flex={"1"}
        bgColor={"gray.50"}
        rounded={"md"}
        px={"10px"}
        py={"15px"}
        gap={3}
        direction={"column"}
    >
        <MessageList/>
        <MessageInput/>
    </Flex>
}

export default Conversation;