import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class SignupController implements Controller {
  static TEMPLATE = 'signup.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    const data = {
      'head.title': 'Signup'
    }
    this.template = await templateUtils.loadTemplate(SignupController.TEMPLATE)
    this.template = templateUtils.interpolate(this.template, data)
    return {
      html: this.template, data
    }
  }
}

export default SignupController