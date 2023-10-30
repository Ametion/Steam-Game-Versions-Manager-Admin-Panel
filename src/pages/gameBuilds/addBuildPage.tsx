import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    Alert, AlertIcon,
    Box,
    Button, Checkbox,
    Container,
    FormControl,
    FormLabel,
    Input, Text,
    VStack,
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { GameResponse, Response } from "../../api/interfaces";

type GameOption = {
    value: string;
    label: Element;
} | null;

export const AddBuildPage = () => {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [selectedGame, setSelectedGame] = useState<GameOption>(null);
    const [buildId, setBuildId] = useState<string>("");
    const [isInUse, setIsInUse] = useState(false);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGames = async () => {
            const response = await api.get("api/games");
            if (response.status === 403) {
                navigate("/login");
                return;
            } else if (!response.ok) {
                setIsError(true);
                return;
            }
            const data = await response.json<GameResponse[]>();
            setGames(data);
        };
        fetchGames();
    }, [navigate]);

    const gameOptions = games.map(game => ({
        value: game.gameId,
        label: (
            <Box display="flex" alignItems="center">
                <img src={game.gameImage} alt={game.gameName} style={{ marginRight: '8px', width: '24px', height: '24px' }} />
                {game.gameName}
            </Box>
        )
    })) as any;

    const handleOptionChange = (selectedOption: GameOption) => {
        setSelectedGame(selectedOption);
    };

    const handleAddBuild = async () => {
        try {
            const build = {
                buildId: buildId,
                gameId: selectedGame?.value,
                inUse: isInUse
            }

            const response = await api.post("api/build", { json: build }).json<Response>();

            if(response.code != 201) {
                setIsError(true)
                return
            }

            navigate("/gameBuilds")
        }catch (e){
            setIsError(true)
            //@ts-ignore
            if(e.toString().includes("403")) {
                navigate("/login");
            }
        }

    };

    return (
        <Container maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent />
            <Container centerContent w="15%" maxW="40%" borderRadius="10px" p={8} bg="#2C2F33">
                {isError && (
                    <Alert status="error" marginBottom={4} width="100%">
                        <AlertIcon />
                        <Text fontSize="md">An error occurred while fetching game data. Please try again later.</Text>
                    </Alert>
                )}
                <Box>
                    <VStack align="center" justify="center" spacing={4}>
                        <FormControl id="game-select">
                            <FormLabel>Choose Game</FormLabel>
                            <Select
                                options={gameOptions}
                                value={selectedGame}
                                onChange={handleOptionChange}
                                isClearable
                            />
                        </FormControl>
                        <FormControl id="build-id">
                            <FormLabel>Build ID</FormLabel>
                            <Input type="text" value={buildId} onChange={(e) => setBuildId(e.target.value)} />
                        </FormControl>
                        <FormControl id="is-in-use">
                            <FormLabel>Is Build In Use</FormLabel>
                            <Checkbox colorScheme="teal" isChecked={isInUse} onChange={(e) => setIsInUse(e.target.checked)}>
                                In Use
                            </Checkbox>
                        </FormControl>
                        <Button colorScheme="teal" onClick={handleAddBuild}>Add Build</Button>
                    </VStack>
                </Box>
            </Container>
        </Container>
    );
};
