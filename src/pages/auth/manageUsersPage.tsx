import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Select,
    Flex,
    useColorModeValue,
    Text
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
import { api } from '../../api/api';
import { useNavigate } from "react-router-dom";

type User = {
    id: number;
    login: string;
    status: string;
};

export const ManageUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.get("api/users")

            if (response.status === 403) {
                navigate("/login");
            } else if (!response.ok) {
                setIsError(true)
            }

            const data = await response.json<User[]>();
            setUsers(data);
        };

        fetchUsers();
    }, [navigate]);

    const handleStatusChange = (userId: number, newStatus: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
    };

    const handleUpdateUser = async (userId: number) => {
        const user = users.find(user => user.id === userId);
        if (user) {
            const response = await api.post("api/user", {
                json: {
                    userId: user.id,
                    status: user.status
                }
            });
            if (response.ok) {
                console.log('User updated successfully');
            } else {
                console.error('Failed to update user');
            }
        }
    };

    return (
        <Container maxW="100%" minH="100vh">
            <NavBarComponent />
            <Flex direction="column" align="center" mt={8}>
                {users.map(user => (
                    <Flex
                        key={user.id}
                        w="75%"
                        p={4}
                        mb={4}
                        borderRadius="md"
                        boxShadow="md"
                        justify="space-between"
                        align="center"
                    >
                        <Flex align="center">
                            <Text mr={4}>{user.id} - {user.login}</Text>
                        </Flex>
                        <Flex align="center" w={"25%"}>
                            <Select
                                maxW="200px"
                                value={user.status}
                                onChange={(e) => handleStatusChange(user.id, e.target.value)}
                                mr={4}  // Added margin to the right of the Select component
                            >
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                                <option value="blocked">Blocked</option>
                            </Select>
                            <Button minW={"15%"} colorScheme="blue" onClick={() => handleUpdateUser(user.id)}>
                                Update User
                            </Button>
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Container>
    );

};
