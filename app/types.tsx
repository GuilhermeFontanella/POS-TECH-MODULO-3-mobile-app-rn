export interface User {
  id: string;
  name: string;
  birthDay: string;
  accountId: string;
}

export interface AccountInfo {
  id: string;
  accountId: string;
  balance: string;
  transactions: string[];
}

export interface Category {
  id: string;
  description: string;
  date: string;
  type: "income" | "expense" | "transfer";
  amount: string;
}

export interface Transaction {
  id: string;
  month: string;
  categoria: Category[];
}
