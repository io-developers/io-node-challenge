
export interface PaymentRequest {
  accountId: string;
  amount: number;
}

export interface PaymentResponse {
    source: string;
    id: string;
    data:{
        accountId: string,
        amount: number
    }
}
