import React, {useEffect} from 'react';
import {Box, Button, Container} from "@chakra-ui/react";
import {NavBarComponent} from "../components/navBarComponent";

export function StartPage() {
    useEffect(() => {
        if(!localStorage.getItem("token")) {
            localStorage.setItem("token", "");
        }
    }, []);

  return (
    <div className="App">
        <Container w={"100%"} maxW="100%" bg="#36393F" color="#B9C4CA" minH={"100vh"}>
            <NavBarComponent/>
        </Container>
    </div>
  );
}