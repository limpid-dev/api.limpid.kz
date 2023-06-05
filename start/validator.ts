/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator'
import { Duration } from 'luxon'

validator.rule(
  'duration',
  (value: string, _, options) => {
    const isValid = Duration.fromISO(value).isValid

    if (!isValid) {
      options.errorReporter.report(
        options.pointer,
        'duration',
        'duration validation failed',
        options.arrayExpressionPointer
      )
    }
  },
  undefined,
  ['string']
)
