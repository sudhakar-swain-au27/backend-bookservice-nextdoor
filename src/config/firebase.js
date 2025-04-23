// src/config/firebase.js
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_CREDENTIALS, 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
