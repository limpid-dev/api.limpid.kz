import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()
      table.string('title', 255).notNullable()
      table.string('description', 2048).notNullable()
      table.string('location', 255).notNullable()
      table.string('industry', 255).notNullable()
      table.string('stage', 255).notNullable()
      table.decimal('required_money_amount', 20, 4).notNullable()
      table.decimal('owned_money_amount', 20, 4).notNullable()
      table.string('required_intellectual_resources', 2048).notNullable()
      table.string('owned_intellectual_resources', 2048).notNullable()
      table.string('required_material_resources', 2048).notNullable()
      table.string('owned_material_resources', 2048).notNullable()
      table.string('profitability', 2048).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
