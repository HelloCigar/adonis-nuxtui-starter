import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'
import { PostFactory } from '#database/factories/post_factory'

/**
 * Seeds three demo authors (password: "password") and enough posts to
 * page through the infinite-scroll feed, each commented on by the authors
 */
export default class extends BaseSeeder {
  async run() {
    const users = await UserFactory.merge([
      { fullName: 'Ada Lovelace', email: 'ada@example.com' },
      { fullName: 'Alan Turing', email: 'alan@example.com' },
      { fullName: 'Grace Hopper', email: 'grace@example.com' },
    ]).createMany(3)

    for (const user of users) {
      await PostFactory.merge({ userId: user.id })
        .with('comments', 3, (comment) =>
          comment.tap((row, { faker }) => {
            row.userId = faker.helpers.arrayElement(users).id
          })
        )
        .createMany(15)
    }
  }
}
