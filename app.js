const express = require("express");
const http = require("http");
const path = require("path");
const os = require("os");
const socketio = require("socket.io");
const fetchBtc = require("./fetchBtc");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 1978;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Client connected");

  setInterval(async () => {
    socket.emit(
      "subscribed-btc-prices",
      await fetchBtc.pushUpdates().catch((err) => {
        console.log(err);
      })
    );
  }, 5000);
});

app.get("/", async (req, res) => {
  const rates = await fetchBtc.pushUpdates().catch((err) => {
    console.log(err);
  });
  res.send(rates);
});

app.use(express.json());

app.listen(PORT, () => {
  console.log(`BTCTicker server running on port ${PORT}`);
});
