import vine from '@vinejs/vine'

export const createPostValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  body: vine.string().trim().minLength(1).maxLength(10_000),
})

export const updatePostValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  body: vine.string().trim().minLength(1).maxLength(10_000),
})
