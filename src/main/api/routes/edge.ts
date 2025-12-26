import { FastifyInstance } from 'fastify'
import db from '../../db'
import { edge, edgeInsertSchema, edgeUpdateSchema } from '../../db/schema/edge'

import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { node } from '../../db/schema/node'

export const EdgeIdParamsSchema = z.object({
  id: z.coerce.number()
})

export const EdgeFromNodesParamsSchema = z.object({
  ancestorNodeTitle: z.string(),
  descendantNodeTitle: z.string(),
  project_id: z.number()
})

const edgeRoutes = (fastify: FastifyInstance): void => {
  fastify.get('/edges', async (request, reply) => {
    const parsedParams = EdgeIdParamsSchema.parse(request.params)
    const result = await db.select().from(edge).where(eq(edge.id, parsedParams.id))
    reply.send(result)
  })

  fastify.post('/edges', async (request, reply) => {
    const parsedRequestBody = edgeInsertSchema.parse(request.body)
    const [result] = await db.insert(edge).values(parsedRequestBody).returning()
    reply.send(result)
  })

  fastify.patch('/edges', async (request, reply) => {
    const parsedParams = EdgeIdParamsSchema.parse(request.params)
    const parsedRequestBody = edgeUpdateSchema.parse(request.body)
    const [result] = await db
      .update(edge)
      .set(parsedRequestBody)
      .where(eq(edge.id, parsedParams.id))
      .returning()
    reply.send(result)
  })

  fastify.delete('/edges/:id', async (request, reply) => {
    const parsedParams = EdgeIdParamsSchema.parse(request.params)
    await db.delete(edge).where(eq(edge.id, parsedParams.id))
    reply.code(204)
  })

  fastify.post('/edges/edgeFromNodes', async (request, reply) => {
    const parsedRequestBody = EdgeFromNodesParamsSchema.parse(request.body)

    const [ancestorNodeFromDb] = await db
      .select()
      .from(node)
      .where(eq(node.title, parsedRequestBody.ancestorNodeTitle))

    const ancestorNode =
      ancestorNodeFromDb ??
      (await db
        .insert(node)
        .values({
          project_id: parsedRequestBody.project_id,
          title: parsedRequestBody.ancestorNodeTitle
        })
        .returning()[0])

    const [descendantNodeFromDb] = await db
      .select()
      .from(node)
      .where(eq(node.title, parsedRequestBody.descendantNodeTitle))

    const descendantNode =
      descendantNodeFromDb ??
      (await db
        .insert(node)
        .values({
          project_id: parsedRequestBody.project_id,
          title: parsedRequestBody.descendantNodeTitle
        })
        .returning()[0])

    const [resultFromDb] = await db
      .select()
      .from(edge)
      .where(and(eq(edge.from, ancestorNode.id), eq(edge.to, descendantNode.id)))

    const result =
      resultFromDb ??
      (
        await db
          .insert(edge)
          .values({
            from: ancestorNode.id,
            to: descendantNode.id,
            project_id: parsedRequestBody.project_id
          })
          .returning()
      )[0]

    reply.send(result)
  })
}

export default edgeRoutes
