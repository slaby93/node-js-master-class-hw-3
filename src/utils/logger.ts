export default {
  log: (...args: any[]) => {
    console.log('LOGGER:', ...args)
  },
  error: (...args: any[]) => {
    console.error('LOGGER:', ...args)
  }
}