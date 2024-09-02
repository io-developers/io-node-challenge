export interface Transaction {
    source: string;
    id: string;
    data: {
        accountId: string;
        amount: number;
    };
}