import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

enum Type {
  Water = 'water',
  Gas = 'gas'
}

export default class Bill extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  declare type: Type
  declare customer_code: String
  declare measure_datetime: DateTime
}
