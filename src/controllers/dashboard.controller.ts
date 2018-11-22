import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class DashboardController implements Controller {
  static TEMPLATE = 'dashboard.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    const data = {
      'head.title': 'Dashboard'
    }
    this.template = await templateUtils.loadTemplate(DashboardController.TEMPLATE)
    this.template = templateUtils.interpolate(this.template, data)
    return {
      html: this.template, data
    }
  }
}

export default DashboardController