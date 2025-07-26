import { FastifyInstance } from 'fastify';

module.exports = async (fastify: FastifyInstance) => {
  fastify.get('/node', async (request, reply) => {
    return { message: 'Hello from Node route!' };
  });

  fastify.post('/node', async (request, reply) => {
    return {}
  })

  fastify.patch('/node', async(request, reply) => {
    return {}
  })
}