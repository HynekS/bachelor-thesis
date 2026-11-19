import DefaultNode from '../diagram/custom-node/default'

export const NodeTypes = {
  default: 'default'
} as const

export const nodeTypes = {
  [NodeTypes.default]: DefaultNode
} as const
