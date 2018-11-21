import UserHandler from './user'
import TokenHandler from './token'
import MenuHandler from './menu'
import CartHandler from './cart'
import OrderHandler from './order'
import PaymentHandler from './payment'
import { Endpoint } from './../interfaces'

/**
 * Declaration file with possible routes
 */
const routes: { [index: string]: Endpoint } = {
  '/user': UserHandler,
  '/token': TokenHandler,
  '/menu': MenuHandler,
  '/cart': CartHandler,
  '/order': OrderHandler,
  '/payment': PaymentHandler
}

export default routes