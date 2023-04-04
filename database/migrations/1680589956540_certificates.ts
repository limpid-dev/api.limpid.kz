import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'certificates'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
        .notNullable()

      table.string('title', 64).notNullable()
      table.string('description', 256).notNullable()
      table.string('institution', 64).notNullable()
      table.json('attachment').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.date('issued_at').notNullable()
      table.date('expired_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
