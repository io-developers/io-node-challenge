export interface Account {
    accountId?: string,
    amount?: number
}

export interface Transaction {
    source?: string;
    id?: number;
    data?: Account;
}