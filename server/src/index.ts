import Fastify from 'fastify';
import { Server } from 'socket.io';

const fastify = Fastify({ logger: true });

// Basic route to test the server
fastify.get('/', async (request, reply) => {
  return { message: 'Minimalist Chess Server Running!' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    
    // Initialize Socket.io (attaching to Fastify's raw server)
    const io = new Server(fastify.server, {
      cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      fastify.log.info(`Client connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        fastify.log.info(`Client disconnected: ${socket.id}`);
      });
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
