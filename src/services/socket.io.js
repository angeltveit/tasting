import io from 'socket.io-client';

const socket = io(location.origin)
const ROOMS = new Set()

socket.on('connect', function(client) {
  console.log('Connected websocket')
})

socket.on('reconnect', function(client) {
  console.log('reconnect socket...')
  ROOMS.forEach((room) => {
    console.log('resubscribing', room)
    socket.subscribe(room)
  })
})

socket.subscribe = room => {
  ROOMS.add(room)
  socket.emit('join', { room })
}

export default socket
