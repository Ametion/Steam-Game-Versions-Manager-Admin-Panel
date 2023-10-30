import React, {ChangeEvent, useState} from 'react';
import {
    Alert, AlertIcon,
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Image,
    Input, Text,
    VStack
} from '@chakra-ui/react';
import { NavBarComponent } from '../../components/navBarComponent';
import {api} from "../../api/api";
import {useNavigate} from "react-router-dom";
import {Response} from "../../api/interfaces";

export const AddGamePage = () => {
    const [imageData, setImageData] = useState<string>("");
    const [gameId, setGameId] = useState<string>("");
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate()

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result && typeof e.target.result === 'string') {
                    setImageData(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddGame = async () => {
        const response = await api.post("api/game", {json: {
            "gameId": gameId,
            "gameImage": imageData
        }}).json<Response>()

        if (response.code == 201) {
            navigate("/games");
            return
        }

        setIsError(true);
    }

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
                       <FormControl id="game-image">
                           <FormLabel>Game Image</FormLabel>
                           {/* Hidden Input */}
                           <Input type="file" accept="image/*" onChange={handleImageChange} id="file-input" style={{ display: 'none' }} />
                           {/* Custom Button */}
                           <label htmlFor="file-input">
                               <Button as="span" colorScheme="teal">Upload Image</Button>
                           </label>
                           {imageData && <Box w="100%" display="flex" alignContent="center"
                                            justifyContent="center" justifyItems="center" alignItems="center">
                               <Image src={imageData} alt="Game Image" maxW="100%" mt="2vh" maxH="35vh" />
                           </Box>}
                       </FormControl>
                       <FormControl id="game-id">
                           <FormLabel>Game ID</FormLabel>
                           <Input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                       </FormControl>
                       <Button colorScheme="teal" onClick={handleAddGame}>Add Game</Button>
                   </VStack>
               </Box>
           </Container>
        </Container>
    );
};
