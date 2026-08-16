DROP INDEX `articles_slug_unique`;
--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `slug`;
--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `title`;
--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `desc`;
--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `content`;
--> statement-breakpoint
CREATE TABLE `article_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`locale` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_translations_article_locale_unique` ON `article_translations` (`article_id`,`locale`);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_translations_locale_slug_unique` ON `article_translations` (`locale`,`slug`);
