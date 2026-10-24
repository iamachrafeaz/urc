import {
    AbsoluteCenter,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    IconButton,
    Input,
    Spinner,
    Text,
    VStack
} from "@chakra-ui/react";
import {React, useState} from "react";
import {CustomError} from "../../model/CustomError.ts";
import {signupUser} from "../../apis/signupApi.ts";
import {useNavigate} from "react-router-dom";
import {Check} from "lucide-react";

function Signup(){
    const [error, setError] = useState<CustomError>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        setIsLoading(true);

        signupUser(
            {user_id: -1, username: data.get("username") as string, email: data.get("email") as string, password: data.get("password") as string},
            ()=> {
                setIsLoading(false);
                setIsSuccess(true);
                setError(new CustomError(""));
            },
            (error: CustomError) => {
                console.error(error);
                setError(error);
                setIsLoading(false);
            })
    };

    const handleRedirect = () => {
        navigate("/login")
    }

    return(<Box width={"100%"} height={"100vh"} bg="bg.muted">
            <AbsoluteCenter>
                <Flex direction={"column"} gap="4">
                    <Heading size={"2xl"} textAlign={"center"}>Créer votre compte</Heading>
                    <form onSubmit={handleSubmit}>
                        <Container maxWidth={"xl"} width={"300px"}>
                            <VStack>
                                { error.message &&
                                    <Box width={"100%"} bg={"bg.error"} py={"10px"} px={"15px"} rounded={"md"} borderColor={"border.error"} borderWidth={"1px"} color={"fg.error"}>
                                        <Text textStyle={"sm"}>{error.message}</Text>
                                    </Box>
                                }
                                <Input name="username" placeholder="username"/>
                                <Input name="email" placeholder="email"/>
                                <Input name="password" type={"password"} placeholder="password"/>
                                {(!isLoading && !isSuccess)  && <Button type="submit" width={"100%"} disabled={isLoading}>Créer un compte</Button>}
                                {isLoading && <IconButton width={"100%"}><Spinner/></IconButton>}
                                {isSuccess && <IconButton width={"100%"}><Check /> Redirection...</IconButton>}
                                <Button type="button" variant={"outline"} width={"100%"} disabled={isLoading || isSuccess} onClick={()=> handleRedirect()}>Connexion</Button>
                            </VStack>
                        </Container>
                    </form>
                </Flex>
            </AbsoluteCenter>
        </Box>
    );
}

export default Signup;