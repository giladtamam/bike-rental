import { fetchCurrentUser } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function useFetchCurrentUser(userId) {
    const [currentUser, setCurrentUser] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (userId) {
                    const doc = await fetchCurrentUser(userId);
                    const data = doc.docs[0].data();
                    setCurrentUser({ ...data, id: doc.docs[0].id });
                }
            } catch (err) {
                // navigate("/login");
            }
        };
        fetchUser();
    }, [userId, navigate]);

    return currentUser;
}