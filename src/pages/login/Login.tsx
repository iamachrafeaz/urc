import {React, useState} from "react";
import {loginUser} from "../../apis/loginApi.ts";
import {CustomError} from "../../model/CustomError.ts";
import {AbsoluteCenter, Box, Button, Container, Flex, Heading, Input, VStack, Text, IconButton, Spinner} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {Check} from "lucide-react";
import type {Session} from "../../model/common.ts";
import {useSessionStore} from "../../stores/session.ts";

export function Login() {
    const navigate = useNavigate();
    const setSession = useSessionStore(state => state.setSession)

    const [error, setError] = useState<CustomError>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setIsLoading(true);
        loginUser({user_id: -1, username:  data.get('login') as string, password: data.get('password') as string},
            (session: Session) => {
                setIsLoading(false);
                setIsSuccess(true);
                setSession(session)
                navigate("/messages")
                setError(new CustomError(""));
            }, (loginError: CustomError) => {
                setError(loginError);
                setIsLoading(false);
            });
    };

    const handleRedirect = () => {
        navigate("/signup")
    }

    return(<Box width={"100%"} height={"100vh"} bg="bg.muted">
            <AbsoluteCenter>
                <Flex direction={"column"} gap="4">
                    <Heading size={"2xl"} textAlign={"center"}>Bienvenue à UBO Relay Chat</Heading>
                    <form onSubmit={handleSubmit}>
                        <Container maxWidth={"xl"} width={"300px"}>
                            <VStack>
                                { error.message &&
                                    <Box width={"100%"} bg={"bg.error"} py={"10px"} px={"15px"} rounded={"md"} borderColor={"border.error"} borderWidth={"1px"} color={"fg.error"}>
                                        <Text textStyle={"sm"}>{error.message}</Text>
                                    </Box>
                                }
                                <Input name="login" placeholder="login"/>
                                <Input name="password" type="password" placeholder="password"/>
                                {(!isLoading && !isSuccess) && <Button type="submit" width={"100%"} disabled={isLoading}>Connexion</Button>}
                                {isLoading && <IconButton width={"100%"}><Spinner/></IconButton>}
                                {isSuccess && <IconButton width={"100%"}><Check /></IconButton>}
                                <Button type="button" variant={"outline"} width={"100%"} disabled={isLoading} onClick={()=> handleRedirect()}>Créer un compte</Button>
                            </VStack>
                        </Container>
                    </form>
                </Flex>
            </AbsoluteCenter>
        </Box>
    );
}