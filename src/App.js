import { useCallback, useEffect } from "react";
import styles from "./App.module.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Users from "./users/Users";
import Resevations from "./resevation/Resevations";
import Button from "@mui/material/Button";
import Bikes from "./bikes/Bikes";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMemo, useState } from "react";
import { auth, logout } from "./services/firebase";
import { Tabs, AppBar } from "@mui/material";
import TabLink from "./components/TabLink";
import {
    Route,
    Routes,
    useNavigate,
    useMatch
} from "react-router-dom";
import { useFirebase } from './hooks/use-firebase';
import { useFetchCurrentUser } from "./hooks/use-fetch-current-user";

function App() {
    const [user, loading] = useAuthState(auth);
    const [value, setValue] = useState(0);
    const { data: bikes } = useFirebase("bikes");
    const { data: users } = useFirebase("users");
    const { data: reservations } = useFirebase("reservations");

    const currentUser = useFetchCurrentUser(user?.uid);
    const navigate = useNavigate();
    const isRegisterRoute = useMatch("/register");


    useEffect(() => {
        if (loading || isRegisterRoute) return;
        if (!user) return navigate("login");
      }, [user, loading, navigate, isRegisterRoute]);

    const isManager = useMemo(
        () => currentUser.role === "manager",
        [currentUser.role]
    );
    const navigateLogin = useCallback(() => {
        return navigate("/login");
    }, [navigate]);

    const handleTabChange = useCallback((_e, newValue) => {
        setValue(newValue);
    }, []);

    const onLogout = useCallback(() => {
        logout();
        return navigateLogin();
    }, [navigateLogin]);

    return (
        <div>
            <AppBar position="static" color="transparent">
                <Tabs
                    value={value}
                    onChange={handleTabChange}
                    aria-label="Navigation"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <TabLink label="Bikes" href="/bikes" />
                    {isManager && <TabLink label="Users" href="/users" />}
                    {!isManager && (
                        <TabLink label="Reservations" href="/reservations" />
                    )}
                </Tabs>
                <div className={styles.button}>
                    {!user ? (
                        <Button onClick={navigateLogin}>Login</Button>
                    ) : (
                        <div>
                            <span>{currentUser.name}</span>
                            <Button onClick={onLogout}>Logout</Button>
                        </div>
                    )}
                </div>
            </AppBar>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />}></Route>
                <Route
                    exact
                    path="/bikes"
                    element={
                        <Bikes
                            reservations={reservations}
                            users={users}
                            bikes={bikes}
                            currentUser={currentUser}
                        />
                    }
                />
                {isManager && (
                    <Route
                        exact
                        path="/users"
                        element={
                            <Users
                                reservations={reservations}
                                bikes={bikes}
                                users={users}
                            />
                        }
                    />
                )}
                {!isManager && (
                    <Route
                        exact
                        path="/reservations"
                        element={
                            <Resevations
                                userId={currentUser.id}
                                reservations={reservations}
                                bikes={bikes}
                                users={users}
                            />
                        }
                    />
                )}
            </Routes>
        </div>
    );
}

export default App;
