-- GuildHall Database Backup Dump
-- Exported on: 2026-07-29 03:05:05
-- Database: guildhall

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `channel_permissions`;
CREATE TABLE `channel_permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned NOT NULL,
  `channel_id` bigint(20) unsigned NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `channel_permissions_role_id_foreign` (`role_id`),
  KEY `channel_permissions_channel_id_foreign` (`channel_id`),
  CONSTRAINT `channel_permissions_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `channel_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('text','voice','tavern') NOT NULL DEFAULT 'text',
  `owner_id` bigint(20) unsigned DEFAULT NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`settings`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `channels_owner_id_foreign` (`owner_id`),
  KEY `channels_server_id_foreign` (`server_id`),
  CONSTRAINT `channels_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `channels_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `channels` (`id`, `server_id`, `name`, `type`, `owner_id`, `settings`, `created_at`, `updated_at`) VALUES ('1', '1', 'general-hall', 'text', '1', '{\"topic\":\"Main guild lounge for general discussion\"}', '2026-07-28 13:35:57', '2026-07-28 13:35:57');
INSERT INTO `channels` (`id`, `server_id`, `name`, `type`, `owner_id`, `settings`, `created_at`, `updated_at`) VALUES ('2', '1', 'voice-tavern', 'voice', '1', '{\"bitrate\":64000}', '2026-07-28 13:35:57', '2026-07-28 13:35:57');

DROP TABLE IF EXISTS `employee_statuses`;
CREATE TABLE `employee_statuses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'available',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `employee_statuses_user_id_foreign` (`user_id`),
  CONSTRAINT `employee_statuses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `guild_notifications`;
CREATE TABLE `guild_notifications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'quest',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `guild_notifications_user_id_foreign` (`user_id`),
  CONSTRAINT `guild_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `channel_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `content` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'text',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_user_id_foreign` (`user_id`),
  KEY `messages_channel_id_index` (`channel_id`),
  CONSTRAINT `messages_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `messages` (`id`, `channel_id`, `user_id`, `content`, `type`, `created_at`, `updated_at`) VALUES ('1', '1', '1', 'Welcome to GuildHall! Prepare your equipment and claim your quests.', 'text', '2026-07-28 13:35:57', '2026-07-28 13:35:57');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('1', '0001_01_01_000000_create_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('2', '0001_01_01_000001_create_cache_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('3', '0001_01_01_000002_create_jobs_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('4', '2026_07_26_024726_create_permission_tables', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('5', '2026_07_26_030000_create_guildhall_tables', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('6', '2026_07_26_040000_add_icon_to_roles_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('7', '2026_07_26_050000_remove_permissions_column_from_roles_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('8', '2026_07_26_060000_create_voice_participants_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('9', '2026_07_26_070000_create_project_comments_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('10', '2026_07_26_080000_add_profile_fields_to_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('11', '2026_07_26_090000_create_quests_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('12', '2026_07_26_091000_create_notifications_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('13', '2026_07_26_092000_add_missing_quest_columns', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('14', '2026_07_27_100000_add_theme_column_to_users_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('15', '2026_07_28_000000_add_qa_indexes_to_tables', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('16', '2026_07_28_100000_create_servers_table', '1');
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES ('17', '2026_07_29_000000_add_ui_mode_to_users_table', '2');

DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('1', 'App\\Models\\User', '1');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('2', 'App\\Models\\User', '2');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('2', 'App\\Models\\User', '3');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('3', 'App\\Models\\User', '4');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('3', 'App\\Models\\User', '5');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('4', 'App\\Models\\User', '6');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('4', 'App\\Models\\User', '7');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('4', 'App\\Models\\User', '8');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('5', 'App\\Models\\User', '9');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('5', 'App\\Models\\User', '10');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('5', 'App\\Models\\User', '11');
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES ('5', 'App\\Models\\User', '12');

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('1', 'create_channels', 'web', '2026-07-28 13:35:36', '2026-07-28 13:35:36');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('2', 'delete_channels', 'web', '2026-07-28 13:35:37', '2026-07-28 13:35:37');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('3', 'kick_members', 'web', '2026-07-28 13:35:37', '2026-07-28 13:35:37');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('4', 'promote_members', 'web', '2026-07-28 13:35:37', '2026-07-28 13:35:37');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('5', 'manage_quests', 'web', '2026-07-28 13:35:38', '2026-07-28 13:35:38');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES ('6', 'approve_projects', 'web', '2026-07-28 13:35:38', '2026-07-28 13:35:38');

DROP TABLE IF EXISTS `presentations`;
CREATE TABLE `presentations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `channel_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `presentations_channel_id_foreign` (`channel_id`),
  KEY `presentations_user_id_foreign` (`user_id`),
  CONSTRAINT `presentations_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `presentations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `project_comments`;
CREATE TABLE `project_comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_comments_project_id_foreign` (`project_id`),
  KEY `project_comments_user_id_foreign` (`user_id`),
  CONSTRAINT `project_comments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `project_votes`;
CREATE TABLE `project_votes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `vote` smallint(6) NOT NULL DEFAULT 1,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_votes_project_id_foreign` (`project_id`),
  KEY `project_votes_user_id_foreign` (`user_id`),
  CONSTRAINT `project_votes_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_votes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'backlog',
  `submitted_by` bigint(20) unsigned NOT NULL,
  `deadline` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `votes_for` int(11) NOT NULL DEFAULT 0,
  `votes_against` int(11) NOT NULL DEFAULT 0,
  `auto_decide_at` timestamp NULL DEFAULT NULL,
  `live_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_submitted_by_foreign` (`submitted_by`),
  KEY `projects_status_index` (`status`),
  KEY `projects_server_id_foreign` (`server_id`),
  CONSTRAINT `projects_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `projects_submitted_by_foreign` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `projects` (`id`, `server_id`, `name`, `description`, `status`, `submitted_by`, `deadline`, `created_at`, `updated_at`, `votes_for`, `votes_against`, `auto_decide_at`, `live_url`) VALUES ('1', '1', 'GuildHall Core v1.0', 'Build employee management system with Discord, Trello, and RPG features.', 'in_progress', '1', '2026-08-11 13:35:58', '2026-07-28 13:35:58', '2026-07-28 13:35:58', '0', '0', NULL, NULL);

DROP TABLE IF EXISTS `quests`;
CREATE TABLE `quests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `reward_xp` int(11) NOT NULL DEFAULT 100,
  `expires_at` datetime DEFAULT NULL,
  `posted_by` bigint(20) unsigned NOT NULL,
  `accepted_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `estimated_duration` varchar(255) NOT NULL DEFAULT '1-2 hours',
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quests_posted_by_foreign` (`posted_by`),
  KEY `quests_accepted_by_foreign` (`accepted_by`),
  KEY `quests_status_index` (`status`),
  KEY `quests_server_id_foreign` (`server_id`),
  CONSTRAINT `quests_accepted_by_foreign` FOREIGN KEY (`accepted_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `quests_posted_by_foreign` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quests_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `quests` (`id`, `server_id`, `title`, `description`, `reward_xp`, `expires_at`, `posted_by`, `accepted_by`, `created_at`, `updated_at`, `status`, `estimated_duration`, `completed_at`) VALUES ('1', '1', 'Refactor Authentication Sanctum Realm', 'Ensure Sanctum tokens and Inertia state sync flawlessly across the realm.', '350', '2026-08-04 13:35:58', '1', NULL, '2026-07-28 13:35:58', '2026-07-28 13:35:58', 'open', '1-2 hours', NULL);

DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('1', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('1', '2');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('1', '3');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('1', '4');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('2', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('3', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('4', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('4', '2');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('4', '3');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('5', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('5', '2');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('5', '3');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('6', '1');
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES ('6', '2');

DROP TABLE IF EXISTS `role_user`;
CREATE TABLE `role_user` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `role_user_role_id_foreign` (`role_id`),
  KEY `role_user_user_id_foreign` (`user_id`),
  CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('1', '2', '2', '{\"assigned_at\":\"2026-07-28 13:35:51\"}', '2026-07-28 13:35:51', '2026-07-28 13:35:51');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('2', '2', '3', '{\"assigned_at\":\"2026-07-28 13:35:51\"}', '2026-07-28 13:35:51', '2026-07-28 13:35:51');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('3', '3', '4', '{\"assigned_at\":\"2026-07-28 13:35:52\"}', '2026-07-28 13:35:52', '2026-07-28 13:35:52');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('4', '3', '5', '{\"assigned_at\":\"2026-07-28 13:35:52\"}', '2026-07-28 13:35:52', '2026-07-28 13:35:52');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('5', '4', '6', '{\"assigned_at\":\"2026-07-28 13:35:53\"}', '2026-07-28 13:35:53', '2026-07-28 13:35:53');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('6', '4', '7', '{\"assigned_at\":\"2026-07-28 13:35:54\"}', '2026-07-28 13:35:54', '2026-07-28 13:35:54');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('7', '4', '8', '{\"assigned_at\":\"2026-07-28 13:35:54\"}', '2026-07-28 13:35:54', '2026-07-28 13:35:54');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('8', '5', '9', '{\"assigned_at\":\"2026-07-28 13:35:55\"}', '2026-07-28 13:35:55', '2026-07-28 13:35:55');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('9', '5', '10', '{\"assigned_at\":\"2026-07-28 13:35:55\"}', '2026-07-28 13:35:55', '2026-07-28 13:35:55');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('10', '5', '11', '{\"assigned_at\":\"2026-07-28 13:35:56\"}', '2026-07-28 13:35:56', '2026-07-28 13:35:56');
INSERT INTO `role_user` (`id`, `role_id`, `user_id`, `metadata`, `created_at`, `updated_at`) VALUES ('11', '5', '12', '{\"assigned_at\":\"2026-07-28 13:35:57\"}', '2026-07-28 13:35:57', '2026-07-28 13:35:57');

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL DEFAULT 'web',
  `color` varchar(255) DEFAULT NULL,
  `hierarchy_level` int(11) NOT NULL DEFAULT 0,
  `icon` varchar(255) NOT NULL DEFAULT 'Shield',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `name`, `guard_name`, `color`, `hierarchy_level`, `icon`, `created_at`, `updated_at`) VALUES ('1', 'Guild Master', 'web', '#EAB308', '100', 'Crown', '2026-07-28 13:35:45', '2026-07-28 13:35:45');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `color`, `hierarchy_level`, `icon`, `created_at`, `updated_at`) VALUES ('2', 'Project Manager', 'web', '#8B5CF6', '80', 'ShieldCheck', '2026-07-28 13:35:46', '2026-07-28 13:35:46');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `color`, `hierarchy_level`, `icon`, `created_at`, `updated_at`) VALUES ('3', 'Senior Developer', 'web', '#3B82F6', '60', 'Code2', '2026-07-28 13:35:46', '2026-07-28 13:35:46');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `color`, `hierarchy_level`, `icon`, `created_at`, `updated_at`) VALUES ('4', 'Developer', 'web', '#10B981', '40', 'Terminal', '2026-07-28 13:35:47', '2026-07-28 13:35:47');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `color`, `hierarchy_level`, `icon`, `created_at`, `updated_at`) VALUES ('5', 'Intern', 'web', '#6B7280', '20', 'Feather', '2026-07-28 13:35:47', '2026-07-28 13:35:47');

DROP TABLE IF EXISTS `servers`;
CREATE TABLE `servers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `owner_id` bigint(20) unsigned NOT NULL,
  `invite_code` varchar(16) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `servers_slug_unique` (`slug`),
  UNIQUE KEY `servers_invite_code_unique` (`invite_code`),
  KEY `servers_owner_id_foreign` (`owner_id`),
  CONSTRAINT `servers_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `servers` (`id`, `name`, `slug`, `icon`, `description`, `owner_id`, `invite_code`, `created_at`, `updated_at`) VALUES ('1', 'Central Guild Realm', 'central-guild-realm', 'https://api.dicebear.com/7.x/bottts/svg?seed=CentralGuild', 'Official GuildHall Central Headquarters Realm', '1', 'REALM-MAIN01', '2026-07-28 13:35:50', '2026-07-28 13:35:50');

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('AxCt5olHodvkhmGW9f4ACwQ5s08VbJJtKmIpYHq5', '1', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJYNG1FVXFiaDJpbXNFMkFuMGN4cW14YUVJdFF0NDVteG5pYmhqZ0lUIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9kYXNoYm9hcmRcL3RlYW0iLCJyb3V0ZSI6InRlYW0ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MX0=', '1785286761');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `server_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `joined_at` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL DEFAULT 'online',
  `xp` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rewards` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rewards`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `theme` varchar(255) NOT NULL DEFAULT 'dark',
  `ui_mode` enum('rpg','corporate') NOT NULL DEFAULT 'rpg',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_status_index` (`status`),
  KEY `users_server_id_foreign` (`server_id`),
  CONSTRAINT `users_server_id_foreign` FOREIGN KEY (`server_id`) REFERENCES `servers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('1', '1', 'Guild Master User', 'admin@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=GuildMaster', '2026-07-28 20:35:50', 'online', '3500', '10', NULL, '$2y$12$0lOb39tGa3eWWefl3Ifo..UCGIDbAEvXF.jGvqKR0K81ReOfVvbw.', NULL, '2026-07-28 13:35:50', '2026-07-29 00:59:21', NULL, NULL, 'dark', 'corporate');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('2', '1', 'Arthur Vance', 'arthur@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Arthur', '2026-07-28 20:35:51', 'online', '2400', '7', NULL, '$2y$12$gVCc.FTfSRUf9XLn5Xh1p.LgAT1GewL1BFz5xWl5CEGSS4g5eINCS', NULL, '2026-07-28 13:35:51', '2026-07-28 13:35:51', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('3', '1', 'Elena Rostova', 'elena@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena', '2026-07-28 20:35:51', 'busy', '2100', '6', NULL, '$2y$12$2W9IZ.NApeOVX2GUWPT6l.IlI6l2TumjPtaGUIdWgeUx05SueHg1m', NULL, '2026-07-28 13:35:51', '2026-07-28 13:35:51', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('4', '1', 'Cedric Storm', 'cedric@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Cedric', '2026-07-28 20:35:52', 'online', '1800', '5', NULL, '$2y$12$gWVukN60f0SEEv9ZN8zzm.zxzDDWpz9EKii0CrRdxwaC.zBobT3FO', NULL, '2026-07-28 13:35:52', '2026-07-28 13:35:52', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('5', '1', 'Morgana Pendelton', 'morgana@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Morgana', '2026-07-28 20:35:52', 'dungeon', '1650', '5', NULL, '$2y$12$XYEtlgI/1rETI26ink5BGe.xHzR96y8TNvqPFuJgUM/J6BHXzEX/a', NULL, '2026-07-28 13:35:52', '2026-07-28 13:35:52', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('6', '1', 'Lucas Finch', 'lucas@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucas', '2026-07-28 20:35:53', 'online', '1200', '4', NULL, '$2y$12$4ILhr4fhSfwMaWnUisa4huNksLqAs78ygJFrDEljFKqdzQ6zo/Z8.', NULL, '2026-07-28 13:35:53', '2026-07-28 13:35:53', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('7', '1', 'Sora Takahashi', 'sora@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Sora', '2026-07-28 20:35:53', 'online', '950', '3', NULL, '$2y$12$iFo1eMEeCZd04o6dghlN2eqzlNEzSBuE3oll/05w2TGyRHqkoPyQ6', NULL, '2026-07-28 13:35:53', '2026-07-28 13:35:53', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('8', '1', 'Nadia Rayne', 'nadia@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Nadia', '2026-07-28 20:35:54', 'offline', '800', '3', NULL, '$2y$12$blFqTk0J.OgIlV0NRiGlTuob.Yt4t65qcym/XmtTBuKj1ObaLyDkW', NULL, '2026-07-28 13:35:54', '2026-07-28 13:35:54', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('9', '1', 'Kaelen Voss', 'kaelen@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Kaelen', '2026-07-28 20:35:55', 'online', '300', '1', NULL, '$2y$12$0S1VkIh4OIUYwBSdXMd0deJEPUBYK5p4PF8hHF5JTRrfw3UAPhiqu', NULL, '2026-07-28 13:35:55', '2026-07-28 13:35:55', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('10', '1', 'Lyra Nightingale', 'lyra@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Lyra', '2026-07-28 20:35:55', 'online', '150', '1', NULL, '$2y$12$Mw0LDikOVbrVrrzO19Dq/.E5xMuni5qyPxuh0PlP/S.S0TEbco9Ei', NULL, '2026-07-28 13:35:55', '2026-07-28 13:35:55', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('11', '1', 'Bram Thorne', 'bram@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Bram', '2026-07-28 20:35:56', 'online', '120', '1', NULL, '$2y$12$BrkPFJkGIKgaMK9r.65jU.gc93.8I0bE/xUsIwSmwOnNn.coU1Rp6', NULL, '2026-07-28 13:35:56', '2026-07-28 13:35:56', NULL, NULL, 'dark', 'rpg');
INSERT INTO `users` (`id`, `server_id`, `name`, `email`, `avatar`, `joined_at`, `status`, `xp`, `level`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `rewards`, `achievements`, `theme`, `ui_mode`) VALUES ('12', '1', 'Freya Lind', 'freya@guildhall.io', 'https://api.dicebear.com/7.x/bottts/svg?seed=Freya', '2026-07-28 20:35:56', 'busy', '100', '1', NULL, '$2y$12$GERti2IHfa08mDy6b8OTTeRNPCzrKhCp4CYj0lyyzhBurhNYslk7y', NULL, '2026-07-28 13:35:56', '2026-07-28 13:35:56', NULL, NULL, 'dark', 'rpg');

DROP TABLE IF EXISTS `voice_participants`;
CREATE TABLE `voice_participants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `channel_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `seat_number` int(11) NOT NULL DEFAULT 1,
  `is_muted` tinyint(1) NOT NULL DEFAULT 0,
  `is_deafened` tinyint(1) NOT NULL DEFAULT 0,
  `hand_raised_at` timestamp NULL DEFAULT NULL,
  `is_presenting` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `voice_participants_channel_id_user_id_unique` (`channel_id`,`user_id`),
  KEY `voice_participants_user_id_foreign` (`user_id`),
  CONSTRAINT `voice_participants_channel_id_foreign` FOREIGN KEY (`channel_id`) REFERENCES `channels` (`id`) ON DELETE CASCADE,
  CONSTRAINT `voice_participants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS=1;
