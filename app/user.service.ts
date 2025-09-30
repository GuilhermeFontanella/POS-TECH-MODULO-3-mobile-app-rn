// // services/TransactionService.ts
// import { db } from '@/firebase/config';
// import {
//   collection,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   getDocs,
//   serverTimestamp,
//   getDoc,
// } from 'firebase/firestore';

// export interface Category {
//   description: string;
//   amount: number;
// }

// export interface Transaction {
//   id?: string;
//   descricao: string;
//   categoria: Category[];
//   createdAt?: any;
// }


// export interface AccountInfo {
//   id?: string;
//   name: string;
//   email: string;
//   balance: number;
//   [key: string]: any;
// }

// class UserService {
//   async getUserAccountInfo(accountId: string): Promise<AccountInfo> {
//     try {
//       const accountRef = doc(db, "accountInfo", accountId);
//       const snapshot = await getDoc(accountRef);

//       if (!snapshot.exists()) {
//         throw new Error("Conta não encontrada");
//       }

//       return { id: snapshot.id, ...snapshot.data() } as AccountInfo;
//     } catch (error: any) {
//       throw new Error("Erro ao buscar dados da conta: " + error.message);
//     }
//   }
// }

// export default new UserService();



import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { User, AccountInfo, Transaction } from "./types";
import { db } from "@/firebase/config";

const UserService = {

  async getUserByAccountId(accountId: number): Promise<User[]> {
    const q = query(collection(db, "users"), where("accountId", "==", accountId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))as unknown as User[];
  },

  async getAccountInfo(accountId: string): Promise<AccountInfo | null> {
    const q = query(collection(db, "accountInfo"), where("accountId", "==", accountId));
    const snapshot = await getDocs(q);
    const docSnap = snapshot.docs[0];
    return docSnap ? ({ id: docSnap.id, ...docSnap.data() } as unknown as AccountInfo) : null;
  },

  async getTransactionsByMonth(month: string): Promise<Transaction[]> {
    const q = query(collection(db, "transactions"), where("month", "==", month));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as Transaction[];
  },
};

export default UserService;