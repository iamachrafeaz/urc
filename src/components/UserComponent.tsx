import React from "react";
import {Avatar, Flex, Float, Text} from "@chakra-ui/react";
import type {User} from "../model/common.ts";
import {Circle} from "lucide-react";

type UserItemProps = {
    user: User;
    onClick: () => void
};

export function UserItem({ user, onClick }: UserItemProps) {
    return (
        <Flex gap={2} my="5px" align="center" px={"5px"} py={"10px"} rounded={"sm"} _hover={{ bg: "gray.300" }} onClick={onClick}>
            <Avatar.Root>
                <Avatar.Fallback name={user.username} />
                <Float placement="bottom-end" offsetX="1.5" offsetY="1">
                    <Circle
                        bg="green.500"
                        size="8px"
                        outline="0.2em solid"
                        outlineColor="bg"
                    />
                </Float>
            </Avatar.Root>

            <Flex direction="column">
                <Text>{user.username}</Text>
                <Text fontSize="xs">{user.last_login}</Text>
            </Flex>
        </Flex>
    );
}