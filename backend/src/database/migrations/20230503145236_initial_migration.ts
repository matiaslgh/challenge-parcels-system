import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  // Create companies table
  await knex.schema.createTable('companies', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable().unique();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  // Create containers table
  await knex.schema.createTable('containers', table => {
    table.string('id').notNullable();
    table.uuid('company_id').notNullable().references('id').inTable('companies');
    table.timestamp('shipping_date').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.primary(['id', 'company_id']);
  });

  // Create parcels table
  await knex.schema.createTable('parcels', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('company_id').notNullable().references('id').inTable('companies');
    table.string('container_id').notNullable();
    table.float('weight').notNullable();
    table.float('value').notNullable();
    table.string('source_department');
    table.string('target_department');
    table.json('recipient').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.foreign(['container_id', 'company_id']).references(['id', 'company_id']).inTable('containers');
  });

  // Create business_rules table
  await knex.schema.createTable('business_rules', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('company_id').notNullable().unique().references('id').inTable('companies');
    table.json('rules').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order of creation
  await knex.schema.dropTable('business_rules');
  await knex.schema.dropTable('parcels');
  await knex.schema.dropTable('containers');
  await knex.schema.dropTable('companies');
  await knex.raw('DROP EXTENSION "uuid-ossp";');
}
