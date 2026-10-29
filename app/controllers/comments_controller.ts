import Post from '#models/post'
import Comment from '#models/comment'
import CommentPolicy from '#policies/comment_policy'
import { createCommentValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Comments are added and removed optimistically from the post page, so
 * both actions simply redirect back without a flash message
 */
export default class CommentsController {
  async store({ auth, params, request, response }: HttpContext) {
    const post = await Post.findOrFail(params.post_id)
    const payload = await request.validateUsing(createCommentValidator)

    await post.related('comments').create({ ...payload, userId: auth.getUserOrFail().id })

    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  async destroy({ bouncer, params, response }: HttpContext) {
    const comment = await Comment.findOrFail(params.id)
    await bouncer.with(CommentPolicy).authorize('delete', comment)

    await comment.delete()

    return response.redirect().toRoute('posts.show', { id: comment.postId })
  }
}
