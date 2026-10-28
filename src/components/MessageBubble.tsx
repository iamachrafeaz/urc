import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { Message } from "../model/common.ts";

type MessageBubbleProps = {
    message: Message;
    isUser: boolean;
};

const MessageBubble = ({ message, isUser }: MessageBubbleProps) => {
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
            <VStack>
                {message.senderUsername && (
                    <Text fontSize="sm" fontStyle="italic">
                        @{message.senderUsername}
                    </Text>
                )}
                <Text>{message.content}</Text>
            </VStack>
        </Box>
    );
};

export default MessageBubble;