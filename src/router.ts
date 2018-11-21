import * as http from 'http'
import { RouteOutput, RouteHandler } from './interfaces'
import Method from './consts/methods'
import apiRoutes from './routes'
import HTMLGlobalController from './controllers'
import db from './utils/db';

/**
 * Main Application router
 * Takes path and method and matches it to correct handler
 */
const router = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Method, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    switch (true) {
        case /^\/api\/*/.test(path): {
            return await matchAPIHandler(path, query, parsedBody, parsedQuery, method, req, res)
        }
        case /^\/assets\/*/.test(path): {
            return await matchAssetsHandler(path, query, parsedBody, parsedQuery, method, req, res)
        }
        default: {
            return await matchHTMLHandler(path, query, parsedBody, parsedQuery, method, req, res)
        }
    }
}

const matchAPIHandler = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Method, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    const handler: RouteHandler = apiRoutes[path] && apiRoutes[path][method]
    if (!handler) {
        return { responseStatus: 404, response: { msg: 'Can\'t find requested API route!' } }
    }
    const output: RouteOutput = await handler(parsedBody, parsedQuery, req, res)
    return output
}

const matchHTMLHandler = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Method, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    if (!HTMLGlobalController.doesRouteExists(path)) {
        //@TODO RETURN 404 page
        return { responseStatus: 404, response: { msg: 'Can\'t find requested HTML route!' } }
    }
    const response: RouteOutput = await HTMLGlobalController.process(path, query, parsedBody, parsedQuery, method, req, res)
    return response
}

const matchAssetsHandler = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Method, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    const extension: string = (/\.\w+$/gm).exec(path)[0].substr(1) // css, jpeg etc
    const filename: string = (/[a-zA-Z]*\.\w*$/gm).exec(path)[0]
    const file: string = await db.load('./../assets/', filename)
    if (!file) {
        return { responseStatus: 404, response: { msg: 'Can\'t find requested file route!' } }
    }
    let contentType: string = ''
    switch (true) {
        case 'css' === extension:
            contentType = 'text/css'
            break
        case ['jpeg', 'jpg', 'png'].includes(extension):
            contentType = `image/${extension}`
            break
        case 'js' === extension:
            contentType = 'application/javascript'
            break
        default:
            contentType = 'plain'
    }
    res.setHeader('Content-type', contentType)

    return { responseStatus: 200, response: file }
}

export default router