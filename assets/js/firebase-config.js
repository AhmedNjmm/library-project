// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// إعدادات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJq89s9gs3lGKj1eKM0eDD0Mein6mmm50",
  authDomain: "library-project-f63b0.firebaseapp.com",
  projectId: "library-project-f63b0",
  storageBucket: "library-project-f63b0.firebasestorage.app",
  messagingSenderId: "91581535655",
  appId: "1:91581535655:web:380c1e059ab48008855282"
};

// تهيئة التطبيق وربط Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
