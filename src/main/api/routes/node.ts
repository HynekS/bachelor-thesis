import { FastifyInstance } from 'fastify'
import db from '../../db'
import { node, nodeInsertSchema, nodeUpdateSchema } from '../../db/schema/node'
import { and, eq, like } from 'drizzle-orm'
import { z } from 'zod'
import { lower } from '../../db/utils'

const NodeIdParamsSchema = z.object({
  id: z.coerce.number()
})

const searchByTitleParamsSchema = z.object({
  project_id: z.coerce.number(),
  searchString: z.string()
})

const nodeRoutes = (fastify: FastifyInstance): void => {
  fastify.get('/nodes', async (request, reply) => {
    const parsedParams = NodeIdParamsSchema.parse(request.params)
    const result = await db.select().from(node).where(eq(node.id, parsedParams.id))
    reply.send(result)
  })

  fastify.post('/nodes', async (request, reply) => {
    try {
      const parsedRequestBody = nodeInsertSchema.parse(request.body)
      const [result] = await db.insert(node).values(parsedRequestBody).returning()
      reply.send(result)
    } catch (error) {
      reply.statusCode = 400
      reply.send(error)
    }
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
    const [response] = await db.delete(node).where(eq(node.id, parsedParams.id)).returning()
    reply.send(response)
  })

  fastify.get('/nodes/search-by-title', async (request, reply) => {
    const parsedParams = searchByTitleParamsSchema.parse(request.query)
    const matches = await db
      .select()
      .from(node)
      .where(
        and(
          eq(node.project_id, parsedParams.project_id),
          like(lower(node.title), `${parsedParams.searchString.toLowerCase()}%`)
        )
      )

    reply.send(matches)
  })
}

export default nodeRoutes
