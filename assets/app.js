function login() {
  const loginForm = document.getElementById('loginForm')

  loginForm.onsubmit = (event) => {
    event.preventDefault()
    const form = document.forms['login']
    const login = form.login.value
    const password = form.password.value

    request(`/api/token?id=${login}&password=${password}`, 'GET')
      .then(response => {
        console.log({ response })
      })
      .catch(error => {
        console.log({ error })
      })
  }
}

function signup() {
  const signupForm = document.getElementById('signupForm')

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
            window.location = '/dashboard'
          })
      })
  }
}

document.addEventListener('readystatechange', () => {
  signup()
  login()

})

const request = (url, method, body) => new Promise((resolve, reject) => {
  if (!url) { throw 'Cant make request, missing url!' }

  fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(response => resolve(response))
    .catch(response => {
      console.log('CATCH', { response })
    })
})