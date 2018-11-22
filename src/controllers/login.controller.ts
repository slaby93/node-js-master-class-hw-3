import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class LoginController implements Controller {
  static TEMPLATE = 'login.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    const data = {
      'head.title': 'Login'
    }
    this.template = await templateUtils.loadTemplate(LoginController.TEMPLATE)
    this.template = templateUtils.interpolate(this.template, data)
    return {
      html: this.template, data
    }
  }
}

export default LoginController