import React from "react";
import {Box, Flex, Heading, List, Spinner} from "@chakra-ui/react";
import {useUsersStore} from "../stores/users.ts";
import {UserItem} from "./UserComponent.tsx";
import type {User} from "../model/common.ts";
import {useNavigate} from "react-router-dom";

function ConversationList(){
    const {users, isLoading} = useUsersStore(state => state);
    const navigate = useNavigate();

    const handleUserClick = (user: User) => {
        navigate(`/messages/user/${user.user_id}`)
    }

    return <Box bgColor={"gray.100"} flex={"1"} rounded={"md"} hight={"100%"} px={"10px"} py={"15px"}>
        <Heading size="lg" mb={2}>
            Relay Chat
        </Heading>

        {isLoading &&
            <Flex alignItems={"center"} justifyContent={"Center"} h={"100%"} w={"100%"}>
            <Spinner/>
        </Flex>}

        {!isLoading && <List.Root unstyled={true}>
            {users.length > 0 && users.map(user => (
                <List.Item key={user.user_id}>
                    <UserItem user={user} onClick={() => handleUserClick(user)}/>
                </List.Item>
            ))}
        </List.Root>}
    </Box>
}

export default ConversationList;