
const NODE_ENV = process.env.NODE_ENV || 'development'

interface IConfig {
  PORT: number,
  PASSWORD_SALT: string,
  MAILGUN: {
    URL: string,
    DOMAIN: string,
    AUTH: string,
  },
  STRIPE: {
    URL: string,
    SECRET_KEY: string,
  }
}

const config: { [index: string]: IConfig, } = {
  production: {
    PORT: 5000,
    PASSWORD_SALT: '',
    MAILGUN: {
      URL: 'api.mailgun.net',
      DOMAIN: '',
      AUTH: '',
    },
    STRIPE: {
      URL: 'api.stripe.com',
      SECRET_KEY: '',
    }
  },
  development: {
    PORT: 3000,
    PASSWORD_SALT: '',
    MAILGUN: {
      URL: 'api.mailgun.net',
      DOMAIN: '',
      AUTH: '',
    },
    STRIPE: {
      URL: 'api.stripe.com',
      SECRET_KEY: '',
    }
  }
}

export default {
  ...(config[NODE_ENV] || config.development),
  NODE_ENV
}