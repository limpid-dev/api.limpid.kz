import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').unique()
      table.string('password')
      table.string('remember_me_token')
      table.string('first_name')
      table.string('last_name')
      table.string('patronymic_name')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('verified_at', { useTz: true })
      table.date('born_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
