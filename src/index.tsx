import React from 'react';
import ReactDOM from 'react-dom/client';
import { StartPage } from './pages/startPage';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {GamesPage} from "./pages/games/gamesPage";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {LoginPage} from "./pages/auth/loginPage";
import {GamePage} from "./pages/games/gamePage";
import {RegistrationPage} from "./pages/auth/registrationPage";
import {BuildsPage} from "./pages/gameBuilds/buildsPage";
import {BuildPage} from "./pages/gameBuilds/buildPage";
import {AddBuildPage} from "./pages/gameBuilds/addBuildPage";
import {HomePage} from "./pages/homePage";
import {ProfilePage} from "./pages/auth/profilePage";
import {AddGamePage} from "./pages/games/addGamePage";
import {ManageUsersPage} from "./pages/auth/manageUsersPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: "#1b1b1b",
                color: "black",
            },
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <StartPage></StartPage>,
    },
    {
        path: "/home",
        element: <HomePage></HomePage>,
    },
    {
        path: "/games/:gameId",
        element: <GamePage></GamePage>,
    },
    {
        path: "/games",
        element: <GamesPage></GamesPage>,
    },
    {
        path: "/addGame",
        element: <AddGamePage></AddGamePage>,
    },
    {
        path: "/gameBuilds",
        element: <BuildsPage></BuildsPage>,
    },
    {
        path: "/gameBuilds/:gameBuildId",
        element: <BuildPage></BuildPage>,
    },
    {
        path: "/addGameBuild",
        element: <AddBuildPage></AddBuildPage>,
    },
    {
        path: "/login",
        element: <LoginPage></LoginPage>,
    },
    {
        path: "/register",
        element: <RegistrationPage></RegistrationPage>,
    },
    {
        path: "/users",
        element: <ManageUsersPage></ManageUsersPage>,
    },
    {
        path: "/profile",
        element: <ProfilePage></ProfilePage>,
    },
    {
        "path": "*",
        "element": <div>404</div>
    }
]);

root.render(
    <ChakraProvider theme={theme}>
        <RouterProvider router={router}/>
    </ChakraProvider>
);
