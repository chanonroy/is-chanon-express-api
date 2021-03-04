import logger from "./logger"
import { start as startExpress, stop as stopExpress } from "./server"

const start = async (): Promise<void> => {
  await startExpress()
}

let stopping = false
const stop = async (): Promise<void> => {
  if (!stopping) {
    stopping = true
    let exitCode = 0
    try {
      await stopExpress()
    } catch (e) {
      logger.error(e)
      exitCode = 1
    }
    logger.end()
    process.exit(exitCode)
  }
}

const logErrAndExit = (reason?: Error | null): void => {
  if (reason) {
    logger.error(reason)
  }
  logger.end()
  process.exit(1)
}

process.on("SIGINT", stop)
process.on("SIGTERM", stop)
process.on("unhandledRejection", logErrAndExit)
process.on("uncaughtException", logErrAndExit)

start().catch(logErrAndExit)
