import string from '@adonisjs/core/helpers/string'
import { beforeCreate, type BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

/**
 * Gives a model a UUID v4 primary key, created by the app before insert.
 *
 * ```ts
 * export default class Post extends compose(PostSchema, withUuid()) {}
 * ```
 */
export function withUuid() {
  return <Model extends NormalizeConstructor<typeof BaseModel>>(superclass: Model) => {
    class ModelWithUuid extends superclass {
      static selfAssignPrimaryKey = true

      @beforeCreate()
      static assignUuid(model: ModelWithUuid) {
        const primaryKey = (model.constructor as typeof BaseModel).primaryKey
        if (model.$getAttribute(primaryKey)) {
          return
        }

        model.$setAttribute(primaryKey, string.uuid())
      }
    }

    return ModelWithUuid
  }
}
