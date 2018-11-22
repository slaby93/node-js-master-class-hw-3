import db from './../utils/db'

class User {
  static FOLDER = 'user'

  name: string
  email: string
  address: string
  id: string
  password: string

  save = async () => {
    const serializedUser = User.serialize(this)
    await db.save(User.FOLDER, this.id, serializedUser)
  }

  update = async () => {
    const serializedUser = User.serialize(this)
    await db.update(User.FOLDER, this.id, serializedUser)  
  }

  load = async () => {
    const data: string = await db.load(User.FOLDER, this.id)
    const deserializedUser: User = User.deserialize(data)
    this.id = deserializedUser.id
    this.email = deserializedUser.email
    this.address = deserializedUser.address
    this.name = deserializedUser.name
    this.password = deserializedUser.password
  }

  delete = async () => {
    await db.delete(User.FOLDER, this.id)
  }

  private static serialize = (user: User): string => {
    const { name, email, address, id, password } = user
    return JSON.stringify({
      name,
      email,
      address,
      id,
      password
    })
  }

  private static deserialize = (input: string): User => {
    const parsedData: User = JSON.parse(input)
    const user = new User()
    user.id = parsedData.id
    user.email = parsedData.email
    user.address = parsedData.address
    user.name = parsedData.name
    user.password = parsedData.password
    return user
  }

}

export default User