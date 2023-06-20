import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'auctions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('type', 255)
    })
  }
}
