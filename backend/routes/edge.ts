import { FastifyInstance } from 'fastify';

module.exports = async (fastify: FastifyInstance) => {
  fastify.get('/edge', async (request, reply) => {
    return { message: 'Hello from Edge route!' };
  });

  fastify.post('/edge', async (request, reply) => {
    return {}
  })

  fastify.patch('/edge', async(request, reply) => {
    return {}
  })

    fastify.delete('/edge', async(request, reply) => {
    return {}
  })
}