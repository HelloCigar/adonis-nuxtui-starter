import Post from '#models/post'
import PostPolicy from '#policies/post_policy'
import PostTransformer from '#transformers/post_transformer'
import CommentTransformer from '#transformers/comment_transformer'
import { createPostValidator, updatePostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  /**
   * Feed of posts, loaded page by page as the user scrolls
   */
  async index({ inertia, request }: HttpContext) {
    return inertia.render('posts/index', {
      posts: inertia
        .scroll(async () => {
          const posts = await Post.query()
            .preload('author')
            .withCount('comments')
            .orderBy('id', 'desc')
            .paginate(request.input('page', 1), 10)

          return PostTransformer.paginate(posts.all(), posts.getMeta())
        })
        .matchOn('id'),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('posts/create', {})
  }

  async store({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)
    const post = await auth.getUserOrFail().related('posts').create(payload)

    session.flash('success', 'Post published')
    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  /**
   * The post renders right away, its comments are deferred and
   * fetched by the browser after the first paint
   */
  async show({ inertia, params }: HttpContext) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('author')
      .withCount('comments')
      .firstOrFail()

    return inertia.render('posts/show', {
      post: PostTransformer.transform(post),
      comments: inertia.defer(
        async () => {
          const comments = await post
            .related('comments')
            .query()
            .preload('author')
            .orderBy('id', 'desc')

          return CommentTransformer.transform(comments)
        },
        { rescue: true }
      ),
    })
  }

  async edit({ bouncer, inertia, params }: HttpContext) {
    const post = await Post.query().where('id', params.id).preload('author').firstOrFail()
    await bouncer.with(PostPolicy).authorize('update', post)

    return inertia.render('posts/edit', { post: PostTransformer.transform(post) })
  }

  async update({ bouncer, params, request, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await bouncer.with(PostPolicy).authorize('update', post)

    const payload = await request.validateUsing(updatePostValidator)
    await post.merge(payload).save()

    session.flash('success', 'Post updated')
    return response.redirect().toRoute('posts.show', { id: post.id })
  }

  async destroy({ bouncer, params, response, session }: HttpContext) {
    const post = await Post.findOrFail(params.id)
    await bouncer.with(PostPolicy).authorize('delete', post)

    await post.delete()

    session.flash('success', 'Post deleted')
    return response.redirect().toRoute('posts.index')
  }
}
