import {Box, Button, ButtonGroup, Flex, Spacer} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NavBarComponent = () => {
    const token = localStorage.getItem("token")

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Flex
                as="nav"
                align="center"
                justify="flex-end"
                wrap="wrap"
                padding="1.5rem"
                bg="#2C2F33"
                color="#21A179"
                marginBottom={4}
                width="60%"
            >
            <Box>
                <Button variant="ghost" as={Link} to="/home" marginRight={5}>
                    Home
                </Button>
                <Button variant="ghost" as={Link} to="/games" marginRight={5}>
                    Games
                </Button>
                <Button variant="ghost" as={Link} to="/gameBuilds" marginRight={5}>
                    Builds
                </Button>
                <Button variant="ghost" as={Link} to="/users" marginRight={5}>
                    Users
                </Button>
            </Box>

            <Spacer />

            <Box>
                {token == "" && (
                    <ButtonGroup spacing={5}>
                        <Button variant="solid" colorScheme="teal" as={Link} to="/login">
                            Login
                        </Button>
                        <Button variant="outline" colorScheme="teal" as={Link} to="/register">
                            Register
                        </Button>
                    </ButtonGroup>
                )}
            </Box>

            <Box>
                {token != "" && (
                    <Button variant="solid" colorScheme="teal" as={Link} to="/profile">
                        Profile
                    </Button>
                )}
            </Box>
        </Flex>
        </div>
    );
};
