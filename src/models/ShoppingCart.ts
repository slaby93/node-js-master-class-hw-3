import db from "../utils/db";

export interface IShoppingCartItem {
  name?: string,
  price?: number,
  id: string,
  quantity: number,
}

/**
 * Model for uer Shopping Cart.
 */
class ShoppingCart {
  static FOLDER = 'shopping_cart'

  userId: string
  id: string
  items: [IShoppingCartItem]

  save = async () => {
    const serializedCart = ShoppingCart.serialize(this)
    await db.save(ShoppingCart.FOLDER, this.userId, serializedCart)
  }

  update = async () => {
    const serializedCart = ShoppingCart.serialize(this)
    await db.update(ShoppingCart.FOLDER, this.userId, serializedCart)
  }

  load = async () => {
    const data: string = await db.load(ShoppingCart.FOLDER, this.userId)
    const deserializedCart: ShoppingCart = ShoppingCart.deserialize(data)
    this.id = deserializedCart.id
    this.items = deserializedCart.items
    this.userId = deserializedCart.userId
  }

  delete = async () => {
    await db.delete(ShoppingCart.FOLDER, this.userId)
  }

  static serialize = (cart: ShoppingCart): string => {
    const { userId, id, items } = cart
    return JSON.stringify({
      userId,
      id,
      items
    })
  }

  static deserialize = (input: string): ShoppingCart => {
    const parsedData: ShoppingCart = JSON.parse(input)
    const cart = new ShoppingCart()
    cart.id = parsedData.id
    cart.userId = parsedData.userId
    cart.items = parsedData.items
    return cart
  }
}

export default ShoppingCart