import React, { useEffect, useRef } from "react";
import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { MessagesCircle } from "lucide-react";

import { getConversation } from "../apis/conversationApi.ts";

import { useSessionStore } from "../stores/session.ts";
import { useConversationStore } from "../stores/conversation.ts";

import type { Message } from "../model/common.ts";
import MessageBubble from "./MessageBubble.tsx";
import {getRoomConversation} from "../apis/roomConversationApi.ts";

function MessageList() {
    const { userId, roomId } = useParams();

    const session = useSessionStore(state => state.session);

    const messages = useConversationStore(state => state.messages);
    const setMessages = useConversationStore(state => state.setMessages);
    const isLoadingMessages = useConversationStore(state => state.isLoading);
    const setIsLoadingMessages = useConversationStore(
        state => state.setLoading
    );

    const bottomRef = useRef<HTMLDivElement>(null);

    const isRoomConversation = Boolean(roomId);
    const conversationId = roomId ?? userId;

    const refreshMessages = () => {
        if (!conversationId || !session) return;

        const onSuccess = (fetchedMessages: Message[]) => {
            setMessages(fetchedMessages);
            setIsLoadingMessages(false);
        };

        const onError = (error: unknown) => {
            console.error("Failed to fetch messages:", error);
            setIsLoadingMessages(false);
        };

        if (isRoomConversation) {
            getRoomConversation(
                Number(roomId),
                session,
                onSuccess,
                onError
            );
        } else {
            getConversation(
                Number(userId),
                session,
                onSuccess,
                onError
            );
        }
    };

    useEffect(() => {
        if (!conversationId || !session) {
            setMessages([]);
            setIsLoadingMessages(false);
            return;
        }

        setMessages([]);
        setIsLoadingMessages(true);

        refreshMessages();

    }, [conversationId, session]);

    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (data?.type !== "NEW_MESSAGE") return;

            if (isRoomConversation) {
                if (Number(data.roomId) !== Number(roomId)) return;
            } else {
                if (Number(data.senderId) !== Number(userId)) return;
            }

            refreshMessages();
        };

        navigator.serviceWorker.addEventListener(
            "message",
            handleMessage
        );

        return () => {
            navigator.serviceWorker.removeEventListener(
                "message",
                handleMessage
            );
        };
    }, [conversationId, session, isRoomConversation]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isLoadingMessages]);

    if (!conversationId) {
        return (
            <Flex
                bgColor="gray.50"
                flex="1"
                rounded="md"
                px="10px"
                py="15px"
                alignItems="center"
                justifyContent="center"
                direction="column"
                gap={4}
            >
                <Icon
                    as={MessagesCircle}
                    boxSize="100px"
                    color="yellow.300"
                    strokeWidth={1}
                />

                <Text fontSize="sm">
                    Choisissez une conversation !
                </Text>
            </Flex>
        );
    }

    if (isLoadingMessages) {
        return (
            <Flex
                bgColor="gray.50"
                flex="1"
                rounded="md"
                px="10px"
                py="15px"
                alignItems="center"
                justifyContent="center"
            >
                <Spinner />
            </Flex>
        );
    }

    return (
        <Flex
            flex="1"
            minH="0"
            gap={4}
            direction="column"
            overflowY="auto"
        >
            {messages.map((message: Message) => (
                <MessageBubble
                    message={message}
                    isUser={message.senderId === session?.id}
                />
            ))}

            <div ref={bottomRef} />
        </Flex>
    );
}

export default MessageList;