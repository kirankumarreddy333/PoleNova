/**
 * Central Socket.io handler.
 * Events emitted elsewhere in the app (sensorController, faultController) use
 * io.emit(...) directly. This file handles connection lifecycle + client-initiated events.
 */
const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join:dashboard', () => {
      socket.join('dashboard');
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
