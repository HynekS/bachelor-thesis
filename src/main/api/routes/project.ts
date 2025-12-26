import { FastifyInstance } from 'fastify'
import db from '../../db'
import { project, projectInsertSchema, projectUpdateSchema } from '../../db/schema/project'
import { node } from '../../db/schema/node'
import { eq, asc } from 'drizzle-orm'
import { z } from 'zod'

const ProjectIdParamsSchema = z.object({
  id: z.coerce.number()
})

const projectRoutes = (fastify: FastifyInstance): void => {
  fastify.get('/projects', async (_, reply) => {
    const result = await db.select().from(project)
    reply.send(result)
  })

  fastify.get('/projects/:id', async (request, reply) => {
    const parsedParams = ProjectIdParamsSchema.parse(request.params)
    const [result] = await db.select().from(project).where(eq(project.id, parsedParams.id))
    reply.send(result)
  })

  fastify.post('/projects', async (request, reply) => {
    const parsedRequestBody = projectInsertSchema.parse(request.body)
    const [result] = await db.insert(project).values(parsedRequestBody).returning()
    reply.send(result)
  })

  fastify.patch('/projects/:id', async (request, reply) => {
    const parsedParams = ProjectIdParamsSchema.parse(request.params)
    const parsedRequestBody = projectUpdateSchema.parse(request.body)
    const [result] = await db
      .update(project)
      .set(parsedRequestBody)
      .where(eq(project.id, parsedParams.id))
      .returning()
    reply.send(result)
  })

  fastify.delete('/projects/:id', async (request, reply) => {
    const parsedParams = ProjectIdParamsSchema.parse(request.params)
    const [result] = await db.delete(project).where(eq(project.id, parsedParams.id)).returning()
    reply.send(result)
  })

  fastify.get('/projects/:id/nodes', async (request, reply) => {
    const parsedParams = ProjectIdParamsSchema.parse(request.params)
    const result = await db
      .select()
      .from(node)
      .orderBy(asc(node.title))
      .where(eq(node.project_id, parsedParams.id))
    reply.send(result)
  })
}

export default projectRoutes
