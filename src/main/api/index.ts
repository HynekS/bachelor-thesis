import Fastify, { type FastifyInstance } from 'fastify'
import cors from '@fastify/cors'

import projectRoutes from './routes/project'
import nodeRoutes from './routes/node'
import edgeRoutes from './routes/edge'

const prefix = import.meta.env.VITE_API_PREFIX

const fastify: FastifyInstance = Fastify({
  logger: true
})

fastify.register(cors, {
  origin: import.meta.env.VITE_DEV_SERVER_URL
})
fastify.register(projectRoutes, { prefix })
fastify.register(nodeRoutes, { prefix })
fastify.register(edgeRoutes, { prefix })

export { fastify }
