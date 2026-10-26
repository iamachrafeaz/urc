import {React, useEffect} from "react";
import NavBar from "../../components/common/NavBar.tsx";
import {Box, Flex} from "@chakra-ui/react";
import ConversationList from "../../components/ConversationList.tsx";
import MessageList from "../../components/MessageList.tsx";
import {useSessionStore} from "../../stores/session.ts";
import {useUsersStore} from "../../stores/users.tsx";
import {getUsersList} from "../../apis/usersApi.ts";
import {useLogout} from "../../hooks/useLogout.ts";
import {toaster} from "../../components/ui/toaster.tsx";

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

    return <Box h="100vh" w="100%" overflow="hidden">
        <NavBar/>
        <Flex h="100%" w="100%" overflow="hidden" px={"10px"} py={"15px"} gap={2}>
            <Flex
                direction="column"
                w="350px"
                minW="280px"
            >
                <ConversationList/>
            </Flex>
            <Flex flex={"1"}>
                <MessageList/>
            </Flex>
        </Flex>
    </Box>
}

export default Messenger;