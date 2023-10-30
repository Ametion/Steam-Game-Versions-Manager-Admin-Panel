import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Image,
    Text,
    VStack,
    Alert,
    AlertIcon,
    Spinner,
    Heading,
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
import { useParams, useNavigate } from "react-router-dom";
import { api } from '../../api/api';
import { GameResponse } from "../../api/interfaces";

export const GamePage = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState<GameResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await api.get(`api/game/${gameId}`);
                if (response.status === 403) {
                    navigate("/login");
                    return;
                } else if (!response.ok) {
                    setIsError(true);
                    return;
                }
                const data = await response.json<GameResponse>();
                setGame(data);
            } catch (e) {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGame();
    }, [gameId, navigate]);

    if (isLoading) {
        return (
            <Container centerContent minH="100vh">
                <Spinner size="xl" />
            </Container>
        );
    }

    if (isError || !game) {
        return (
            <Container centerContent minH="100vh">
                <Alert status="error">
                    <AlertIcon />
                    An error occurred while fetching game data. Please try again later.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent />
            <Container centerContent>
                <VStack spacing={4} align="stretch" marginTop={8}>
                    <Heading as="h2" size="xl">{game.gameName}</Heading>
                    <Box boxSize="lg">
                        <Image src={game.gameImage} alt={game.gameName} objectFit="cover" />
                    </Box>
                    <Text>Last Build ID: {game.latestBuildId}</Text>
                    <Text>Last Update: {new Date(game.updatedAt).toLocaleDateString()}</Text>
                </VStack>
            </Container>
        </Container>
    );
};
