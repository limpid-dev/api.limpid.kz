import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ratings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ranking_profile_id').unsigned().references('id').inTable('profiles').onDelete('CASCADE')
      table.integer('rated_profile_id').unsigned().references('id').inTable('profiles').onDelete('CASCADE')
      table.string('cooperation_type', 255)
      table.string('ranking_role', 255)
      table.string('rated_role', 255)
      table.integer('rating_number')
      table.string('comment', 2048)
      table.string('cooperation_url', 2048)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('verified_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
