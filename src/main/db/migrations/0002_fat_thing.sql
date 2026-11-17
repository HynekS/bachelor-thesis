CREATE TABLE `sections_to_polygons` (
	`polygon_id` integer NOT NULL,
	`section_id` integer NOT NULL,
	PRIMARY KEY(`polygon_id`, `section_id`),
	FOREIGN KEY (`polygon_id`) REFERENCES `polygon`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`section_id`) REFERENCES `section`(`id`) ON UPDATE no action ON DELETE no action
);
