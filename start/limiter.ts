/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

/**
 * Comments per signed-in user, so spamming the comment form (or replaying
 * the request) cannot flood a post
 */
export const commentsThrottle = limiter.define('comments', (ctx) => {
  return limiter
    .allowRequests(5)
    .every('1 minute')
    .usingKey(`comments_user_${ctx.auth.getUserOrFail().id}`)
    .limitExceeded((error) => {
      error.setMessage(
        `You're commenting too fast. Try again in ${error.response.availableIn} seconds.`
      )
    })
})
