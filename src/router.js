import {createBrowserRouter, redirect} from "react-router-dom";
import {Login} from "./pages/login/Login.tsx";
import {useSessionStore} from "./stores/session";
import Signup from "./pages/signup/Signup";
import Messenger from "./pages/messenger/Messenger";
import App from "./App";

const authLoader = () => {
    const isLoggedIn = useSessionStore.getState().session;
    if(!isLoggedIn){
        return redirect("/login")
    }

    return null
}

const router = createBrowserRouter([
    {
        loader: authLoader,
        path: "/",
        Component: App,
    },
    {
        loader: authLoader,
        path: "/messages",
        Component: Messenger,
    },
    {
        loader: authLoader,
        path: "/messages/user/:userId",
        Component: Messenger,
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/signup",
        Component: Signup
    }
])

export default router;