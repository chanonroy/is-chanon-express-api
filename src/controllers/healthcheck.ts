import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export default (_: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true })
}
