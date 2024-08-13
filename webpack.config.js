import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    transactionHandler:
      "./src/infrastructure/handlers/transaction/transactionHandler.ts",
    paymentHandler: "./src/infrastructure/handlers/payment/paymentHandler.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        // exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  externals: [
    "aws-sdk", // AWS SDK is provided by Lambda execution environment
  ],
};
