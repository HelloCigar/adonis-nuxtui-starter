import { DateTime } from 'luxon'
import factory from '@adonisjs/lucid/factories'
import Post from '#models/post'
import { UserFactory } from '#database/factories/user_factory'
import { CommentFactory } from '#database/factories/comment_factory'

export const PostFactory = factory
  .define(Post, async ({ faker }) => {
    return {
      title: faker.company.catchPhrase(),
      body: faker.helpers.multiple(() => faker.hacker.phrase(), { count: 3 }).join(' '),
      /**
       * Somewhere in the past month, but at least a day old so the
       * comments (posted within the last day) always come after it
       */
      createdAt: DateTime.fromJSDate(
        faker.date.recent({ days: 30, refDate: DateTime.now().minus({ days: 1 }).toJSDate() })
      ),
    }
  })
  .relation('author', () => UserFactory)
  .relation('comments', () => CommentFactory)
  .build()
