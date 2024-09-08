import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { AccountController } from "./hexagonal/account/interface/AccountController";

const controller = new AccountController();
const app = express();

app.use(express.json());

app.get("/v1/accounts/:id", controller.getOne);
app.post("/v1/accounts", controller.create);
app.put("/v1/accounts", controller.update);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something was wrong" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
