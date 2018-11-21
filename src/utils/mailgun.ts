import * as https from 'https'
import * as querystring from 'querystring'
import { IncomingMessage } from 'http'
import { StringDecoder } from 'string_decoder'
import User from '../models/User'
import config from './../config'
import logger from './logger';

export default {
  sendEmail: (user: User): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const payload = querystring.stringify({
          from: 'Mailgun Sandbox <postmaster@sandboxd0e6fac8a63b4f97a34bfc1df0137843.mailgun.org>',
          to: `${user.name} <${user.email}>`,
          subject: 'Your order is accepted!',
          text: `Congratulations ${user.name}, you just helped Nigerian prince! Thanks!`,
        })
        const request = https.request({
          host: config.MAILGUN.URL,
          path: config.MAILGUN.DOMAIN,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload, 'utf8'),
          },
          auth: config.MAILGUN.AUTH
        }, (response: IncomingMessage) => {
          let buffer = ''
          const decoder = new StringDecoder('utf8')
          response.on('data', function (data) {
            buffer += decoder.write(data)
          });
          response.on('end', () => {
            buffer += decoder.end()
            const response = JSON.parse(buffer)
            const success = !!response.id
            logger.log('Mailgun', { success })
            resolve(success)
          })
        })
        request.write(payload)
        request.end()
      } catch (error) {
        logger.error({ error })
        reject(error)
      }
    })
  }
}