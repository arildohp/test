import vine from '@vinejs/vine'
import { Options } from '@swc/core'
import { FieldContext } from '@vinejs/vine/types'

function imageValidation(value: unknown, options: Options, field: FieldContext) {
  field.report('falhou...')
}

export const imageValidationRule = vine.createRule(imageValidation)

export const uploadValidator = vine.compile(
  vine.object({
    image: vine.string().use(imageValidationRule()), // @todo validar usando custom rule https://vinejs.dev/docs/extend/custom_rules
    customer_code: vine.string(),
  }),
)
