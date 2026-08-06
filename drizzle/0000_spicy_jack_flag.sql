CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`cat` text NOT NULL,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`content` text NOT NULL,
	`image` text,
	`image_width` integer,
	`image_height` integer,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer DEFAULT (unixepoch()) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);