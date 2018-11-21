import * as http from 'http'
import { Endpoint, RouteOutput } from '../interfaces'
import Methods from '../consts/methods'
import db from '../utils/db'
import { checkToken } from '../utils/routes';

const MENU_FOLDER = '/'
const MENU_FILE = 'menu.json'

const handler: Endpoint = {
  /**
   * Returns fixed menu item for logged in user
   * Accepts: id - user id
   * Returns: fixed menu list
   */
  [Methods.GET]: async (bodyData: any, queryParamsData: any, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    try {
      const { id } = queryParamsData
      if (!id) {
        return { responseStatus: 400, response: { err: 'Invalid id field' } }
      }
      const isValid = await checkToken(req, id)
      if (!isValid) {
          return { responseStatus: 401, response: { err: 'Not authorized' } }
      }
      // Possible optimization: cache this so that we 
      // don't have to access file each time someone 
      // request,but it's out of scope of this exercise :)
      const menuItems = await db.load(MENU_FOLDER, MENU_FILE)
      const parsedMenuItems = JSON.parse(menuItems)

      return { responseStatus: 200, response: { menu: parsedMenuItems } }
    } catch (error) {
      return { responseStatus: 500, response: { err: 'Error while loading menu items' } }
    }
  }
}

export default handler