import { CHARS_TO_GENERATE_ID, SPLIT_CHAR } from "./helpers/utils-helpers.mjs";

export const handler = async (event) => {
  console.log("Evento recibido:", JSON.stringify(event));
  try {
    const { userId, amount, isActive } = event;

    if (!isActive)
      throw new Error("Transacción desnegada por inactividad de usuario");

    return {
      paymentSuccess: true,
      userId,
      amount,
      transactionId: generateTrxId()
    };
  } catch (error) {
    console.error(`Error al procesar el pago: ${error}`);
    return {
      paymentSuccess: false,
      error: error.message
    };
  }
};

export const generateTrxId = () => {
  let trxId = "";
  const segments = [8, 4, 4, 4, 12];
  segments.forEach((length, index) => {
    for (let i = 0; i < length; i++)
      trxId += CHARS_TO_GENERATE_ID.charAt(
        Math.floor(Math.random() * CHARS_TO_GENERATE_ID.length)
      );

    if (index < segments.length - 1) trxId += SPLIT_CHAR;
  });

  return trxId;
};
