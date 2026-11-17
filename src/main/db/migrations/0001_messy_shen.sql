PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_edge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	`project_id` integer NOT NULL,
	FOREIGN KEY (`from`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`to`) REFERENCES `node`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_edge`("id", "from", "to", "project_id") SELECT "id", "from", "to", "project_id" FROM `edge`;--> statement-breakpoint
DROP TABLE `edge`;--> statement-breakpoint
ALTER TABLE `__new_edge` RENAME TO `edge`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `edge_from_to_project_id_unique` ON `edge` (`from`,`to`,`project_id`);