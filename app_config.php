<?php
//application details
$apps[$x]['name'] = "Web Texting";
$apps[$x]['uuid'] = "0fc24db5-97d4-4f92-9a4c-fd6163c489eb";
$apps[$x]['category'] = "App";
$apps[$x]['subcategory'] = "";
$apps[$x]['version'] = "0.1";
$apps[$x]['license'] = "GNU General Public License v3";
$apps[$x]['url'] = "https://github.com/AccelerateNetworks/fusionpbx-webtexting";
$apps[$x]['description']['en-us'] = "Web Texting";

$y=0;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_clients";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "endpoint";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "auth";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "p256dh";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$y++;

$apps[$x]['db'][$y]['table']['name'] = "webtexting_subscriptions";
$apps[$x]['db'][$y]['table']['parent'] = "";
$z=0;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "subscription_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "webtexting_clients";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_extensions";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "remote_identifier";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "notify of incoming messages from this number or group ID. NULL if all messages should be notified";

$y++;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_settings";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "setting";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "value";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$y++;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_messages";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "message_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "start_stamp";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "timestamp";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "date";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "timestamp";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "from_number";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "to_number";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "group_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "webtexting_groups";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "group_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "message";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "content_type";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "direction";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "delivered";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "boolean";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "boolean";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "boolean";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "carrier delivery status: true=delivered, false=failed, NULL=pending/unknown";


$y++;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_groups";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "group_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_extensions";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "members";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "JSON-encoded list of group members";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "name";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "user-configurable group name";

$y++;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_destinations";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "phone_number";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_extensions";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";


$y++;
$z=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_threads";
$apps[$x]['db'][$y]['table']['parent'] = "";
$apps[$x]['db'][$y]['fields'][$z]['name'] = "remote_number";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "local_number";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "webtexting_destinations";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "phone_number";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "group_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "webtexting_groups";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "group_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "last_message";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = 'timestamptz';
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = 'date';
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = 'date';
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "thread_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "stable per-thread identifier; DEFAULT uuid_generate_v4() + UNIQUE applied via raw PHP below (not DSL-expressible)";

//webtexting_threads.thread_uuid + webtexting_threads_last_seen + webtexting_message_templates
//schema reconciliation. dsl above declares the thread_uuid column but can't express
//DEFAULT uuid_generate_v4() or UNIQUE constraints; raw migrations encoded here.
//pgsql-specific. uuid_generate_v4() requires uuid-ossp extension.

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
			$database->execute("BEGIN");
			$database->execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");

			// DSL's column-create runs AFTER this raw PHP block, so add the column
			// defensively here. ADD COLUMN IF NOT EXISTS is the idempotent form.
			$database->execute("ALTER TABLE webtexting_threads ADD COLUMN IF NOT EXISTS thread_uuid uuid");

			if (!$default_applied) {
				$database->execute("UPDATE webtexting_threads SET thread_uuid = uuid_generate_v4() WHERE thread_uuid IS NULL");
				$database->execute("ALTER TABLE webtexting_threads ALTER COLUMN thread_uuid SET DEFAULT uuid_generate_v4()");
			}

			if (!$unique_applied) {
				$database->execute("ALTER TABLE webtexting_threads ADD CONSTRAINT webtexting_threads_thread_uuid_key UNIQUE (thread_uuid)");
			}

			$database->execute("COMMIT");
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
