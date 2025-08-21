import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

import projectRoutes from './routes/project'
import nodeRoutes from './routes/node'
import edgeRoutes from './routes/edge'

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: 'http://localhost:5173'
})
fastify.register(projectRoutes)
fastify.register(nodeRoutes)
fastify.register(edgeRoutes)

export { fastify }
