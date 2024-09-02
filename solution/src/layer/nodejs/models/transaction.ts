export interface Transaction {
  source: string;
  id: number;
  data: {
      accountId: string;
      amount: number;
  };
}