CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(64) NOT NULL,
	`entity` varchar(128) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`link` varchar(512) NOT NULL,
	`sourceUrl` varchar(512) NOT NULL,
	`publishedAt` timestamp NOT NULL,
	`scrapedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
