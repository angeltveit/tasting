import axios from "axios"

const instance = axios.create({
  baseURL: "/api",
  headers: { "Authorization": "Bearer " + localStorage.beerToken }
})

export const createEvent = eventName =>
  instance.post("/events", { eventName })
    .then(res => res.data)
    .catch(console.error)

export const joinEvent = eventCode =>
  instance.post("/events/join", { eventCode })
    .then(res => res.data)
    .catch(console.error)