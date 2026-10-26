import React, {useState} from "react";
import {Button, Flex, Input, Spinner} from "@chakra-ui/react";
import {sendMessage} from "../apis/conversationApi.ts";
import {useParams} from "react-router-dom";
import {useSessionStore} from "../stores/session.ts";
import {useConversationStore} from "../stores/conversation.ts";

function MessageInput(){
    const params = useParams();
    const session = useSessionStore(state => state.session);

    const [messageInput, setMessageInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const addMessage = useConversationStore(state=> state.addMessage);

    const handleSend = () => {
        setIsSending(true);
        const payload= {
            message: messageInput,
            receiverId: Number(params.userId)
        }
        sendMessage(payload, session!, () => {
            setMessageInput("");
            addMessage({content: messageInput, senderId: session!.id!, timestamp: new Date().toISOString()});
            setIsSending(false);
        }, (err) => {
            console.error(err);
            setIsSending(false);
        })
    }

    return <form action={handleSend}>
        <Flex gap={2}>
            <Input
                disable={isSending}
                placeholder="Type something..."
                value={messageInput}
                onChange={(e) => {
                    if(!isSending) {
                        setMessageInput(e.target.value)
                    }
                }}/>
        <Button type={"submit"}>{isSending ? <Spinner/> : "Send"}</Button>
        </Flex>
    </form>
}

export default MessageInput;