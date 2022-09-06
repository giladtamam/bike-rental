import { initializeApp } from "firebase/app";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB0qrRrGhDzqaNevYTefvQQfODRDsxEaV8",
    authDomain: "bike-rental-a6daa.firebaseapp.com",
    projectId: "bike-rental-a6daa",
    storageBucket: "bike-rental-a6daa.appspot.com",
    messagingSenderId: "65665899871",
    appId: "1:65665899871:web:291f8dee74187cfc3d6aea",
};

const app = initializeApp(firebaseConfig);
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const auth = getAuth(app);
const secondaryAuth = getAuth(secondaryApp);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPasswordAndLogout = async (name, email, password, role) => {
    try {
        const res = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
            role
        });
        signOut(secondaryAuth);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassword = async (name, email, password, role) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
            role
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

const fetchCurrentUser = (userId) => {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    return getDocs(q);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    registerWithEmailAndPasswordAndLogout,
    logout,
    fetchCurrentUser
};
