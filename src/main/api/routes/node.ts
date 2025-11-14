import { FastifyInstance } from 'fastify'
import db from '../../db'
import { node, nodeInsertSchema, nodeUpdateSchema } from '../../db/schema/node'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const NodeIdParamsSchema = z.object({
  id: z.coerce.number()
})

const nodeRoutes = (fastify: FastifyInstance): void => {
  fastify.get('/nodes', async (request, reply) => {
    const parsedParams = NodeIdParamsSchema.parse(request.params)
    const result = await db.select().from(node).where(eq(node.id, parsedParams.id))
    reply.send(result)
  })

  fastify.post('/nodes', async (request, reply) => {
    const parsedRequestBody = nodeInsertSchema.parse(request.body)
    const [result] = await db.insert(node).values(parsedRequestBody).returning()
    reply.send(result)
  })

  fastify.patch('/nodes', async (request, reply) => {
    const parsedParams = NodeIdParamsSchema.parse(request.params)
    const parsedRequestBody = nodeUpdateSchema.parse(request.body)
    const [result] = await db
      .update(node)
      .set(parsedRequestBody)
      .where(eq(node.id, parsedParams.id))
      .returning()
    reply.send(result)
  })

  fastify.delete('/nodes/:id', async (request, reply) => {
    const parsedParams = NodeIdParamsSchema.parse(request.params)
    await db.delete(node).where(eq(node.id, parsedParams.id))
    reply.code(204)
  })
}

export default nodeRoutes
