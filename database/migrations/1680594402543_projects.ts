import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.string('description', 2048)
      table.string('location')
      table.string('industry')
      table.string('stage')
      table.decimal('required_money_amount', 20, 4)
      table.decimal('owned_money_amount', 20, 4)
      table.string('required_intellectual_resources', 2048)
      table.string('owned_intellectual_resources', 2048)
      table.string('required_material_resources', 2048)
      table.string('owned_material_resources', 2048)
      table.string('profitability', 2048)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
