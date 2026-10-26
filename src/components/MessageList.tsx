import React, {useEffect, useRef} from "react";
import {Flex, Icon, Spinner, Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import { MessagesCircle } from "lucide-react";
import {getConversation} from "../apis/conversationApi.ts";
import {useSessionStore} from "../stores/session.ts";
import type {Message} from "../model/common.ts";
import MessageBubble from "./MessageBubble.tsx";
import {useConversationStore} from "../stores/conversation.ts";

function MessageList(){
    const params = useParams();
    const userId = params.userId;

    const session = useSessionStore(state => state.session);

    const setMessages = useConversationStore(state=> state.setMessages);
    const messages = useConversationStore(state=> state.messages);
    const isLoadingMessages = useConversationStore(state=> state.isLoading);
    const setIsLoadingMessages = useConversationStore(state=> state.setLoading);

    useEffect(() => {
        if (!userId || !session) {
            setMessages([]);
            setIsLoadingMessages(false);
            return;
        }

        setIsLoadingMessages(true);

        getConversation(
            Number(userId),
            session,
            (messages: Message[]) => {
                setMessages(messages);
                setIsLoadingMessages(false);
            },
            (error) => {
                console.error(error);
                setIsLoadingMessages(false);
            }
        );
    }, [userId, session]);

    if(!userId) {
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
            <Icon
                as={MessagesCircle}
                boxSize="100px"
                color="yellow.300"
                strokeWidth={1}
            />
            <Text fontSize={"sm"}>Choisissez une conversation!</Text>
        </Flex>
    }

    if(isLoadingMessages){
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
            <Spinner/>
        </Flex>
    }

    return <Flex
        flex={"1"}
        gap={4}
        direction={"column"}
        overflow={"scroll"}
    >
        {messages.map((message: Message) =>
            <MessageBubble message={message.content} isUser={message.senderId == session!.id}/>)
        }
    </Flex>
}



export default MessageList;