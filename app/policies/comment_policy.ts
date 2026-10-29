import type User from '#models/user'
import type Comment from '#models/comment'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class CommentPolicy extends BasePolicy {
  delete(user: User, comment: Comment): AuthorizerResponse {
    return user.id === comment.userId
  }
}
