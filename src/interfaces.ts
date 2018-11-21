import * as http from 'http'

export interface RouteHandler {
    (path: string, query: string, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput>,
}

export interface RouteOutput {
    responseStatus: number,
    response?: any,
}

export interface Endpoint {
    [index: string]: RouteHandler
}