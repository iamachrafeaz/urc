import {React} from "react";
import { Flex } from "@chakra-ui/react";

import NavBar from "../../components/common/NavBar";
import ConversationsList from "../../components/ConversationsList.tsx";
import { useSessionStore } from "../../stores/session";
import { useBeams } from "../../hooks/useBeams";
import {Outlet} from "react-router-dom";

function Messenger() {
    const session = useSessionStore((state) => state.session);

    useBeams(session);

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
                    <ConversationsList />
                </Flex>

                <Flex flex="1" minW="0" minH="0" overflow="hidden">
                    <Outlet />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Messenger;