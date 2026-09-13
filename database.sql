-- MindNova-AI schema (structure only)
-- Generated from website-MindNova-AI/database/migrations/
-- Not a phpMyAdmin dump. No seed/data.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `last_login_at` timestamp DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `status` enum('active','banned','inactive') NOT NULL DEFAULT 'active',
  `teacher_verification_status` varchar(255) NOT NULL DEFAULT 'pending',
  `teacher_verified_at` timestamp DEFAULT NULL,
  `teacher_verification_note` text DEFAULT NULL,
  `onboarding_data` json DEFAULT NULL,
  `is_onboarded` tinyint(1) NOT NULL DEFAULT 0,
  `notification_email` tinyint(1) DEFAULT NULL,
  `weekly_report` tinyint(1) DEFAULT NULL,
  `ai_suggestions` tinyint(1) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `payout_info` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(6) UNSIGNED NOT NULL,
  `reserved_at` int(11) UNSIGNED DEFAULT NULL,
  `available_at` int(11) UNSIGNED NOT NULL,
  `created_at` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
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

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'VND',
  `provider` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `subject_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `plan` varchar(255) NOT NULL DEFAULT 'free',
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `payment_id` bigint UNSIGNED DEFAULT NULL,
  `started_at` timestamp DEFAULT NULL,
  `expires_at` timestamp DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `admin_logs`;
CREATE TABLE `admin_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `target_type` varchar(255) DEFAULT NULL,
  `target_id` bigint UNSIGNED DEFAULT NULL,
  `details` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp DEFAULT NULL,
  `expires_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `requested_by` bigint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0,
  `level` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  `status` enum('draft','pending_review','under_review','approved','needs_fixes','rejected','published','archived') NOT NULL DEFAULT 'draft',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `views_count` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `admin_hidden_at` timestamp DEFAULT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `sale_start_date` timestamp DEFAULT NULL,
  `sale_end_date` timestamp DEFAULT NULL,
  `is_flash_sale` tinyint(1) NOT NULL DEFAULT 0,
  `published_version_id` bigint UNSIGNED DEFAULT NULL,
  `current_version` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `lock_version` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `partnership_tier` varchar(20) NOT NULL DEFAULT 'standard',
  PRIMARY KEY (`id`),
  UNIQUE KEY `courses_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('vnpay','momo','banking','free') NOT NULL,
  `status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_transaction_id_unique` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `role_user`;
CREATE TABLE `role_user` (
  `role_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`role_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `permission_role`;
CREATE TABLE `permission_role` (
  `permission_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`permission_id`, `role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_free` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `status` enum('draft','pending_review','under_review','approved','needs_fixes','rejected','published') NOT NULL DEFAULT 'draft',
  `module_id` bigint UNSIGNED DEFAULT NULL,
  `type` enum('video','article','quiz_module') NOT NULL DEFAULT 'video',
  `duration_seconds` int(11) NOT NULL DEFAULT 0,
  `published_version_id` bigint UNSIGNED DEFAULT NULL,
  `current_version` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `lock_version` int(11) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `discussions`;
CREATE TABLE `discussions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `status` enum('open','answered','closed') NOT NULL DEFAULT 'open',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `is_pinned` tinyint(1) NOT NULL DEFAULT 0,
  `is_resolved` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `discussion_replies`;
CREATE TABLE `discussion_replies` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `discussion_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `is_best_answer` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `progress_percentage` int(11) NOT NULL DEFAULT 0,
  `enrolled_at` timestamp NOT NULL,
  `status` enum('waiting','enrolled','completed','cancelled') NOT NULL DEFAULT 'waiting',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `lesson_media`;
CREATE TABLE `lesson_media` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `media_type` enum('video','image') NOT NULL DEFAULT 'video',
  `r2_key` varchar(500) NOT NULL,
  `original_filename` varchar(255) NOT NULL,
  `file_size` bigint UNSIGNED NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `duration_seconds` int(11) UNSIGNED DEFAULT NULL,
  `status` enum('processing','ready','failed') NOT NULL DEFAULT 'processing',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `is_temp` tinyint(1) NOT NULL DEFAULT 0,
  `uploaded_by` bigint UNSIGNED DEFAULT NULL,
  `upload_id` varchar(255) DEFAULT NULL,
  `idempotency_key` char(64) DEFAULT NULL,
  `attempts` smallint(6) UNSIGNED NOT NULL DEFAULT 0,
  `last_error` text DEFAULT NULL,
  `processing_started_at` timestamp DEFAULT NULL,
  `ready_at` timestamp DEFAULT NULL,
  `expires_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lesson_media_upload_id_unique` (`upload_id`),
  UNIQUE KEY `lesson_media_idempotency_key_unique` (`idempotency_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE `user_profiles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `learning_goal` varchar(255) DEFAULT NULL,
  `skill_level` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `cv_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_profiles_user_id_unique` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `course_modules`;
CREATE TABLE `course_modules` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `knowledge_topics`;
CREATE TABLE `knowledge_topics` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `time_limit_minutes` int(11) NOT NULL DEFAULT 0,
  `passing_score` int(11) NOT NULL DEFAULT 70,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `instructor_id` bigint UNSIGNED DEFAULT NULL,
  `description` text DEFAULT NULL,
  `source_type` varchar(255) NOT NULL DEFAULT 'content',
  `source_content` longtext DEFAULT NULL,
  `difficulty` varchar(255) NOT NULL DEFAULT 'mixed',
  `total_questions` int(11) NOT NULL DEFAULT 0,
  `mc_questions_count` int(11) NOT NULL DEFAULT 0,
  `essay_questions_count` int(11) NOT NULL DEFAULT 0,
  `total_points` float NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `type` varchar(255) NOT NULL DEFAULT 'normal',
  `credits` int(11) NOT NULL DEFAULT 1,
  `thumbnail_url` text DEFAULT NULL,
  `thumbnail_r2_key` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `ai_insight` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `question_category` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'multiple_choice',
  `difficulty` varchar(255) NOT NULL DEFAULT 'medium',
  `explanation` text DEFAULT NULL,
  `sample_answer` text DEFAULT NULL,
  `rubric` text DEFAULT NULL,
  `points` float NOT NULL,
  `selection_type` varchar(255) NOT NULL DEFAULT 'single_choice',
  `image_url` text DEFAULT NULL,
  `image_r2_key` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_id` bigint UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `image_r2_key` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `lesson_completions`;
CREATE TABLE `lesson_completions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `completed_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lesson_completions_user_id_unique` (`user_id`),
  UNIQUE KEY `lesson_completions_lesson_id_unique` (`lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_quiz_attempts`;
CREATE TABLE `user_quiz_attempts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `quiz_id` bigint UNSIGNED NOT NULL,
  `score` int(11) NOT NULL,
  `accuracy` int(11) NOT NULL,
  `time_taken_seconds` int(11) NOT NULL,
  `status` enum('passed','failed') NOT NULL,
  `created_at` timestamp NOT NULL,
  `score_10` float DEFAULT NULL,
  `grading_status` varchar(255) NOT NULL DEFAULT 'graded',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_topic_performance`;
CREATE TABLE `user_topic_performance` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `topic_id` bigint UNSIGNED NOT NULL,
  `total_answered` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `total_correct` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `accuracy_percentage` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_topic_performance_user_id_unique` (`user_id`),
  UNIQUE KEY `user_topic_performance_topic_id_unique` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_tutor_conversations`;
CREATE TABLE `ai_tutor_conversations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `lesson_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Cuộc trò chuyện mới',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_tutor_messages`;
CREATE TABLE `ai_tutor_messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint UNSIGNED NOT NULL,
  `sender` enum('user','ai') NOT NULL,
  `message` longtext NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `admin_settings`;
CREATE TABLE `admin_settings` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_usage_logs`;
CREATE TABLE `ai_usage_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `actor_type` varchar(255) NOT NULL DEFAULT 'guest',
  `actor_key` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `model` varchar(255) DEFAULT NULL,
  `input_text` longtext DEFAULT NULL,
  `output_text` longtext DEFAULT NULL,
  `input_tokens` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `output_tokens` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `cost_estimate` decimal(12,6) NOT NULL DEFAULT 0,
  `system_prompt` longtext DEFAULT NULL,
  `meta` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `request_id` varchar(64) DEFAULT NULL,
  `provider_request_id` varchar(255) DEFAULT NULL,
  `status` varchar(32) DEFAULT NULL,
  `error_code` varchar(100) DEFAULT NULL,
  `duration_ms` int(11) UNSIGNED DEFAULT NULL,
  `fallback_used` tinyint(1) DEFAULT NULL,
  `token_source` varchar(32) DEFAULT NULL,
  `cost_source` varchar(32) DEFAULT NULL,
  `cost_amount` decimal(12,6) DEFAULT NULL,
  `cost_currency` char(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_moderation_flags`;
CREATE TABLE `ai_moderation_flags` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `actor_type` varchar(255) NOT NULL DEFAULT 'guest',
  `actor_key` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'ai_tutor',
  `reason` varchar(255) NOT NULL,
  `input_text` longtext DEFAULT NULL,
  `output_text` longtext DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `review_notes` text DEFAULT NULL,
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `support_tickets`;
CREATE TABLE `support_tickets` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reporter_id` bigint UNSIGNED DEFAULT NULL,
  `target_user_id` bigint UNSIGNED DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'system_error',
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'open',
  `resolution` text DEFAULT NULL,
  `handled_by` bigint UNSIGNED DEFAULT NULL,
  `handled_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `shared_resources`;
CREATE TABLE `shared_resources` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'ebook',
  `url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `uploaded_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_payouts`;
CREATE TABLE `teacher_payouts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `gross_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `teacher_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `admin_share_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `commission_rate` decimal(5,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'completed',
  `paid_at` timestamp DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `instructor_transactions`;
CREATE TABLE `instructor_transactions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` varchar(255) NOT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `reference_id` bigint UNSIGNED DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `available_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `withdrawals`;
CREATE TABLE `withdrawals` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `bank_info` json NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `certificate_url` varchar(255) DEFAULT NULL,
  `issued_at` timestamp NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_user_id_unique` (`user_id`),
  UNIQUE KEY `certificates_course_id_unique` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_course_id_unique` (`course_id`),
  UNIQUE KEY `reviews_user_id_unique` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `type` enum('percent','fixed') NOT NULL DEFAULT 'percent',
  `value` decimal(10,2) NOT NULL,
  `max_uses` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `expires_at` timestamp DEFAULT NULL,
  `status` enum('active','disabled','expired') NOT NULL DEFAULT 'active',
  `instructor_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `starts_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_credentials`;
CREATE TABLE `teacher_credentials` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `content_versions`;
CREATE TABLE `content_versions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `versionable_type` varchar(255) NOT NULL,
  `versionable_id` bigint UNSIGNED NOT NULL,
  `version_number` int(11) UNSIGNED NOT NULL DEFAULT 1,
  `snapshot_data` json NOT NULL,
  `status` enum('draft','pending_review','under_review','approved','rejected','needs_fixes','published') NOT NULL DEFAULT 'draft',
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `review_submissions`;
CREATE TABLE `review_submissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `course_version_id` bigint UNSIGNED NOT NULL,
  `submitted_by` bigint UNSIGNED NOT NULL,
  `submitted_at` timestamp NOT NULL,
  `status` enum('pending','under_review','approved','rejected','needs_fixes') NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp DEFAULT NULL,
  `review_feedback` text DEFAULT NULL,
  `stale_at` timestamp DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `review_submission_items`;
CREATE TABLE `review_submission_items` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` bigint UNSIGNED NOT NULL,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `lesson_version_id` bigint UNSIGNED NOT NULL,
  `change_type` enum('new','modified','deleted','reordered') NOT NULL DEFAULT 'new',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `review_comments`;
CREATE TABLE `review_comments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `submission_id` bigint UNSIGNED NOT NULL,
  `commentable_type` varchar(255) DEFAULT NULL,
  `commentable_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `content_audit_logs`;
CREATE TABLE `content_audit_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `user_role` varchar(50) NOT NULL,
  `action` varchar(100) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` bigint UNSIGNED NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `version_number` int(11) UNSIGNED DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `course_id` bigint UNSIGNED DEFAULT NULL,
  `correlation_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `deletion_requests`;
CREATE TABLE `deletion_requests` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `requested_by` bigint UNSIGNED NOT NULL,
  `requested_at` timestamp NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `chat_conversations`;
CREATE TABLE `chat_conversations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` enum('course','group','direct') NOT NULL DEFAULT 'course',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `chat_conversation_members`;
CREATE TABLE `chat_conversation_members` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_conversation_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `last_read_message_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_conversation_id` bigint UNSIGNED NOT NULL,
  `sender_id` bigint UNSIGNED NOT NULL,
  `content` text DEFAULT NULL,
  `type` enum('text','file','image') NOT NULL DEFAULT 'text',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `is_recalled` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `chat_attachments`;
CREATE TABLE `chat_attachments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_message_id` bigint UNSIGNED NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `size` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_otps`;
CREATE TABLE `password_otps` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `otp_hash` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'forgot_password',
  `expires_at` timestamp NOT NULL,
  `verified_at` timestamp DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_certificates`;
CREATE TABLE `teacher_certificates` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `certificate_name` varchar(255) NOT NULL,
  `issuing_organization` varchar(255) DEFAULT NULL,
  `certificate_number` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `certificate_image` varchar(255) DEFAULT NULL,
  `verification_url` varchar(255) DEFAULT NULL,
  `verification_status` varchar(255) NOT NULL DEFAULT 'pending',
  `verification_note` text DEFAULT NULL,
  `verified_at` timestamp DEFAULT NULL,
  `verified_by` bigint UNSIGNED DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_certificate_evidences`;
CREATE TABLE `teacher_certificate_evidences` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `certificate_id` bigint UNSIGNED NOT NULL,
  `evidence_path` varchar(255) NOT NULL,
  `evidence_type` varchar(255) NOT NULL DEFAULT 'document',
  `original_name` varchar(255) DEFAULT NULL,
  `file_size` bigint UNSIGNED DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_verifications`;
CREATE TABLE `teacher_verifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `submitted_at` timestamp NOT NULL,
  `reviewed_at` timestamp DEFAULT NULL,
  `reviewed_by` bigint UNSIGNED DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `verified_at` timestamp DEFAULT NULL,
  `revoked_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `teacher_verification_logs`;
CREATE TABLE `teacher_verification_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `admin_id` bigint UNSIGNED DEFAULT NULL,
  `certificate_id` bigint UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `old_status` varchar(255) DEFAULT NULL,
  `new_status` varchar(255) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `draft_revisions`;
CREATE TABLE `draft_revisions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `revisionable_type` varchar(255) NOT NULL,
  `revisionable_id` bigint UNSIGNED NOT NULL,
  `revision_number` int(11) UNSIGNED NOT NULL,
  `snapshot_data` json NOT NULL,
  `content_hash` char(64) NOT NULL,
  `idempotency_key` char(64) DEFAULT NULL,
  `reason` varchar(32) NOT NULL DEFAULT 'autosave',
  `created_by` bigint UNSIGNED NOT NULL,
  `parent_revision_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `draft_revisions_revisionable_type_unique` (`revisionable_type`),
  UNIQUE KEY `draft_revisions_revisionable_id_unique` (`revisionable_id`),
  UNIQUE KEY `draft_revisions_revision_number_unique` (`revision_number`),
  UNIQUE KEY `draft_revisions_idempotency_key_unique` (`idempotency_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `quiz_course_attachments`;
CREATE TABLE `quiz_course_attachments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint UNSIGNED NOT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `module_id` bigint UNSIGNED DEFAULT NULL,
  `after_lesson_id` bigint UNSIGNED DEFAULT NULL,
  `position` varchar(255) NOT NULL DEFAULT 'end_of_course',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_generation_logs`;
CREATE TABLE `ai_generation_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `instructor_id` bigint UNSIGNED NOT NULL,
  `quiz_id` bigint UNSIGNED DEFAULT NULL,
  `feature` varchar(255) NOT NULL DEFAULT 'ai_quiz_generator',
  `prompt_tokens` int(11) NOT NULL DEFAULT 0,
  `completion_tokens` int(11) NOT NULL DEFAULT 0,
  `raw_response` json DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'success',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_quiz_attempt_answers`;
CREATE TABLE `user_quiz_attempt_answers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_quiz_attempt_id` bigint UNSIGNED NOT NULL,
  `question_id` bigint UNSIGNED NOT NULL,
  `question_type` varchar(255) NOT NULL DEFAULT 'multiple_choice',
  `user_answer` longtext DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  `score` float NOT NULL DEFAULT 0,
  `max_score` float NOT NULL,
  `feedback` text DEFAULT NULL,
  `ai_analysis` json DEFAULT NULL,
  `grading_status` varchar(255) NOT NULL DEFAULT 'graded',
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `selected_answer_ids` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `user_streaks`;
CREATE TABLE `user_streaks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `current_streak` int(11) NOT NULL DEFAULT 0,
  `longest_streak` int(11) NOT NULL DEFAULT 0,
  `freeze_count` int(11) NOT NULL DEFAULT 1,
  `last_checkin_date` date DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_generated_quizzes`;
CREATE TABLE `ai_generated_quizzes` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `topic` varchar(255) NOT NULL,
  `difficulty` varchar(255) NOT NULL DEFAULT 'Trung bình',
  `questions_count` int(11) NOT NULL DEFAULT 10,
  `time_limit_minutes` int(11) NOT NULL DEFAULT 15,
  `passing_percentage` int(11) NOT NULL DEFAULT 70,
  `description` text DEFAULT NULL,
  `questions_data` json NOT NULL,
  `user_answers` json DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `correct_count` int(11) DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `revenue_allocations`;
CREATE TABLE `revenue_allocations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint UNSIGNED NOT NULL,
  `order_item_id` bigint UNSIGNED DEFAULT NULL,
  `course_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `instructor_id` bigint UNSIGNED NOT NULL,
  `original_price` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0,
  `paid_amount` decimal(12,2) NOT NULL,
  `platform_fee_percent` decimal(5,2) NOT NULL,
  `platform_fee_amount` decimal(12,2) NOT NULL,
  `instructor_percent` decimal(5,2) NOT NULL,
  `instructor_amount` decimal(12,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'PENDING',
  `refund_deadline` timestamp NOT NULL,
  `unlocked_at` timestamp DEFAULT NULL,
  `refunded_at` timestamp DEFAULT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  `partnership_tier` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `lesson_attachments`;
CREATE TABLE `lesson_attachments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `lesson_id` bigint UNSIGNED NOT NULL,
  `uploaded_by` bigint UNSIGNED DEFAULT NULL,
  `display_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `mime_type` varchar(150) NOT NULL,
  `extension` varchar(10) NOT NULL,
  `size_bytes` bigint UNSIGNED NOT NULL,
  `r2_key` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lesson_attachments_r2_key_unique` (`r2_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `ai_daily_quota_usages`;
CREATE TABLE `ai_daily_quota_usages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `feature` varchar(64) NOT NULL,
  `usage_date` date NOT NULL,
  `used` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ai_daily_quota_usages_user_id_unique` (`user_id`),
  UNIQUE KEY `ai_daily_quota_usages_feature_unique` (`feature`),
  UNIQUE KEY `ai_daily_quota_usages_usage_date_unique` (`usage_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `student_payment_methods`;
CREATE TABLE `student_payment_methods` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `provider` varchar(20) NOT NULL,
  `holder_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT NULL,
  `updated_at` timestamp DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
