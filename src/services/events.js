import axios from "axios"

const instance = axios.create({
  baseURL: "/api",
  headers: { "Authorization": "Beerer " + localStorage.beerToken }
})

export const createEvent = name =>
  instance.post("/events", { name })
    .then(res => res.data)
    .catch(console.error)

export const joinEvent = eventCode =>
  instance.post("/events/join", { eventCode })
    .then(res => res.data)
    .catch(console.error)