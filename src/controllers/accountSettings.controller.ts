import templateUtils from './../utils/templates'
import Methods from "../consts/methods";
import { Controller } from ".";

class AccountSettingsController implements Controller {
  static TEMPLATE = 'accountSettings.html'
  template: string

  render = async (path: string, query: string, parsedBody: any, parsedQuery: any, method: Methods) => {
    const data = {
      'head.title': 'Account Settings'
    }
    this.template = await templateUtils.loadTemplate(AccountSettingsController.TEMPLATE)
    this.template = templateUtils.interpolate(this.template, data)
    return {
      html: this.template, data
    }
  }
}

export default AccountSettingsController