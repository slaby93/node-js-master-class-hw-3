import db from "./db";

const TEMPLATE_FOLDER = '../src/template'


const templateUtils = {
  loadTemplate: async (filename: string) => {
    const file = db.load(TEMPLATE_FOLDER, filename)
    return file
  }
}

export default templateUtils