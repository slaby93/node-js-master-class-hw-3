function login() {
  const loginForm = document.getElementById('loginForm')
  if (!loginForm) { return }

  loginForm.onsubmit = (event) => {
    event.preventDefault()
    const form = document.forms['login']
    const login = form.login.value
    const password = form.password.value

    request(`/api/token?id=${login}&password=${password}`, 'GET')
      .then(({ token }) => {
        localStorage.setItem('token', token.token)
        localStorage.setItem('userId', login)
        window.location = '/dashboard'
      })
      .catch(error => {
        console.log({ error })
      })
  }
}

function logout() {
  const logoutButton = document.getElementById('logout')
  if (!logoutButton) { return }

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    window.location = '/'
  })
}

function signup() {
  const signupForm = document.getElementById('signupForm')
  if (!signupForm) { return }

  signupForm.onsubmit = (event) => {
    event.preventDefault()
    const form = document.forms['signup']
    const name = form.name.value
    const email = form.email.value
    const address = form.address.value
    const password = form.password.value

    request(`/api/user`, 'POST', {
      name,
      email,
      address,
      password
    })
      .then(user => {
        request(`/api/token`, 'POST', {
          id: user.id,
          password
        })
          .then(({ token }) => {
            localStorage.setItem('token', token)
            localStorage.setItem('userId', user.id)
            window.location = '/dashboard'
          })
      })
  }
}

function accountSettings() {
  const form = document.forms['accountSettings']

  if (!form) { return }

  form.onsubmit = event => {
    event.preventDefault()
    const name = form.name.value
    const email = form.email.value
    const address = form.address.value

    request(`/api/user`, 'PUT', {
      name,
      email,
      address,
    })
  }

  const userId = localStorage.getItem('userId')

  // fetch and show data
  request(`/api/user?id=${userId}`, 'GET')
    .then(user => {
      form.name.value = user.name
      form.address.value = user.address
      form.email.value = user.email
    })
}

function dashboard() {
  const userId = localStorage.getItem('userId')
  const cart = document.getElementById('cart')
  if(!cart) { return }
  const list = document.getElementById('availableItems')
  let cartItemsList = {}
  let itemsList = []
  let orderId = null

  const fetchOrderId = () => {
    request(`/api/order?id=${userId}`, 'GET')
    .then((response) => {
      orderId = response.order.id
    })
}

  const renderCart = () => {
    cart.innerHTML = ''
    let totalPrice = 0
    Object.entries(cartItemsList).forEach(([key, quantity]) => {
      const item = itemsList.find(item => item.id === key)
      if (!item) { return }
      const element = document.createElement('li')
      element.innerHTML = `
        <span>Name: ${item.name}<span>      
        <span>Quantity: ${quantity}<span>      
        <span>Total price: ${quantity * item.price}<span>      
      `
      cart.appendChild(element)
      totalPrice += quantity * item.price
    })

    const element = document.createElement('li')
    element.innerHTML = `
      <span>Total cart price: ${totalPrice}<span>      
    `
    cart.appendChild(element)

  }


  document
    .getElementById('new-cart')
    .addEventListener('click', () => {
      request('/api/cart', 'POST')
    })

  document
    .getElementById('remove-cart')
    .addEventListener('click', () => {
      request('/api/cart', 'DELETE')
    })

  document
    .getElementById('payment')
    .addEventListener('click', () => {
      console.log({ orderId })

      request('/api/payment', 'POST', {
        orderId,
        token: 'tok_visa'
      })
    })

  document
    .getElementById('order')
    .addEventListener('click', () => {
      request('/api/order', 'POST')
    })

  document
    .getElementById('update-cart')
    .addEventListener('click', () => {
      let update = {
        items: Object.entries(cartItemsList).map(([key, quantity]) => {
          return {
            id: key,
            quantity
          }
        })
      }

      request('/api/cart', 'PUT', update)
    })

  window.onCartClick = (action, name, price, id) => {
    if (action === 'ADD') {
      if (!cartItemsList[id]) {
        cartItemsList[id] = 0
      }

      cartItemsList[id] += 1
    } else {
      if (cartItemsList[id] > 0) {
        cartItemsList[id] -= 1
      } else {
        delete cartItemsList[name]
      }
    }
    renderCart()
  }

  // fetch menu items
  request(`/api/menu?id=${userId}`, 'GET')
    .then(({ menu: { items } }) => {
      itemsList = items
      list.innerHTML = ''
      items.forEach(item => {
        const element = document.createElement('li')

        element.innerHTML = `
          <div>
            <span>Name: ${item.name}</span>
            <span>Price: ${item.price}</span>
          </div>
          <div>
            <button onclick={window.onCartClick('ADD','${item.name}','${item.price}','${item.id}')}>ADD</button>
            <button onclick={window.onCartClick('REMOVE','${item.name}','${item.price}','${item.id}')}>REMOVE</button>
          </div>
        `
        list.appendChild(element)
      })
      fetchCart()
      fetchOrderId()
    })

  const fetchCart = () => {
    // fetch CART
    request(`/api/cart?id=${userId}`, 'GET')
      .then((response) => {
        if (response.err) {
          return cart.innerHTML = `
       <h2>No existing cart</h2>
      `
        }
        if (response.cart.items) {
          response.cart.items.forEach(({ id, quantity }) => {
            cartItemsList[id] = quantity
          })
        }
        renderCart()
      })
  }

}

document.addEventListener('DOMContentLoaded', () => {
  signup()
  login()
  logout()
  accountSettings()
  dashboard()
})

const request = (url, method, body) => new Promise((resolve, reject) => {
  if (!url) { throw 'Cant make request, missing url!' }

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  fetch(url, {
    method,
    body: body ? JSON.stringify({ ...body, id: userId }) : method === 'POST' ? JSON.stringify({ id: userId }) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  })
    .then(response => response.json())
    .then(response => resolve(response))
    .catch(response => {
      reject(response)
    })
})