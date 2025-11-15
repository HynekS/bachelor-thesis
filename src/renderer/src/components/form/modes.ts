export const modes = {
  create: 'CREATE',
  update: 'UPDATE'
} as const

export type Mode = (typeof modes)[keyof typeof modes]
