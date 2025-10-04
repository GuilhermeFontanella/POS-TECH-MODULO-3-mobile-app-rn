// TransactionService.ts
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useEffect } from "react";


export interface Category {
  id: string;
  description: string;
  date: string;
  type: "income" | "expense" | "transfer";
  amount: number;
}

export interface Transaction {
  id: string;
  month: string;
  categoria: Category[];
  createdAt?: Date;
}
export interface User {
  id: string;
  name: string;
  birthDay: string;
  accountId: string;
}

class TransactionService {
  private collectionRef = collection(db, "transactions");

  async populateFirebase() {

    
// USERS
// await setDoc(doc(db, "users", "2"), {
//   name: "Maria",
//   birthDay: "01/01/2000",
//   accountId: "1"
// });

// // ACCOUNT INFO
// await setDoc(doc(db, "accountInfo", "2"), {
//   accountId: "1",
//   balance: "2000.00",
//   transactions: []
// });

// TRANSACTIONS
await setDoc(doc(db, "transactions", "2"), {
  month: "Setembro",
  categoria: [
    {
      id: 1,
      description: "Transferência",
      date: "2025-05-02",
      type: "transfer",
      amount: 1700
    },
    {
      id: 3,
      description: "Depósito",
      date: "2025-05-03", 
      type: "income",
      amount: 4500
    },
    {
      id: 3,
      description: "Despesa",
      date: "2025-05-03", 
      type: "income",
      amount: 300
    }
  ]
});
  console.log("🔥 Banco populado com sucesso!");
}


  /** 🔹 Observa transações em tempo real */
  subscribeTransactions(callback: (data: Transaction[]) => void) {
    return onSnapshot(this.collectionRef, (snapshot) => {
      const list: Transaction[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Transaction, "id">),
      }));
      callback(list);
    });
  }

  /** 🔹 Busca única (sem realtime) */
  async getTransactions(): Promise<Transaction[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Transaction, "id">),
    }));
  }

  /** 🔹 Adiciona uma nova transação */
  async addTransaction(transaction: Omit<Transaction, "id" | "createdAt">) {
    return await addDoc(this.collectionRef, {
      ...transaction,
      createdAt: serverTimestamp(),
    });
  }

  /** 🔹 Atualiza uma transação */ 
  async updateTransaction(id: string, data: Partial<Transaction>) {
    if (typeof id !== "string") throw new Error("ID inválido");
    const docRef = doc(db, "transactions", id);
    return await updateDoc(docRef, data);
  }

  /** 🔹 Remove uma transação */
  async deleteTransaction(id: string) {
    if (typeof id !== "string") throw new Error("ID inválido");
    const docRef = doc(db, "transactions", id);
      const snap = await getDocs(this.collectionRef);
    if (!snap) throw new Error("Documento não existe");
    return await deleteDoc(docRef);
  }
  
  /** 🔹 Calcula o total de fundos */
  async getAccountFunds(): Promise<number> {
    const transactions = await this.getTransactions();
    return transactions.reduce((sum, t) => {
      const catTotal = t.categoria?.reduce(
        (catSum, item) => catSum + (item.amount || 0),
        0
      );
      return sum + catTotal;
    }, 0);
  }
}

export default new TransactionService();


