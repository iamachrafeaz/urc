import {React, useEffect} from "react";
import NavBar from "../../components/common/NavBar.tsx";
import {Flex} from "@chakra-ui/react";
import ConversationList from "../../components/ConversationList.tsx";
import {useSessionStore} from "../../stores/session.ts";
import {useUsersStore} from "../../stores/users.ts";
import {getUsersList} from "../../apis/usersApi.ts";
import {useLogout} from "../../hooks/useLogout.ts";
import Conversation from "../../components/Conversation.tsx";

function Messenger(){
    const session = useSessionStore(state=> state.session);
    const setUsers = useUsersStore(state => state.setUsers);
    const setIsLoadingUsers = useUsersStore(state => state.setIsLoading);
    const logout = useLogout();

    useEffect(() => {
        setIsLoadingUsers(true)
        if(session){
            getUsersList(
                session,
                (users) => {
                    setUsers(users);
                    setIsLoadingUsers(false);
                },
                (error) => {
                    if(error.code == "SESSION_EXPIRED"){
                        logout();
                    }else{
                        console.error(error)
                    }

                    setIsLoadingUsers(false);
                })
        }
    }, []);

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

                <Flex
                    flex="1"
                    minW="0"
                    minH="0"
                    overflow="hidden"
                >
                    <Conversation />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Messenger;