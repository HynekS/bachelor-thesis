import { FastifyInstance } from 'fastify';

module.exports = async (fastify: FastifyInstance) => {
  fastify.get('/project', async (request, reply) => {
    return { message: 'Hello from project route!' };
  });

  fastify.post('/project', async (request, reply) => {
    return {}
  })

  fastify.patch('/project', async(request, reply) => {
    return {}
  })

    fastify.delete('/project', async(request, reply) => {
    return {}
  })
}