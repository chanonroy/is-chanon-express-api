import express from "express"
import expressWinston from "express-winston"
import { createServer, Server } from "http"
import { AddressInfo } from "net"
import healthcheckHandler from "./controllers/healthcheck"
import isChanonService from "./controllers/isChanon"
import logger from "./logger"

const app = express()

app.use(
  expressWinston.logger({
    level: "info",
    format: logger.format,
    transports: logger.transports,
  })
)

app.use(
  expressWinston.errorLogger({
    level: "error",
    format: logger.format,
    transports: logger.transports,
  })
)

app.get("/ask", isChanonService)
app.get("/health", healthcheckHandler)

let server: Server | null = null
export const start = async (): Promise<void> => {
  if (server !== null) return

  server = createServer(app)
  await new Promise<void>((resolve): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    server!.listen(
      parseInt(process.env.HTTP_PORT ?? "3000", 10),
      "0.0.0.0",
      () => resolve()
    )
  })

  const address = server.address() as AddressInfo
  logger.info(`🚀 Listening on ${address.address}:${address.port}`)
}

export const stop = async (): Promise<void> => {
  if (server === null) return

  await new Promise<void>((resolve, reject): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    server!.close(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  server = null
  logger.info("Stopped listening")
}
