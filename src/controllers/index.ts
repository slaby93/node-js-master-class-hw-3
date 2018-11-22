import * as http from 'http';
import Methods from "../consts/methods";
import { RouteOutput } from '../interfaces';
import indexController from './index.controller'
import loginController from './login.controller'
import signupController from './signup.controller'
import dashboardController from './dashboard.controller'
import accountSettingsController from './accountSettings.controller'
import templateUtils from './../utils/templates'

export interface Controller {
  template: string,
  render: (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => any
}

class GlobalController {
  static endpoints: { [index: string]: any } = {
    '/': indexController,
    '/login': loginController,
    '/signup': signupController,
    '/dashboard': dashboardController,
    '/accountSettings': accountSettingsController,
  }
  private static _instance: GlobalController

  private constructor() { }

  public doesRouteExists = (path: string) => {
    return GlobalController.endpoints[path]
  }

  private _head = async (data: any) => {
    const template = await templateUtils.loadTemplate('_head.html')
    return templateUtils.interpolate(template, data)
  }

  private _header = async (data: any) => {
    const template = await templateUtils.loadTemplate('_header.html')
    return templateUtils.interpolate(template, data)
  }

  private _footer = async (data: any) => {
    const template = await templateUtils.loadTemplate('_footer.html')
    return templateUtils.interpolate(template, data)
  }

  private _notFound = async () => {
    return await templateUtils.loadTemplate('_404.html')
  } 

  static globalData = {
    'head.title': 'DS'
  }

  public process = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods, req: http.IncomingMessage, res: http.ServerResponse): Promise<RouteOutput> => {
    const Controller = GlobalController.endpoints[path]
    if (!Controller) {
      return { responseStatus: 404 }
    }
    const instance = new Controller()
    const { html, data } = await instance.render(path, query, parsedQuery, parsedBody, method)
    const extendedData = { ...GlobalController.globalData, ...data }
    const _head = await this._head(extendedData)
    const _header = await this._header(extendedData)
    const _footer = await this._footer(extendedData)

    res.setHeader('Content-type', 'text/html')

    return {
      responseStatus: 200,
      response: `
        <html>
          ${_head}
          <body>
            ${_header}
            <section class="bodyContent">
              ${html}
            </section>
            ${_footer}
          </body>
        </html>
      `
    }
  }

  public notFound = async () => {
    const extendedData = { ...GlobalController.globalData }

    const _head = await this._head(extendedData)
    const _header = await this._header(extendedData)
    const _footer = await this._footer(extendedData)
    const _404 = await this._notFound()

    return {
      responseStatus: 200,
      response: `
        <html>
          ${_head}
          <body>
            ${_header}
            <section class="bodyContent">
              ${_404}
            </section>
            ${_footer}
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