import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'educations'

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
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('institution').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.date('started_at').notNullable()
      table.date('finished_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
