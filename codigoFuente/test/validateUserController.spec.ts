import { validateUser } from "../src/user/infrastructure/controller/validateUserController";
import { TransactionDTO } from "../src/user/domain/dto/transactionDto";
import mocked = jest.mocked;
import { BadRequestError } from "../src/helper/utils/BadRequestError";
import { transaction } from "./mocks/events/transactionEventMock";
import { UserService } from "../src/user/application/UserService";

jest.mock("../src/user/application/UserService");

describe("validateUserController", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("validate userId where process ok", async () => {
    mocked(UserService.prototype.validateUserId).mockResolvedValueOnce(true);

    const result = await validateUser(transaction as TransactionDTO);

    console.log(result);

    expect(UserService.prototype.validateUserId).toHaveBeenCalledWith(
      "f529177d-0521-414e-acd9-6ac840549e97"
    );
  });

  test("validate userId where have Error BadRequest", async () => {
    mocked(UserService.prototype.validateUserId).mockResolvedValueOnce(false);
    const mockError = new BadRequestError("userId doesnt found");
    let transactionDto = {} as TransactionDTO;
    try {
      await validateUser(transactionDto);
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
