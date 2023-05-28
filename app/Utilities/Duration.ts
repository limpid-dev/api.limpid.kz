import { ColumnOptions, LucidModel, OptionalTypedDecorator } from '@ioc:Adonis/Lucid/Orm'
import { Duration, DurationOptions } from 'luxon'

export type DurationDecorator = (
  options?: DurationOptions & Partial<ColumnOptions>
) => OptionalTypedDecorator<Duration | null>

export const duration: DurationDecorator = (options) => {
  return function (target, property) {
    const Model = target.constructor as LucidModel
    Model.boot()

    /**
     * Separate decorator options from the column options
     */
    const { locale, numberingSystem, conversionAccuracy, ...columnOptions } = options || {}

    /**
     * Define the property as a column too
     */
    Model.$addColumn(property, {
      consume: (value) => (value ? Duration.fromISO(value) : null),
      prepare: (value) => (value ? value.toISO() : null),
      serialize: (value) => (value ? value.toISO() : null),
      ...columnOptions,
    })
  }
}
