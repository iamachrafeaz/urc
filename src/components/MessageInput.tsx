import React, { useState } from "react";
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { sendMessage } from "../apis/conversationApi.ts";

import { useSessionStore } from "../stores/session.ts";
import { useConversationStore } from "../stores/conversation.ts";
import {sendRoomMessage} from "../apis/roomConversationApi.ts";

function MessageInput() {
    const { userId: userId, roomId: roomId } = useParams();

    const session = useSessionStore(state => state.session);
    const addMessage = useConversationStore(state => state.addMessage);

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const isRoomConversation = Boolean(roomId);
    const conversationId = roomId ?? userId;

    const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content = messageInput.trim();

        if (!content || !conversationId || !session || isSending) {
            return;
        }

        setIsSending(true);

        const onSuccess = () => {
            addMessage({
                content,
                senderId: session.id!,
                senderUsername: session.username,
                timestamp: new Date().toISOString()
            });

            setMessageInput("");
            setIsSending(false);
        };

        const onError = (error: unknown) => {
            console.error("Failed to send message:", error);
            setIsSending(false);
        };

        if (isRoomConversation) {
            sendRoomMessage(
                {
                    content,
                    roomId: Number(roomId)
                },
                session,
                onSuccess,
                onError
            );
        } else {
            sendMessage(
                {
                    message: content,
                    receiverId: Number(userId)
                },
                session,
                onSuccess,
                onError
            );
        }
    };

    return (
        <form onSubmit={handleSend}>
            <Flex gap={2}>
                <Input
                    disabled={isSending || (!userId && !roomId) || !session}
                    placeholder="Type something..."
                    value={messageInput}
                    onChange={event => setMessageInput(event.target.value)}
                />

                <Button
                    type="submit"
                    disabled={
                        isSending ||
                        !messageInput.trim() ||
                        (!userId && !roomId) ||
                        !session
                    }
                >
                    {isSending ? <Spinner size="sm" /> : "Send"}
                </Button>
            </Flex>
        </form>
    );
}

export default MessageInput;