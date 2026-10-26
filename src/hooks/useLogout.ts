import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../stores/session";

export function useLogout() {
    const navigate = useNavigate();
    const logout = useSessionStore((state) => state.logout);

    return () => {
        logout();
        navigate("/login", { replace: true });
    };
}