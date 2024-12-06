// utils/setupAdmin.ts
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function setupDefaultAdmin() {
    const email = 'admin@admin.com';
    const password = 'admin123';

    try {
        // Create admin user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add admin role in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: 'admin',
            createdAt: new Date().toISOString()
        });

        console.log('Admin account created successfully');
        return user;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('Admin account already exists');
        } else {
            console.error('Error creating admin account:', error);
        }
    }
}