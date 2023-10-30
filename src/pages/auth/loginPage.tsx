import { Box, Input, Button, VStack, Heading, Container, Flex, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {useState} from "react";
import ky from "ky";

export const LoginPage = () => {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if ( login != "" && password != "") {
            try {
                const response = await ky.post("http://localhost:7778/auth/login", {
                  json: {
                      login: login,
                      password: password
                  }
                })

                response.json<{token: string}>().then((data) => {
                    localStorage.setItem("token", data.token)
                })

                navigate("/home")
            } catch (err) {
                console.error("An error occurred while trying to login:", err);
            }
        }
    };

    return (
        <Container bg={"#36393F"} minH={"100vh"} minW={"100%"}>
            <Container centerContent>
                <Box
                    width="100%"
                    padding="2rem"
                    boxShadow="md"
                    bg="#2C2F33"
                    borderRadius="md"
                    marginTop="10rem"
                    color="#1b1b1b"
                >
                    <VStack spacing={4}>
                        <Heading>Login</Heading>
                        <Input variant="filled" placeholder="Login" width="85%"
                               onChange={(e) => setLogin(e.target.value)} />
                        <Input variant="filled" placeholder="Password" type="password" width="85%"
                               onChange={(e) => setPassword(e.target.value)}/>
                        <Button colorScheme="teal" width="85%" onClick={handleLogin}>Login</Button>
                        <Flex width="85%" justifyContent="flex-end">
                            <Text fontSize="2sm">
                                <Link to="/register"><b>Register</b></Link>
                            </Text>
                        </Flex>
                    </VStack>
                </Box>
            </Container>
        </Container>

    );
};
