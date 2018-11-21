import db from "./db";

const TEMPLATE_FOLDER = '../src/template'

const templateUtils = {
  loadTemplate: async (filename: string) => {
    const file = db.load(TEMPLATE_FOLDER, filename)
    return file
  },
  interpolate: (file: string, data: { [index: string]: any }): string => {
    if (!data) { return file }
    let interpolatedString = file
    Object.entries(data)
      .forEach(([key, value]) => {
        interpolatedString = interpolatedString.replace(`{${key}}`, value)
      })
    return interpolatedString
  }
}

export default templateUtils