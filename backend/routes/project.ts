import { FastifyInstance } from "fastify";
import db from "../db";
import {
	project,
	projectInsertSchema,
	projectUpdateSchema,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const ProjectIdParamsSchema = z.object({
	id: z.coerce.number(),
});

module.exports = async (fastify: FastifyInstance) => {
	fastify.get("/project/:id", async (request, reply) => {
		const parsedParams = ProjectIdParamsSchema.parse(request.params);
		const result = await db
			.select()
			.from(project)
			.where(eq(project.id, parsedParams.id));
		return result;
	});

	fastify.post("/project", async (request, reply) => {
		const parsedRequestBody = projectInsertSchema.parse(request.body);
		const [result] = await db
			.insert(project)
			.values(parsedRequestBody)
			.returning();
		reply.send(result);
	});

	fastify.patch("/project/:id", async (request, reply) => {
		const parsedParams = ProjectIdParamsSchema.parse(request.params);
		const parsedRequestBody = projectUpdateSchema.parse(request.body);
		await db
			.update(project)
			.set(parsedRequestBody)
			.where(eq(project.id, parsedParams.id))
			.returning();
	});

	fastify.delete("/project/:id", async (request, reply) => {
		const parsedParams = ProjectIdParamsSchema.parse(request.params);
		await db.delete(project).where(eq(project.id, parsedParams.id));
		reply.code(204);
	});
};
