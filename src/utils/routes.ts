import { IncomingMessage } from "http";
import db from "./db";
import { TOKEN_FOLDER } from "../routes/token";
import logger from "./logger";

export const checkToken = async (req: IncomingMessage, id: string): Promise<boolean> => {
  try {
    const receivedToken = req.headers.token
    const fetchedToken = await db.load(TOKEN_FOLDER, id)
    const { token, expirationDate } = JSON.parse(fetchedToken)

    const isReceivedTokenStillValid = Date.now() < expirationDate
    const isReceivedTokenValid = token === receivedToken
    return isReceivedTokenStillValid && isReceivedTokenValid ? true : false

  } catch (error) {
    logger.error('Invalid token', { error })
    return false
  }
}
