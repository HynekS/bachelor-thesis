import { sql } from "drizzle-orm";
import {
	AnySQLiteColumn,
	int,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';


export const project = sqliteTable("project", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	country: text(),
	region: text(),
	city: text(),
	district: text(),
	created_at: text("created_at")
		.default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`)
		.notNull(),
});

export const projectInsertSchema = createInsertSchema(project);
export const projectUpdateSchema = createUpdateSchema(project);


export const polygon = sqliteTable(
	"polygon",
	{
		id: int().primaryKey({ autoIncrement: true }),
		title: text().notNull(),
		description: text(),
		project_id: int().references((): AnySQLiteColumn => project.id),
	},
	(table) => [unique().on(table.title, table.project_id)],
);

export const polygonInsertSchema = createInsertSchema(polygon);
export const polygonUpdateSchema = createUpdateSchema(polygon);


export const section = sqliteTable(
	"section",
	{
		id: int().primaryKey({ autoIncrement: true }),
		title: text().notNull(),
		description: text(),
		project_id: int().references((): AnySQLiteColumn => project.id),
	},
	(table) => [unique().on(table.title, table.project_id)],
);

export const sectionInsertSchema = createInsertSchema(section);
export const sectionUpdateSchema = createUpdateSchema(section);


export const node = sqliteTable("node", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	project_id: int().references((): AnySQLiteColumn => project.id),
}, (table) => [unique().on(table.title, table.project_id)]);

export const nodeInsertSchema = createInsertSchema(node);
export const nodeUpdateSchema = createUpdateSchema(node);


export const edge = sqliteTable("edge", {
	id: int().primaryKey({ autoIncrement: true }),
	from: int().references((): AnySQLiteColumn => node.id),
  to: int().references((): AnySQLiteColumn => node.id),
	project_id: int().references((): AnySQLiteColumn => project.id),
}, (table) => [unique().on(table.from, table.to, table.project_id)]);

export const edgeInsertSchema = createInsertSchema(edge);
export const edgeUpdateSchema = createUpdateSchema(edge);

