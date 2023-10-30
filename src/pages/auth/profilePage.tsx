import React from 'react';
import {NavBarComponent} from "../../components/navBarComponent";
import {Container} from "@chakra-ui/react";

export const ProfilePage = () => {
    return (
        <Container maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent/>
        </Container>
    );
};