import React from "react";
import {Flex, Icon, Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import { MessagesCircle } from "lucide-react";

function MessageList(){
    let params = useParams();
    let userId = params.userId;

    return <Flex
        bgColor={"gray.50"}
        flex={"1"}
        rounded={"md"}
        px={"10px"}
        py={"15px"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"column"}
        gap={4}
    >
        {!userId && <>
            <Icon
                as={MessagesCircle}
                boxSize="100px"
                color="yellow.300"
                strokeWidth={1}
            />
            <Text fontSize={"sm"}>Choisissez une conversation!</Text>
        </>}

        {userId && <>
            <Text>{userId}</Text>
        </>}
    </Flex>
}

export default MessageList;