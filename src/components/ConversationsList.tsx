import React, {useEffect} from "react";
import { Box, Flex, Heading, List, Spinner, Text } from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

import { useUsersStore } from "../stores/users.ts";
import { useRoomsStore } from "../stores/rooms.ts";

import { UserItem } from "./UserComponent.tsx";

import type { User, Room } from "../model/common.ts";
import {useLogout} from "../hooks/useLogout.ts";
import {getUsersList} from "../apis/usersApi.ts";
import {useSessionStore} from "../stores/session.ts";
import {getRoomsList} from "../apis/roomsApi.ts";

function ConversationsList() {
    const session = useSessionStore((state) => state.session);

    const users = useUsersStore(state => state.users);
    const usersLoading = useUsersStore(state => state.isLoading);

    const rooms = useRoomsStore(state => state.rooms);
    const roomsLoading = useRoomsStore(state => state.isLoading);

    const setUsers = useUsersStore((state) => state.setUsers);
    const setIsLoadingUsers = useUsersStore((state) => state.setIsLoading);

    const setRooms = useRoomsStore((state) => state.setRooms);
    const setIsLoadingRooms = useRoomsStore((state) => state.setIsLoading);

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
    }, [session]);

    useEffect(() => {
        if (!session) return;

        setIsLoadingRooms(true);

        getRoomsList(
            session,
            (rooms) => {
                setRooms(rooms);
                setIsLoadingRooms(false);
            },
            (error) => {
                if (error.code === "SESSION_EXPIRED") {
                    logout();
                } else {
                    console.error(error);
                }

                setIsLoadingRooms(false);
            }
        )
    }, [session]);

    const navigate = useNavigate();

    const handleUserClick = (user: User) => {
        navigate(`/messages/user/${user.user_id}`);
    };

    const handleRoomClick = (room: Room) => {
        navigate(`/messages/room/${room.room_id}`);
    };

    return (
        <Box
            bgColor="gray.100"
            flex="1"
            rounded="md"
            h="100%"
            minH="0"
            overflowY="auto"
            px="10px"
            py="15px"
        >
            <Heading size="lg" mb={5}>
                Relay Chat
            </Heading>

            {/* Rooms section */}
            <Heading size="sm" mb={2}>
                Rooms
            </Heading>

            {roomsLoading && (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    minH="100px"
                >
                    <Spinner />
                </Flex>)
            }
            {(!roomsLoading) &&
                (rooms.length > 0 ? (
                    <List.Root unstyled>
                        {rooms.map((room) => (
                            <List.Item key={room.room_id}>
                                <Box
                                    px={3}
                                    py={2}
                                    rounded="md"
                                    cursor="pointer"
                                    _hover={{bg: "gray.200"}}
                                    onClick={() => handleRoomClick(room)}
                                >
                                    <Text fontWeight="medium">
                                        {room.name}
                                    </Text>
                                </Box>
                            </List.Item>
                        ))}
                    </List.Root>
                ) : (
                    <Text fontSize="sm" color="gray.500" mb={4}>
                        No rooms available.
                    </Text>
                )
            )}
            {/* Users section */}
            <Heading size="sm" mt={5} mb={2}>
                Users
            </Heading>

            {usersLoading && (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    minH="100px"
                >
                    <Spinner />
                </Flex>)
            }

            {!usersLoading && (users.length > 0 ? (
                <List.Root unstyled>
                    {users.map((user) => (
                        <List.Item key={user.user_id}>
                            <UserItem
                                user={user}
                                onClick={() => handleUserClick(user)}
                            />
                        </List.Item>
                    ))}
                </List.Root>
            ) : (
                <Text fontSize="sm" color="gray.500">
                    No users available.
                </Text>
            ))}
        </Box>
    );
}

export default ConversationsList;
