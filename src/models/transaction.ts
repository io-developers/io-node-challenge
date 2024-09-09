export interface Transaction {
    source: string; // ID único de la transacción (UUID)
    id: number;     // ID numérico único (timestamp)
    data: {
      accountId: string;  // ID de la cuenta donde se realizó el abono
      amount: number;     // Monto abonado
    };
  }