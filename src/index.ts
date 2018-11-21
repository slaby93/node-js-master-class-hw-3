import Server from './server'
import config from './config'

// Main entry of aplpication
const app = {
  initialize: () => {
    // create and start server
    new Server()
      .start(config.PORT)
  }
}

app.initialize()
