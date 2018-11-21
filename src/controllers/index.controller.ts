import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class IndexController implements Controller {
  static TEMPLATE = 'index.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    this.template = await templateUtils.loadTemplate(IndexController.TEMPLATE)
    return this.template
  }
}

export default IndexController