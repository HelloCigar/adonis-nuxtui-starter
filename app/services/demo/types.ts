/**
 * Shapes of the demo data rendered by the dashboard template pages.
 * They mirror the types in `inertia/types/dashboard.d.ts`.
 */
export interface DemoAvatar {
  src?: string
  alt?: string
}

export interface DemoPerson {
  name: string
  email?: string
  avatar?: DemoAvatar
}

export interface DemoCustomer extends DemoPerson {
  id: number
  email: string
  status: 'subscribed' | 'unsubscribed' | 'bounced'
  location: string
}

export interface DemoMail {
  id: number
  unread?: boolean
  from: DemoPerson
  subject: string
  body: string
  date: string
}

export interface DemoMember {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: DemoAvatar
}

export interface DemoNotification {
  id: number
  unread?: boolean
  sender: DemoPerson
  body: string
  date: string
}
