import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fresherai-93412.firebaseapp.com",
  projectId: "fresherai-93412",
  storageBucket: "fresherai-93412.firebasestorage.app",
  messagingSenderId: "224608040759",
  appId: "1:224608040759:web:2efcffb7d5d61041d98cb2"
};


const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const provider=new GoogleAuthProvider()

export {auth, provider} 