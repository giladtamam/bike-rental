import { useEffect, useState } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from "../services/firebase";

export function useFirebase (resource) {
    const [data, setData] = useState([]);

    useEffect(() => { 
        onSnapshot(query(collection(db, resource)), (querySnapshot) => {
            let data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setData(data);
        });
    }, [resource]);
    return { data };
}