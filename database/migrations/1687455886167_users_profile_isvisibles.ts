import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('plan_id').unsigned().references('id').inTable('sub_plans').onDelete('SET NULL')
    })
  }
}
