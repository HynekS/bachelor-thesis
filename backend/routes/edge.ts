import { FastifyInstance } from "fastify";
import db from "../db";
import { edge, edgeInsertSchema, edgeUpdateSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const EdgeIdParamsSchema = z.object({
  id: z.coerce.number(),
});
module.exports = async (fastify: FastifyInstance) => {
  fastify.get('/edge', async (request, reply) => {
    		const parsedParams = EdgeIdParamsSchema.parse(request.params);
		const result = await db
			.select()
			.from(edge)
			.where(eq(edge.id, parsedParams.id));
		reply.send(result);
  });

fastify.post("/edge", async (request, reply) => {
		const parsedRequestBody = edgeInsertSchema.parse(request.body);
		const [result] = await db
			.insert(edge)
			.values(parsedRequestBody)
			.returning();
		reply.send(result);
	});

	fastify.patch("/edge", async (request, reply) => {
		const parsedParams = EdgeIdParamsSchema.parse(request.params);
		const parsedRequestBody = edgeUpdateSchema.parse(request.body);
		const [result] = await db
			.update(edge)
			.set(parsedRequestBody)
			.where(eq(edge.id, parsedParams.id))
			.returning();
		reply.send(result);
	});

	fastify.delete("/project/:id", async (request, reply) => {
		const parsedParams = EdgeIdParamsSchema.parse(request.params);
		await db.delete(edge).where(eq(edge.id, parsedParams.id));
		reply.code(204);
	});
}