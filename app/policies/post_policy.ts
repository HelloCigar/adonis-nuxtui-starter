import type User from '#models/user'
import type Post from '#models/post'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

/**
 * Anyone signed in can read and write posts, only the author can change them
 */
export default class PostPolicy extends BasePolicy {
  update(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }

  delete(user: User, post: Post): AuthorizerResponse {
    return user.id === post.userId
  }
}
