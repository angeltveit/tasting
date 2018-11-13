import axios from "axios"

const instance = axios.create({
  baseURL: "/api",
  headers: { "Authorization": "Beerer " + localStorage.beerToken }
})

export const createEvent = name =>
  instance.post("/events", { name })
    .then(res => res.data)
    .catch(console.error)

export const joinEvent = code =>
  instance.post("/events/join", { code })
    .then(res => res.data)
    .catch(console.error)

export const listEvents = code =>
  instance.get("/events")
    .then(res => res.data)
    .catch(console.error)
