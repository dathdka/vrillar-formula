import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("drivers", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("nationality");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("drivers");
}
