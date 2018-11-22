import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class IndexController implements Controller {
  static TEMPLATE = 'index.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    const data = {
      a: 5,
      b: 7,
      c: 12,
      'head.title': 'Homepage'
    }
    this.template = await templateUtils.loadTemplate(IndexController.TEMPLATE)
    this.template = templateUtils.interpolate(this.template, data)
    return {
      html: this.template, data
    }
  }
}

export default IndexController