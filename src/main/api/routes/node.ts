import { FastifyInstance } from 'fastify'
import db from '../../db'
import { node, nodeInsertSchema, nodeUpdateSchema } from '../../db/schema/node'
import { and, eq, like } from 'drizzle-orm'
import { z } from 'zod'
import { lower } from '../../db/utils'
import { edge } from '../../db/schema'

const NodeIdParamsSchema = z.object({
  id: z.coerce.number()
})

const searchByTitleParamsSchema = z.object({
  project_id: z.coerce.number(),
  searchString: z.string()
})

const nodeFromEdgeBodySchema = z.object({
  project_id: z.coerce.number(),
  edge: z
    .object({
      from: z.coerce.number(),
      to: z.coerce.number()
    })
    .partial()
    .refine(
      (data) => data.from || data.to,
      'Either "from" or "to" (id of existing node) must be specified.'
    )
  // TO consider: node does not have to be specified, unless some meta properties will be stored (e.g., position in view)
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

  fastify.post('/nodes/node-from-edge', async (request, reply) => {
    try {
      const parsedRequestBody = nodeFromEdgeBodySchema.parse(request.body)

      //const lastUntitledNode = await db
      //  .select()
      //  .from(node)
      //  .where(
      //    and(eq(node.project_id, parsedRequestBody.project_id), like(node.title, 'Untitled%'))
      //  )

      const [createdNode] = await db
        .insert(node)
        .values({ project_id: parsedRequestBody.project_id })
        .returning()

      if (!createdNode) throw new Error('Unable to create new node')

      const isCreatedNodeTarget = Boolean(parsedRequestBody.edge.from)

      const [createdEdge] = await db
        .insert(edge)
        .values({
          from: isCreatedNodeTarget ? parsedRequestBody.edge.from : createdNode.id,
          to: isCreatedNodeTarget ? createdNode.id : parsedRequestBody.edge.to,
          project_id: parsedRequestBody.project_id
        })
        .returning()

      const result = {
        node: createdNode,
        edge: createdEdge
      }

      reply.send(result)
    } catch (error) {
      reply.statusCode = 400
      reply.send(error)
    }
  })
}

export default nodeRoutes
