import User from '#models/user'
import { DateTime } from 'luxon'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const authors = [
  { fullName: 'Ada Lovelace', email: 'ada@example.com' },
  { fullName: 'Alan Turing', email: 'alan@example.com' },
  { fullName: 'Grace Hopper', email: 'grace@example.com' },
]

const topics = [
  'Shipping on Fridays',
  'Why I keep coming back to SQLite',
  'Notes on optimistic UI',
  'Infinite scroll, revisited',
  'The case for boring technology',
  'What deferred props taught me',
  'Small teams, small tools',
  'Reading other people’s code',
  'Naming things, again',
  'A week without a framework',
]

const sentences = [
  'It started as a small experiment and slowly took over the whole codebase.',
  'Most of the complexity came from state that lived in two places at once.',
  'Moving the logic back to the server removed an entire class of bugs.',
  'The interesting part is how little code the final version needed.',
  'Users never noticed the change, which was exactly the point.',
  'I would make the same trade-off again, with a few caveats.',
]

const replies = [
  'Great write-up, thanks for sharing!',
  'We ran into the exact same thing last month.',
  'Curious how this holds up with more traffic.',
  'This finally made it click for me.',
  'Bookmarked. The second section is gold.',
  'Not sure I agree, but it is a fair argument.',
]

/**
 * Seeds a few authors (password: "password") and enough posts to page
 * through the infinite-scroll feed
 */
export default class extends BaseSeeder {
  async run() {
    const users = await User.updateOrCreateMany(
      'email',
      authors.map((author) => ({ ...author, password: 'password' }))
    )

    for (let index = 0; index < 45; index++) {
      const author = users[index % users.length]
      const createdAt = DateTime.now().minus({ hours: (45 - index) * 7 })

      const post = await author.related('posts').create({
        title: `${topics[index % topics.length]} #${index + 1}`,
        body: Array.from({ length: 3 }, (_, i) => sentences[(index + i) % sentences.length]).join(
          ' '
        ),
        createdAt,
      })

      await post.related('comments').createMany(
        Array.from({ length: index % 5 }, (_, i) => ({
          body: replies[(index + i) % replies.length],
          userId: users[(index + i + 1) % users.length].id,
          createdAt: createdAt.plus({ minutes: (i + 1) * 20 }),
        }))
      )
    }
  }
}
