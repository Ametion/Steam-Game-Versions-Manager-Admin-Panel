import React from 'react';
import {NavBarComponent} from "../components/navBarComponent";
import {Container} from "@chakra-ui/react";

export const HomePage = () => {
    return (
        <Container bg={"#36393F"} minH={"100vh"} minW={"100%"}>
            <NavBarComponent/>
        </Container>
    );
};
