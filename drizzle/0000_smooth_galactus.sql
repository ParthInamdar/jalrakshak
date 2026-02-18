CREATE TABLE `irrigation_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`location` varchar(255) NOT NULL,
	`crop` varchar(255) NOT NULL,
	`soil` enum('Clay','Loamy','Sandy') NOT NULL,
	`lastIrrigationDate` varchar(10) NOT NULL,
	`fieldSize` decimal(10,2) NOT NULL,
	`temperature` decimal(5,2),
	`humidity` decimal(5,2),
	`rainProbability` int,
	`recommendation` text NOT NULL,
	`waterSaved` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `irrigation_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
