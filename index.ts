import express from "express"
import { createServer } from "node:http"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { Server } from "socket.io"

type TRoom = {
  id: string
  host: {
    username: string
  }
}
const app = express()
const server = createServer(app)
const io = new Server(server)

const __dirname = dirname(fileURLToPath(import.meta.url))

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "/public/index.html"))
})

io.on("connection", (socket) => {
  const room: TRoom = JSON.parse(socket.handshake.query["room"] as string)
  const user: string = socket.handshake.query["user"] as string
  console.log(`${user} connected to ${room.id}`)

  socket.join(room.id)

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })

  socket.on("chat message", (msg: string) => {
    io.to(room.id).emit(`chat message`, `${msg}, from ${user}`)
    console.log("message: " + msg)
  })
})

server.listen(3000, () => {
  console.log("server running at http://localhost:3000")
})
