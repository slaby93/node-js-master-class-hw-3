import * as https from 'https'
import { StringDecoder } from 'string_decoder'
import * as querystring from 'querystring'
import { IncomingMessage } from 'http'
import config from './../config'
import logger from './logger';

export default {
  pay: (orderId: string, token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const payload = querystring.stringify({
          amount: 100,
          currency: 'usd',
          description: 'test payment',
          source: token
        })
        const req = https.request({
          host: config.STRIPE.URL,
          path: '/v1/charges',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload, 'utf8'),
            'Authorization': `Bearer ${config.STRIPE.SECRET_KEY}`
          }
        }, (response: IncomingMessage) => {
          let buffer = ''
          const decoder = new StringDecoder('utf8')
          response.on('data', function (data) {
            buffer += decoder.write(data)
          });
          response.on('end', () => {
            buffer += decoder.end()
            const response = JSON.parse(buffer)
            const { status } = response
            const success: boolean = response.captured && (status === 'succeeded') && !response.error ? true : false
            logger.log('Payment', { success })
            resolve(success)
          })
        })
        req.write(payload);
        req.end()

      } catch (error) {
        logger.error({ error })
        reject(error)
      }
    })
  }
}
