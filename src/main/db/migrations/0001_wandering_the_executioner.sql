PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_edge` (
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	`project_id` integer NOT NULL,
	PRIMARY KEY(`from`, `to`),
	FOREIGN KEY (`from`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_edge`("from", "to", "project_id") SELECT "from", "to", "project_id" FROM `edge`;--> statement-breakpoint
DROP TABLE `edge`;--> statement-breakpoint
ALTER TABLE `__new_edge` RENAME TO `edge`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_node` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`project_id` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_node`("id", "title", "project_id") SELECT "id", "title", "project_id" FROM `node`;--> statement-breakpoint
DROP TABLE `node`;--> statement-breakpoint
ALTER TABLE `__new_node` RENAME TO `node`;--> statement-breakpoint
CREATE UNIQUE INDEX `node_title_project_id_unique` ON `node` (`title`,`project_id`);