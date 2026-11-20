import { Handle, NodeProps, Position, useReactFlow } from '@xyflow/react'
import { useEffect, useRef, useState } from 'react'
import cx from 'classnames'

import styles from './styles.module.css'
import { Button } from '@renderer/components/ui/button'
import api from '@renderer/services/api-client'
import { Node } from '@db/schema/node'

const DefaultNode = (props: NodeProps) => {
  const { setNodes } = useReactFlow()
  const [isEditMode, setIsEditMode] = useState(false)

  const closeOpenInput = () => {
    setIsEditMode(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.addEventListener('pane-click', closeOpenInput)

    return () => document.removeEventListener('pane-click', closeOpenInput)
  }, [])

  return (
    <div className="text-updater-node">
      <div className={cx('relative', styles.contentWrapper)} data-content={props.data.label}>
        {isEditMode ? (
          <div className="absolute inset-0 nodrag">
            <div className="relative h-full">
              <input
                ref={inputRef}
                id="text"
                name="text"
                defaultValue={props.data.label}
                className="absolute inset-0 text-center"
                autoFocus
                onFocus={(event) => {
                  // Select the current input content
                  event.currentTarget.setSelectionRange(0, -1)
                }}
              />
              <Button
                className="absolute px-2 py-0 h-auto top-full left-0 right-0 mt-1 z-1"
                onClick={() => {
                  const inputValue = inputRef.current?.value
                  if (!inputValue) return

                  api
                    .patch<Node>(`/nodes/${props.id}`, undefined, {
                      title: inputValue
                    })
                    .then((res) => {
                      setNodes((prevNodes) =>
                        prevNodes.map((node) => {
                          return node.id === props.id
                            ? { ...node, id: `${res.id}`, data: { ...node.data, label: res.title } }
                            : node
                        })
                      )
                      setIsEditMode(false)
                    })
                }}
              >
                update
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <label
              htmlFor="text"
              className="text-center inline-block"
              onClick={() => {
                setIsEditMode(true)
              }}
            >
              {props.data.label}
            </label>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
    </div>
  )
}

export default DefaultNode
