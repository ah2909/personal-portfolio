CREATE TABLE `projects` (
	`slug` text PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL
);
