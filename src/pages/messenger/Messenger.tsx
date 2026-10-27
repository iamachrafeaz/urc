import {React, useEffect} from "react";
import { Flex } from "@chakra-ui/react";

import NavBar from "../../components/common/NavBar";
import ConversationList from "../../components/ConversationList";
import Conversation from "../../components/Conversation";
import { useSessionStore } from "../../stores/session";
import { useUsersStore } from "../../stores/users";
import { getUsersList } from "../../apis/usersApi";
import { useLogout } from "../../hooks/useLogout";
import { useBeams } from "../../hooks/useBeams";

function Messenger() {
    const session = useSessionStore((state) => state.session);

    useBeams(session);

    const setUsers = useUsersStore((state) => state.setUsers);
    const setIsLoadingUsers = useUsersStore((state) => state.setIsLoading);
    const logout = useLogout();

    useEffect(() => {
        if (!session) return;

        setIsLoadingUsers(true);

        getUsersList(
            session,
            (users) => {
                setUsers(users);
                setIsLoadingUsers(false);
            },
            (error) => {
                if (error.code === "SESSION_EXPIRED") {
                    logout();
                } else {
                    console.error(error);
                }

                setIsLoadingUsers(false);
            },
        );
    }, [session, setUsers, setIsLoadingUsers, logout]);


    return (
        <Flex direction="column" h="100dvh" w="100%" overflow="hidden">
            <NavBar />

            <Flex
                flex="1"
                minH="0"
                w="100%"
                overflow="hidden"
                px="10px"
                py="15px"
                gap={2}
            >
                <Flex
                    direction="column"
                    w="350px"
                    minW="280px"
                    minH="0"
                    overflow="hidden"
                >
                    <ConversationList />
                </Flex>

                <Flex flex="1" minW="0" minH="0" overflow="hidden">
                    <Conversation />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Messenger;