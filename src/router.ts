import * as http from 'http'
import { RouteOutput, RouteHandler } from './interfaces'
import Method from './consts/methods'
import routes from './routes'

/**
 * Main Application router
 * Takes path and method and matches it to correct handler
 */
const router = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Method, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    // Function that accepts incomming data and performs action
    const handler: RouteHandler = routes[path][method]
    // in case we can't match anything inform user
    if (!handler) {
        return { responseStatus: 404, response: { msg: 'Can\'t find requested route!' } }
    }
    // here we are performing action due to requested handler
    const output: RouteOutput = await handler(parsedBody, parsedQuery, req, res)
    return output
}

export default router