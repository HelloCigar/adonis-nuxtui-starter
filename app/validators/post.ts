import vine from '@vinejs/vine'

/**
 * Query string of the posts feed: how to browse it (`?view=paginated`,
 * infinite scroll by default) and which page to load
 */
export const listPostsValidator = vine.create({
  view: vine.enum(['infinite', 'paginated']).optional(),
  page: vine.number().withoutDecimals().min(1).optional(),
})

export const createPostValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  body: vine.string().trim().minLength(1).maxLength(10_000),
})

export const updatePostValidator = vine.create({
  title: vine.string().trim().minLength(3).maxLength(255),
  body: vine.string().trim().minLength(1).maxLength(10_000),
})
