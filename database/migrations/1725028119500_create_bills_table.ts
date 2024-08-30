import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bills'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('type')
      table.string('image')
      table.string('customer_code')
      table.timestamp('measure_datetime')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
