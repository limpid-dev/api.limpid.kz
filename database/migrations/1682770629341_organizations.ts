import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('bin')
      table.string('description', 2048)
      table.string('industry')
      table.string('owned_intellectual_resources', 2048)
      table.string('owned_material_resources', 2048)
      table.string('perfomance', 2048)
      table.string('type')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
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
