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

document.addEventListener('readystatechange', () => {
  signup()
  login()
  logout()
  accountSettings()
})

const request = (url, method, body) => new Promise((resolve, reject) => {
  if (!url) { throw 'Cant make request, missing url!' }

  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')

  fetch(url, {
    method,
    body: body ? JSON.stringify({ ...body, id: userId }) : undefined,
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  })
    .then(response => response.json())
    .then(response => resolve(response))
    .catch(response => {
      console.log('CATCH', { response })
      reject(response)
    })
})