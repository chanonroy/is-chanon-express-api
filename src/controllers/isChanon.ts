import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import isChanon from "is-chanon"

export default (req: Request, res: Response): Response => {
  const query = req.query.q

  if (!query || typeof query !== "string") {
    return res.send(StatusCodes.BAD_REQUEST)
  }

  const result = isChanon(query)
  return res.status(StatusCodes.OK).json({ success: result })
}
