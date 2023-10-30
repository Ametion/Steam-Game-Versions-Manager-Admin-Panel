import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    IconButton,
    Spacer,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Badge, Select, Input, FormControl, FormLabel, RadioGroup, Stack, Radio, Flex
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from '../../api/api';
import {Link, useNavigate} from "react-router-dom";
import { BuildResponse } from "../../api/interfaces";

export const BuildsPage = () => {
    const [builds, setBuilds] = useState<BuildResponse[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
    const [filterInUse, setFilterInUse] = useState<string | null>(null);
    const [filterIsTested, setFilterIsTested] = useState<string | null>(null);
    const [filterGameName, setFilterGameName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuilds();
    }, []);

    const fetchBuilds = async () => {
        try {
            const response = await api.get("api/builds");
            if (response.status == 403) {
                navigate("/login");
                return;
            } else if (!response.ok) {
                setIsError(true);
                return;
            }

            const data = await response.json<BuildResponse[]>();
            setBuilds(data);
        } catch (e) {
            setIsError(true);
            //@ts-ignore
            if (e.toString().includes("403")) {
                navigate("/login");
            }
        }
    };

    const filteredBuilds = builds?.filter(build => {
        if (filterInUse !== null && build.inUse.toString() !== filterInUse) return false;
        if (filterIsTested !== null && build.isTested.toString() !== filterIsTested) return false;
        if (filterGameName && !build.gameName.toLowerCase().includes(filterGameName.toLowerCase())) return false;
        return true;
    });


    const handleDelete = (buildId: string) => {
        setSelectedBuildId(buildId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await api.delete("api/build/" + selectedBuildId);
            if (response.status == 403) {
                navigate("/login");
                return;
            } else if (!response.ok) {
                setIsError(true);
                return;
            }

            window.location.reload();
        } catch (e) {
            setIsError(true);
            //@ts-ignore
            if (e.toString().includes("403")) {
                navigate("/login");
            }
        }

        setDeleteModalOpen(false);
    };

    const booleanToString = (value: boolean | null): string => {
        if (value === true) return 'true';
        if (value === false) return 'false';
        return '';
    };

    const stringToBoolean = (value: string | null): boolean | null => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return null;
    };

    const toggleIsTested = async (buildId: number, currentIsTested: boolean) => {
        try {
            const response = await api.patch(`api/build/${buildId}`, {
                json: {
                    "isTested": !currentIsTested
                }
            });
            if (response.status === 403) {
                navigate("/login");
                return;
            } else if (!response.ok) {
                setIsError(true);
                return;
            }
            fetchBuilds();
        } catch (e) {
            setIsError(true);
            //@ts-ignore
            if (e.toString().includes("403")) {
                navigate("/login");
            }
        }
    };


    return (
        <Container maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent />
            <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={6} px={6} py={4} alignItems="flex-start">
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="#2C2F33" width="100%" minHeight="10rem">
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>In Use</FormLabel>
                            <RadioGroup
                                value={booleanToString(stringToBoolean(filterInUse))}
                                onChange={(value) => setFilterInUse(value)}
                            >
                                <Stack direction="row">
                                    <Radio value="true">Yes</Radio>
                                    <Radio value="false">No</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Is Tested</FormLabel>
                            <RadioGroup
                                value={booleanToString(stringToBoolean(filterIsTested))}
                                onChange={(value) => setFilterIsTested(value)}
                            >
                                <Stack direction="row">
                                    <Radio value="true">Yes</Radio>
                                    <Radio value="false">No</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Game Name</FormLabel>
                            <Input placeholder="Enter game name" onChange={(e) => setFilterGameName(e.target.value)} />
                        </FormControl>
                        <Button onClick={() => { window.location.reload() }}>Clear Filters</Button>
                    </VStack>
                </Box>
                <Container centerContent>
                    <VStack marginBottom={4}>
                        <Link to={"/addGameBuild"}>
                            <IconButton icon={<AddIcon />} colorScheme="teal" aria-label="Add Build" />
                        </Link>
                    </VStack>
                    {isError && (
                        <Alert status="error" marginBottom={4} width="100%">
                            <AlertIcon />
                            <Text fontSize="md">An error occurred while fetching build data. Please try again later.</Text>
                        </Alert>
                    )}
                    <Grid templateColumns="repeat(4, 1fr)" gap={6} marginTop="2rem">
                        {filteredBuilds?.map((build: BuildResponse) => (
                            <Box
                                key={build.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                width={{ base: "100%", md: "45%", lg: "20rem" }}
                                p={4}
                                bg="#2C2F33"
                            >
                                <VStack align="stretch" spacing={4}>
                                    <Box>
                                        <Text fontWeight="bold" fontSize="xl">Build ID: {build.buildId}</Text>
                                        <Box display={"flex"} flexDirection={"column"}>
                                            <Box display="inline-block">
                                                <Badge colorScheme={build.inUse ? "green" : "red"}>
                                                    {build.inUse ? "In Use" : "Not In Use"}
                                                </Badge>
                                            </Box>
                                            <Box display="inline-block">
                                                <Badge colorScheme={build.isTested ? "green" : "red"} onClick={() => toggleIsTested(build.id, build.isTested)}>
                                                    {build.isTested ? "Tested" : "Not Tested"}
                                                </Badge>
                                            </Box>
                                        </Box>

                                        <Link to={`/games/${build.gameId}`} style={{ display: 'block', marginTop: '4px' }}>
                                            <Text color="teal.500" fontSize="sm">Game: {build.gameName}</Text>
                                        </Link>
                                        <Text>
                                            Last Modified by: {build.lastModified}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text color="gray.500" fontSize="sm">
                                            Created At: {new Date(build.createdAt).toLocaleDateString()}
                                        </Text>
                                        <Text color="gray.500" fontSize="sm">
                                            Updated At: {new Date(build.updatedAt).toLocaleDateString()}
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Button colorScheme="red" bg={"#e01b1b"} color={"white"} onClick={() => { handleDelete(build.id.toString()) }}>Delete</Button>
                                    </Box>
                                </VStack>
                            </Box>
                        ))}
                    </Grid>
                </Container>
            </Grid>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <ModalOverlay />
                <ModalContent color={"white"}>
                    <ModalHeader>Confirm Delete</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this game?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" bgColor={"#f82727"} mr={3} onClick={handleConfirmDelete}>
                            Confirm
                        </Button>
                        <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
}
