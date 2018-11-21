import * as crypto from 'crypto'
import config from '../config';

// Create hashed string from password
export default (password: string): string => {
  return crypto
    .createHmac('sha256', config.PASSWORD_SALT)
    .update(password)
    .digest('hex')
}