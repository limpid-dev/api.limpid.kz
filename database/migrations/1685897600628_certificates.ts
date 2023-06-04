import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'certificates'

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
      table.string('description', 255).notNullable()
      table.string('institution', 255).notNullable()
      table.json('attachment').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.date('issued_at').notNullable()
      table.date('expired_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
