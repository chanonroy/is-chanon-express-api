import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import healthcheck from "."

describe("GET /healthcheck handler", () => {
  it("sets expected response values", () => {
    const response = {} as Response
    response.status = jest.fn().mockReturnValueOnce(response)
    response.json = jest.fn().mockReturnValueOnce(response)

    healthcheck({} as Request, response)

    expect(response.status).toHaveBeenNthCalledWith(1, StatusCodes.OK)
    expect(response.json).toHaveBeenNthCalledWith(1, { success: true })
  })
})
