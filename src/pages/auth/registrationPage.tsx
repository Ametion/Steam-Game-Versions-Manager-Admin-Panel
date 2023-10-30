import { Box, Input, Button, VStack, Heading, Container, Flex, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ky from "ky";

export const RegistrationPage = () => {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleRegistration = async () => {
        if (login !== "" && password !== "" && (password === confirmPassword)) {
            try {
                const response = await ky.post("http://localhost:7778/auth/register", {
                    json: {
                        login: login,
                        password: password
                    }
                })
                //@ts-ignore
                if (response.status == 201) {
                    navigate("/login");
                }
            } catch (err) {
                console.error("An error occurred while trying to register:", err);
                setIsError(true);
            }
        }
    }

    return (
        <Container centerContent>
            <Box
                width="100%"
                padding="2rem"
                boxShadow="md"
                bg="#f5f5f5"
                borderRadius="md"
                marginTop="10rem"
            >
                <VStack spacing={4}>
                    <Heading>Register</Heading>
                    <Input
                        variant="filled"
                        placeholder="Login"
                        width="85%"
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <Input
                        variant="filled"
                        placeholder="Password"
                        type="password"
                        width="85%"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        variant="filled"
                        placeholder="Confirm Password"
                        type="password"
                        width="85%"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {password !== confirmPassword && confirmPassword !== "" && (
                        <Alert status="error" width="85%">
                            <AlertIcon />
                            Passwords do not match
                        </Alert>
                    )}
                    <Button
                        colorScheme="teal"
                        width="85%"
                        onClick={handleRegistration}
                    >
                        Register
                    </Button>
                    <Flex width="85%" justifyContent="flex-end">
                        <Text fontSize="sm">
                            <Link to="/login">Login</Link>
                        </Text>
                    </Flex>
                </VStack>
                {isError && (
                    <Alert status="error" width="85%" marginTop={4}>
                        <AlertIcon />
                        Registration failed. Please try again.
                    </Alert>
                )}
            </Box>
        </Container>
    );
};
