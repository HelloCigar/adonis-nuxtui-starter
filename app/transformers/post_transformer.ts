import type Post from '#models/post'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PostPolicy from '#policies/post_policy'
import UserTransformer from '#transformers/user_transformer'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class PostTransformer extends BaseTransformer<Post> {
  @inject()
  async toObject({ bouncer }: HttpContext) {
    const policy = bouncer.with(PostPolicy)

    return {
      ...this.pick(this.resource, ['id', 'title', 'body', 'createdAt']),
      postedAt: this.resource.createdAt.toRelative() ?? '',
      commentsCount: Number(this.resource.$extras.comments_count ?? 0),
      author: UserTransformer.transform(this.whenLoaded(this.resource.author)),
      permissions: {
        update: await policy.allows('update', this.resource),
        delete: await policy.allows('delete', this.resource),
      },
    }
  }
}
