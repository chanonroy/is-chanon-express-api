import express from "express"
import expressWinston from "express-winston"
import logger from "./logger"
import { createServer, Server } from "http"
import { AddressInfo } from "net"

const port = 3000
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

let server: Server | null = null
export const start = async () => {
  if (server !== null) return

  server = createServer(app)
  await new Promise<void>((resolve): void => {
    server!.listen(
      parseInt(process.env.HTTP_PORT ?? "3001", 10),
      "0.0.0.0",
      () => resolve()
    )
  })

  const address = server.address() as AddressInfo
  logger.info(`🚀 Listening on ${address.address}:${address.port}`)
}

export const stop = async () => {
  if (server === null) return

  await new Promise<void>((resolve, reject): void => {
    server!.close((err: any) => {
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
