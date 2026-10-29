import { DateTime } from 'luxon'
import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from '#database/factories/user_factory'
import { PostFactory } from '#database/factories/post_factory'

export const CommentFactory = factory
  .define(Comment, async ({ faker }) => {
    return {
      body: faker.hacker.phrase(),
      createdAt: DateTime.fromJSDate(faker.date.recent({ days: 1 })),
    }
  })
  .relation('author', () => UserFactory)
  .relation('post', () => PostFactory)
  .build()
