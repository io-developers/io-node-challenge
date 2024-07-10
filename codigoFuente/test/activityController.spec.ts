import { DynamoDBStreamEvent, Callback, Context } from "aws-lambda";
import { ActivityService } from "../src/activity/application/ActivityService";
import { activityProcess } from "../src/activity/infrastructure/activityController";
import { MockEvent } from "./mocks/events/streamEventMock";
import { NotFoundError } from "../src/helper/utils/NotFoundError";
import { InternalServerError } from "../src/helper/utils/InternalServerError";

jest.mock("../src/activity/application/ActivityService");

describe("registerActivityController", () => {
  let mockCallback: Callback;
  let mockContext: Context;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("register activity en dynamoDB is successfully", async () => {
    const mockActivityService = jest.mocked(ActivityService.prototype);
    mockActivityService.registryActivity.mockResolvedValueOnce(true);

    await activityProcess(
      MockEvent as DynamoDBStreamEvent,
      mockContext,
      mockCallback
    );

    expect(mockActivityService.registryActivity).toHaveBeenCalledWith({
      transactionId: "f529177d-0521-414e-acd9-6ac840549e97",
    });
  });

  test("when not found transactionId in event", async () => {
    const mockActivityService = jest.mocked(ActivityService.prototype);
    mockActivityService.registryActivity.mockResolvedValueOnce(false);
    const mockError = new NotFoundError(`TransactionId is not found`);

    try {
      await activityProcess(
        MockEvent as DynamoDBStreamEvent,
        mockContext,
        mockCallback
      );
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });

  test("when register activity fail", async () => {
    const mockActivityService = jest.mocked(ActivityService.prototype);
    mockActivityService.registryActivity.mockResolvedValueOnce(true);
    const mockError = new InternalServerError(`Error in registering activity`);

    try {
      await activityProcess(
        MockEvent as DynamoDBStreamEvent,
        mockContext,
        mockCallback
      );
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
