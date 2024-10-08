CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`lat` real NOT NULL,
	`lon` real NOT NULL,
	`name` text NOT NULL,
	`author` text NOT NULL,
	`location` text NOT NULL,
	`hrtime` text,
	`deleteAfter` integer,
	`time` text,
	`website` text NOT NULL,
	`tags` text NOT NULL,
	`description` text NOT NULL,
	`createTime` text DEFAULT CURRENT_TIMESTAMP,
	`verified` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `events_id_unique` ON `events` (`id`);