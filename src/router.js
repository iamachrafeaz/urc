import {createBrowserRouter, redirect} from "react-router-dom";
import {Login} from "./pages/login/Login.tsx";
import App from "./App";
import {useSessionStore} from "./stores/session";
import Signup from "./pages/signup/Signup";

const authLoader = () => {
    const isLoggedIn = useSessionStore.getState.isLoggedIn;

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
        path: "/login",
        Component: Login
    },
    {
        path: "/signup",
        Component: Signup
    }
])

export default router;