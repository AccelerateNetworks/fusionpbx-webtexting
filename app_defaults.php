<?php

//webtexting_threads.thread_uuid + webtexting_threads_last_seen + webtexting_message_templates
//schema reconciliation. the dsl in app_config.php declares the thread_uuid column but can't
//express DEFAULT uuid_generate_v4() or UNIQUE constraints; raw migrations encoded here.
//this lives in app_defaults.php (not app_config.php) because app_config.php is included by
//many regular pages where $database is not defined; app_defaults.php only runs from the
//upgrade/defaults process with $database set.
//pgsql-specific. uuid_generate_v4() requires uuid-ossp extension.
//note: $database->execute() swallows PDOExceptions and returns false, so check return values.

if ($domains_processed == 1 && isset($database)) {

	//run a statement, throwing on failure so the transaction below can roll back
		$webtexting_execute = function ($sql) use ($database) {
			if ($database->execute($sql) === false) {
				throw new Exception($database->message['message'] ?? 'unknown database error');
			}
		};

	//uuid-ossp is needed by the thread_uuid default and both tables below
		$database->execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");

	//webtexting_threads.thread_uuid default + unique constraint
		$default_applied = $database->select(
			"SELECT 1 FROM information_schema.columns
			 WHERE table_name = 'webtexting_threads'
			   AND column_name = 'thread_uuid'
			   AND column_default LIKE '%uuid_generate_v4%'",
			[], 'column'
		);
		$unique_applied = $database->select(
			"SELECT 1 FROM pg_constraint WHERE conname = 'webtexting_threads_thread_uuid_key'",
			[], 'column'
		);

		if (!$default_applied || !$unique_applied) {
			echo "webtexting: applying webtexting_threads.thread_uuid schema migration (one-time post-install)...<br/>";
			try {
				$webtexting_execute("BEGIN");

				// ADD COLUMN IF NOT EXISTS in case the dsl schema step hasn't added it yet.
				$webtexting_execute("ALTER TABLE webtexting_threads ADD COLUMN IF NOT EXISTS thread_uuid uuid");

				if (!$default_applied) {
					$webtexting_execute("UPDATE webtexting_threads SET thread_uuid = uuid_generate_v4() WHERE thread_uuid IS NULL");
					$webtexting_execute("ALTER TABLE webtexting_threads ALTER COLUMN thread_uuid SET DEFAULT uuid_generate_v4()");
				}

				if (!$unique_applied) {
					$webtexting_execute("ALTER TABLE webtexting_threads ADD CONSTRAINT webtexting_threads_thread_uuid_key UNIQUE (thread_uuid)");
				}

				$webtexting_execute("COMMIT");
				echo "webtexting: thread_uuid schema migration applied.<br/>";
			} catch (Throwable $e) {
				$database->execute("ROLLBACK");
				echo "webtexting: thread_uuid schema migration FAILED: " . htmlspecialchars($e->getMessage()) . "<br/>";
				echo "webtexting: apply manually: <code>BEGIN; CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; ALTER TABLE webtexting_threads ADD COLUMN IF NOT EXISTS thread_uuid uuid; UPDATE webtexting_threads SET thread_uuid = uuid_generate_v4() WHERE thread_uuid IS NULL; ALTER TABLE webtexting_threads ALTER COLUMN thread_uuid SET DEFAULT uuid_generate_v4(); ALTER TABLE webtexting_threads ADD CONSTRAINT webtexting_threads_thread_uuid_key UNIQUE (thread_uuid); COMMIT;</code><br/>";
			}
		}

	//webtexting_threads_last_seen — read-state tracking table for the conversation viewer.
	//pgsql-specific (uuid, timestamptz). idempotent via IF NOT EXISTS.
		$database->execute("CREATE TABLE IF NOT EXISTS webtexting_threads_last_seen (
			thread_uuid    uuid NOT NULL,
			extension_uuid uuid NOT NULL,
			domain_uuid    uuid NOT NULL,
			timestamp      timestamptz,
			last_seen_uuid uuid NOT NULL DEFAULT uuid_generate_v4(),
			CONSTRAINT webtexting_threads_last_seen_pkey PRIMARY KEY (last_seen_uuid)
		)");

	//webtexting_message_templates — canned-reply / template storage.
	//pgsql-specific (uuid, timestamptz). idempotent via IF NOT EXISTS.
	//note: pkey constraint name has misspelled plural ("messages_templates") — replicated
	//verbatim to match production schema on sfo; cosmetic typo, harmless.
		$database->execute("CREATE TABLE IF NOT EXISTS webtexting_message_templates (
			email_template_uuid  uuid NOT NULL DEFAULT uuid_generate_v4(),
			domain_uuid          uuid,
			template_language    text,
			template_category    text,
			template_subcategory text,
			template_subject     text,
			template_body        text,
			template_type        text,
			template_enabled     text,
			template_description text,
			insert_date          timestamptz,
			insert_user          uuid,
			update_date          timestamptz,
			update_user          uuid,
			template_name        text,
			CONSTRAINT webtexting_messages_templates_pkey PRIMARY KEY (email_template_uuid)
		)");

		unset($webtexting_execute, $default_applied, $unique_applied);
}
