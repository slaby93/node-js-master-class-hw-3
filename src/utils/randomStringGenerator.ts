const randomStringGenerator = (() => {
  const alphabet = 'abcdefghijklmnoprstuvwxyz0123456789'
  const generateRandomCharacter = (): string => alphabet[Number.parseInt(((Math.random() * 100) % alphabet.length).toFixed(0))]

  return (length: number): string => {
    let result = ''
    for (let index = 0; index < length; index++) {
      result += generateRandomCharacter()
    }
    return result
  }
})()

export default randomStringGenerator