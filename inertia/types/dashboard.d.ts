/**
 * Props passed from AdonisJS controllers to Inertia pages must be
 * JSON-serializable, so these are `type` aliases (not interfaces) made of
 * plain data. That keeps `inertia.render()` calls type-checked.
 */
export type Avatar = {
  src?: string
  alt?: string
  text?: string
}

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export type User = {
  id: number
  name: string
  email: string
  avatar?: Avatar
  status: UserStatus
  location: string
}

export type Person = {
  name: string
  email?: string
  avatar?: Avatar
}

export type Mail = {
  id: number
  unread?: boolean
  from: Person
  subject: string
  body: string
  date: string
}

export type Member = {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: Avatar
}

export type Stat = {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export type Sale = {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export type Notification = {
  id: number
  unread?: boolean
  sender: Person
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export type Range = {
  start: Date
  end: Date
}
