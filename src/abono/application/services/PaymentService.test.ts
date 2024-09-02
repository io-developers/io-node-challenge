import {PaymentService} from "./PaymentService";
import {ProcessPaymentUseCase} from "../use-cases/ProcessPaymentUseCase";
import {Transaction} from "../../domain/entities/Transaction";
import {PaymentGatewayAdapter} from "../../infrastructure/adapters/PaymentGatewayAdapter";
import {TransactionRepository} from "../../domain/repositories/TransactionRepository";

// Mock de ProcessPaymentUseCase
jest.mock("../../use-cases/ProcessPaymentUseCase");

// Mock de las dependencias
const mockTransactionRepository: jest.Mocked<TransactionRepository> = {
  save: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
};

const mockPaymentGateway: jest.Mocked<PaymentGatewayAdapter> = {
  processPayment: jest.fn(),
};

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let processPaymentUseCase: jest.Mocked<ProcessPaymentUseCase>;

  beforeEach(() => {
    // Crear mocks para el caso de uso
    processPaymentUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ProcessPaymentUseCase>;

    // Crear instancia del servicio con el mock del caso de uso
    paymentService = new PaymentService(processPaymentUseCase);
  });

  it("debería ejecutar el pago correctamente y devolver la transacción", async () => {
    // Configurar el mock para que devuelva una transacción exitosa
    const mockTransaction = new Transaction(
        "1234",
        "account-1",
        100,
        "PAYMENT",
        "SUCCESSFUL",
        new Date()
    );
    processPaymentUseCase.execute.mockResolvedValue(mockTransaction);

    // Datos de prueba
    const transactionData = {
      accountId: "account-1",
      amount: 100,
    };

    // Llamar al servicio
    const result = await paymentService.executePayment(transactionData);

    // Verificar el resultado
    expect(result).toEqual(mockTransaction);
    expect(processPaymentUseCase.execute).toHaveBeenCalledWith("account-1", 100);
    expect(processPaymentUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it("debería manejar errores lanzados por el caso de uso", async () => {
    // Configurar el mock para lanzar un error
    processPaymentUseCase.execute.mockRejectedValue(new Error("Payment failed"));

    // Datos de prueba
    const transactionData = {
      accountId: "account-1",
      amount: 100,
    };

    // Llamar al servicio y verificar que lanza el error correcto
    await expect(paymentService.executePayment(transactionData)).rejects.toThrow("Payment failed");

    // Verificar que el caso de uso fue llamado
    expect(processPaymentUseCase.execute).toHaveBeenCalledWith("account-1", 100);
  });
});
