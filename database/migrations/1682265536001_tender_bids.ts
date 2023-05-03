import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tender_bids'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tender_id').unsigned().references('id').inTable('tenders').onDelete('CASCADE')
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')
      table.decimal('price', 20, 4)
      table.unique(['tender_id', 'profile_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('won_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
