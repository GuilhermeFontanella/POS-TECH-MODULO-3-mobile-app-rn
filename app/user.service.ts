import axios from 'axios';

class UserService {
    baseUrl: string = 'https://68d0a48fe6c0cbeb39a216b9.mockapi.io/byte-bank';


    async getAccountInfo() {
        try {
            const response = await axios.get(`${this.baseUrl}/users/1`);
            return response.data;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async getUserTransactions(userId: number) {
        try {
            const response = await axios.get(`${this.baseUrl}/user-transactions`);
            const resultsByUserId: any[] = response.data.filter((element: any) => element?.userId === userId);
            const resultsSorted: any[] = resultsByUserId.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return resultsSorted
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async registerNewTransaction(data: any) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/user-transactions`,
                data
            );
            return response.status;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async editTransaction(data: any) {
        try {
            const response = await axios.put(
                `${this.baseUrl}/user-transactions/${data.id}`,
                data
            );
            return response.status;
        } catch (error: any) {
            throw new Error(error);
        }
    }
}

export default UserService;