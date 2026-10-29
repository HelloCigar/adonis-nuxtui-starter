import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { PostFactory } from '#database/factories/post_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password',
    }
  })
  .relation('posts', () => PostFactory)
  .build()
