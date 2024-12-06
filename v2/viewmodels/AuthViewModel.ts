// viewmodels/AuthViewModel.ts
import { makeAutoObservable } from "mobx";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

class AuthViewModel {
    user = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async login(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    }

    async register(email: string, password: string) {
        this.loading = true;
        this.error = null;
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    }
}

export const authViewModel = new AuthViewModel();