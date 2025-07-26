import { sql } from "drizzle-orm";
import {
	AnySQLiteColumn,
	int,
	sqliteTable,
	text,
	unique,
} from "drizzle-orm/sqlite-core";

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


export const node = sqliteTable("node", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	project_id: int().references((): AnySQLiteColumn => project.id),
}, (table) => [unique().on(table.title, table.project_id)]);


export const edge = sqliteTable("edge", {
	id: int().primaryKey({ autoIncrement: true }),
	from: int().references((): AnySQLiteColumn => node.id),
  to: int().references((): AnySQLiteColumn => node.id),
	project_id: int().references((): AnySQLiteColumn => project.id),
}, (table) => [unique().on(table.from, table.to, table.project_id)]);
