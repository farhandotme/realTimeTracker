const express = require("express");
const http = require("http");
const path = require("path");
const Socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = Socket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
