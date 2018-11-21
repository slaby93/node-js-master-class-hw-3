import * as http from 'http';
import Methods from "../consts/methods";
import { RouteOutput } from '../interfaces';
import indexController from './index.controller'

export interface Controller {
  template: string,
  render: (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => any
}

class GlobalController {
  static endpoints: { [index: string]: any } = {
    '/': indexController
  }
  private static _instance: GlobalController

  private constructor() { }

  public doesRouteExists = (path: string) => {
    return GlobalController.endpoints[path]
  }
  public process = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    const Controller = GlobalController.endpoints[path]
    if (!Controller) {
      return { responseStatus: 404 }
    }
    const instance = new Controller()
    let bodyOutput: string = await instance.render(path, query, parsedQuery, parsedBody, method)
    res.setHeader('Content-type', 'text/html')

    return {
      responseStatus: 200,
      response: `
        <html>
          <body>
            ${bodyOutput}
          </body>
        </html>
      `
    }
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

}

export default GlobalController.Instance