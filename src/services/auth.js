export function login(token) {
  localStorage.beerToken = token
  return token
}

export function current() {
  if(!localStorage.beerToken) return
  try {
    return JSON.parse(atob(localStorage.beerToken.split('.')[1]))
  } catch(e) {
    return
  }
}

export function logout() {
  delete localStorage.beerToken
  // Consider using a router to do this redirect for best user experience
  window.location = '/'
}
