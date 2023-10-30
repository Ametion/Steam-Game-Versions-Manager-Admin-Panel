import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    IconButton,
    Image,
    Spacer,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Fade, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ModalCloseButton
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
//@ts-ignore
import {AddIcon, DeleteIcon, HamburgerIcon} from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { api } from '../../api/api';
import { GameResponse } from "../../api/interfaces";

export const GamesPage = () => {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [hoveredGame, setHoveredGame] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get("api/games");
                if (response.status == 403) {
                    navigate("/login");
                    return;
                } else if (!response.ok) {
                    setIsError(true);
                    return;
                }

                const data = await response.json<GameResponse[]>();
                setGames(data);
            } catch (e) {
                setIsError(true);
                //@ts-ignore
                if(e.toString().includes("403")) {
                    navigate("/login");
                }
            }
        };

        fetchGames();
    }, []);

    const handleDelete = (gameId: string) => {
        setSelectedGameId(gameId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteModalOpen(false);

        try {
            const response = await api.delete("api/game/"+selectedGameId);
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
            if(e.toString().includes("403")) {
                navigate("/login");
            }
        }
    };

    const handleEdit = (gameId: string) => {
        navigate("/games/edit/"+gameId);
    }

    return (
        <Container maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent />
            <Container centerContent>
                <VStack marginBottom={4}>
                    <Link to="/addGame">
                        <IconButton icon={<AddIcon />} colorScheme="teal" aria-label="Add Game" />
                    </Link>
                </VStack>
                {isError && (
                    <Alert status="error" marginBottom={4} width="100%">
                        <AlertIcon />
                        <Text fontSize="md">An error occurred while fetching game data. Please try again later.</Text>
                    </Alert>
                )}
                <Grid templateColumns="repeat(4, 1fr)" gap={6} marginTop="2rem">
                    {games?.map((game: GameResponse) => (
                        <Link to={`/games/${game.gameId}`} key={game.gameId}>
                        <Box
                            onMouseEnter={() => setHoveredGame(game.gameId)}
                            onMouseLeave={() => setHoveredGame(null)}
                            key={game.gameId}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            width={{ base: "100%", md: "45%", lg: "20rem" }}
                            position="relative"
                            _hover={{
                                "::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    zIndex: 1,
                                }
                            }}
                        >
                            <Box w={"100%"}>
                                <Image
                                    src={`${game.gameImage}`}
                                    alt={game.gameName}
                                    maxH="60%"
                                    objectFit="cover"
                                />
                            </Box>
                            <VStack padding="1rem">
                                <Text fontWeight="bold" fontSize="xl">{game.gameName}</Text>
                                <Box display="flex" alignItems="baseline">
                                    <Text color="gray.500" fontSize="sm">
                                        Last Build ID: {game.latestBuildId}
                                    </Text>
                                    <Spacer />
                                    <Text color="gray.500" fontSize="sm">
                                        Last Update: {new Date(game.updatedAt).toLocaleDateString()}
                                    </Text>
                                </Box>
                            </VStack>
                            <Box
                                position="absolute"
                                top="5%"
                                right="5%"
                                zIndex="2"
                            >
                                <Fade in={true}>
                                    <Button
                                        zIndex="3 !important"
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        variant="outline"
                                        bg={hoveredGame === game.gameId ? "#c21414" : undefined}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault()
                                            handleDelete(game.gameId);
                                        }}
                                    >
                                    </Button>
                                </Fade>
                            </Box>
                        </Box>
                        </Link>
                    ))}
                </Grid>
            </Container>
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
};
