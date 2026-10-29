import Post from '#models/post'
import PostPolicy from '#policies/post_policy'
import PostTransformer from '#transformers/post_transformer'
import CommentTransformer from '#transformers/comment_transformer'
import { createPostValidator, updatePostValidator } from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'
import { setTimeout as sleep } from 'node:timers/promises'

/**
 * The `sleep` calls are artificial delays so the Inertia features are
 * noticeable on a local SQLite database. Remove them in a real app.
 */
export default class PostsController {
  /**
   * Feed of posts, loaded page by page as the user scrolls
   */
  async index({ inertia, request }: HttpContext) {
    return inertia.render('posts/index', {
      posts: inertia
        .scroll(async () => {
          const page = request.input('page', 1)

          /**
           * Slow down the following pages so the infinite scroll loader shows
           */
          if (page > 1) {
            await sleep(1000)
          }

          const posts = await Post.query()
            .preload('author')
            .withCount('comments')
            .orderBy('id', 'desc')
            .paginate(page, 10)

          return PostTransformer.paginate(posts.all(), posts.getMeta())
        })
        .matchOn('id'),
    })
  }

  async create({ inertia }: HttpContext) {
    await sleep(1000)
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
   * fetched by the browser after the first paint.
   *
   * Loading the deferred comments, and adding or deleting one, reloads
   * this action partially, so the 800ms delay applies to those requests
   * too and keeps the optimistic comment on screen for a while.
   */
  async show({ inertia, params }: HttpContext) {
    await sleep(800)

    const post = await Post.query()
      .where('id', params.id)
      .preload('author')
      .withCount('comments')
      .firstOrFail()

    return inertia.render('posts/show', {
      post: PostTransformer.transform(post),
      comments: inertia.defer(
        async () => {
          await sleep(500)

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
    await sleep(1000)

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
