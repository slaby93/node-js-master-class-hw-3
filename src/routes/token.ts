import * as http from 'http'
import { RouteOutput, Endpoint } from '../interfaces';
import Methods from '../consts/methods';
import randomStringGenerator from '../utils/randomStringGenerator';
import db from '../utils/db';
import User from '../models/User';
import hash from '../utils/hash';

export const TOKEN_FOLDER = 'tokens'
const ONE_HOUR = 1000 * 60 * 60

const handler: Endpoint = {
  /**
   * Returns existing token for user
   * Accepts: id - user id
   * Returns: token
   */
  [Methods.GET]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    try {
      const { id } = queryParamsData
      if (!id) {
        return { responseStatus: 400, response: { err: 'Invalid id field' } }
      }
      const token = await db.load(TOKEN_FOLDER, id)
      const parsedToken = JSON.parse(token)
      return { responseStatus: 200, response: { token: parsedToken } }
    } catch (error) {
      return { responseStatus: 500 }
    }
  },
  /**
   * Create token for user
   * Equivalent to logging
   * Accepts: 
   *    id - user id
   *    password - password matching stored one
   * Returns: token - token which shold be put into header
   */
  [Methods.POST]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    try {
      const { id, password } = bodyData
      if (!id) {
        return { responseStatus: 400, response: { err: 'Invalid id field' } }
      }
      const user = new User()
      user.id = id
      await user.load()
      const hashedReceivedPassword = hash(password)
      if (hashedReceivedPassword !== user.password) {
        return { responseStatus: 401, response: { err: 'Invalid password!' } }
      }

      const token = {
        token: randomStringGenerator(20),
        expirationDate: Date.now() + ONE_HOUR
      }
      await db.save(TOKEN_FOLDER, id, JSON.stringify(token))
      return { responseStatus: 200, response: { token } }
    } catch (error) {
      /**
       * Example how we can be more specific about reason of failure
       */
      let reason = ''
      switch (error.code) {
        case 'EEXIST':
          reason = 'Token already exists.'
          break;
        default:
          reason = 'Can\'t create new token.'
      }
      return { responseStatus: 500, response: { err: reason } }
    }
  },
  /**
   * Update expiration time for token
   * Accepts: id - user id
   * Retruns: updated token
   */
  [Methods.PUT]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    try {
      const { id } = bodyData
      if (!id) {
        return { responseStatus: 400, response: { err: 'Invalid id field' } }
      }
      const token: string = await db.load(TOKEN_FOLDER, id)
      const parsedToken = JSON.parse(token)
      parsedToken.expirationDate += ONE_HOUR
      await db.update(TOKEN_FOLDER, id, JSON.stringify(parsedToken))
      return { responseStatus: 200, response: { token: parsedToken } }
    } catch (error) {
      return { responseStatus: 500, response: { err: 'Error while updating expiration date' } }
    }
  },
  /**
   * Removes token <-> logs out user
   * Accepts: id - user id
   * Returns: -none-
   */
  [Methods.DELETE]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    try {
      const { id } = bodyData
      if (!id) {
        return { responseStatus: 400, response: { err: 'Invalid id field' } }
      }
      await db.delete(TOKEN_FOLDER, id)
      return { responseStatus: 200 }
    } catch (error) {
      return { responseStatus: 500 }
    }
  },
}

export default handler