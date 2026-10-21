const { createApp } = require('./app');

const PORT = Number(process.env.PORT) || 3000;

const server = createApp().listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// Graceful shutdown so `docker stop` doesn't have to kill the process
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
}
