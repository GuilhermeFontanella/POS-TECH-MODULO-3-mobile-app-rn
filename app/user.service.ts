import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Interface do usuário
export interface User {
  id: string;
  name: string;
  birthDay: string;
  accountId: string;
}

class UserService {
  private collectionRef = collection(db, "users");

  /** 🔹 Observa usuários em tempo real */
  subscribeUsers(callback: (data: User[]) => void) {
    return onSnapshot(this.collectionRef, (snapshot) => {
      const list: User[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<User, "id">),
      }));
      callback(list);
    });
  }

  /** 🔹 Busca única (sem realtime) */
  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<User, "id">),
    }));
  }

  /** 🔹 Busca usuário por ID */
  async getUserById(id: string): Promise<User | null> {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<User, "id">) };
    }
    return null;
  }

  /** 🔹 Adiciona um novo usuário */
  async addUser(user: Omit<User, "id">) {
    return await addDoc(this.collectionRef, user);
  }

  /** 🔹 Atualiza um usuário */
  async updateUser(id: string, data: Partial<User>) {
    const docRef = doc(db, "users", id);
    return await updateDoc(docRef, data);
  }

  /** 🔹 Remove um usuário */
  async deleteUser(id: string) {
    const docRef = doc(db, "users", id);
    return await deleteDoc(docRef);
  }
}

export default new UserService();