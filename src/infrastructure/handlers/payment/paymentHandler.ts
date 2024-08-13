import { PaymentProvider } from "../../externals/PaymentProvider";
import { PaymentUseCase } from "../../../application/use-cases/payment.use-case";

const paymentProvider = new PaymentProvider();
const paymentUseCase = new PaymentUseCase(paymentProvider);

export const handler: any = async (event) => {
  try {
    const { amount } = JSON.parse(event.body || "{}");

    if (!amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid input" }),
      };
    }

    const resp = await paymentUseCase.createPayment(amount);
    console.log(resp);
    return {
      statusCode: 201,
      body: JSON.stringify(resp),
    };
  } catch (error) {
    console.error("Error handling transaction:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
