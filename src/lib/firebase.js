// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// ค่า Config ที่คุณได้มาสำหรับโปรเจกต์ ravit-showcase
const firebaseConfig = {
  apiKey: "AIzaSyCkYks1SDLDnD3MLCnQ8jlr6ytEeccq-JM",
  authDomain: "ravit-showcase.firebaseapp.com",
  projectId: "ravit-showcase",
  storageBucket: "ravit-showcase.firebasestorage.app",
  messagingSenderId: "739205578050",
  appId: "1:739205578050:web:0909ae138e2e0a14e31cdb",
  measurementId: "G-PHRCXWT23C"
};

// Initialize Firebase (ใช้ Logic ป้องกันการ Init ซ้ำเหมือนต้นฉบับ)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// สร้างตัวแปรส่งออกไปให้หน้าบ้านและหน้า Admin ใช้งาน
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };