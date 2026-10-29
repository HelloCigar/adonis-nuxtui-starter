import type Comment from '#models/comment'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import CommentPolicy from '#policies/comment_policy'
import UserTransformer from '#transformers/user_transformer'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class CommentTransformer extends BaseTransformer<Comment> {
  @inject()
  async toObject({ bouncer }: HttpContext) {
    return {
      ...this.pick(this.resource, ['id', 'body', 'createdAt']),
      postedAt: this.resource.createdAt.toRelative() ?? '',
      author: UserTransformer.transform(this.whenLoaded(this.resource.author)),
      permissions: {
        delete: await bouncer.with(CommentPolicy).allows('delete', this.resource),
      },
    }
  }
}
