import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyANM15Anz8fOrbADHLGUk2XsLOodnUNqoM", 
  authDomain: "april13-eval.firebaseapp.com",
  projectId: "april13-eval",
  storageBucket: "april13-eval.appspot.com", 
  messagingSenderId: "1080970254833",
  appId: "1:1080970254833:web:9b7646c86e8b86db914c50",
  measurementId: "G-F2YJEW9PYX"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app); 

const db = getFirestore(app);

export { db  };

console.log(analytics);
