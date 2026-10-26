import React from "react";
import {Box, Text} from "@chakra-ui/react";

const MessageBubble = ({
                           message,
                           isUser,
                       }: {
    message: string;
    isUser: boolean;
}) => {
    return (
        <Box
            rounded="md"
            bg={isUser ? "blue.500" : "gray.200"}
            color={isUser ? "white" : "black"}
            px="10px"
            py="5px"
            alignSelf={isUser ? "flex-end" : "flex-start"}
            w="fit-content"
            maxW="75%"
        >
            <Text>{message}</Text>
        </Box>
    );
};

export default MessageBubble;