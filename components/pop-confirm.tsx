import React, { useEffect, useState, Dispatch, MutableRefObject, SetStateAction, MouseEvent } from 'react'
import { Popover, Button, useCurrentState, Text } from '@geist-ui/core'

type Props = {
  visible: boolean
  msg?: string,
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => void
  onClose: () => void
}

const PopConfirm: React.FC<Props> = ({
  visible: customVisible,
  msg = 'Are you sure you want to delete this item?',
  onClose,
  onConfirm,
  children,
}) => {
  const [visible, setVisible] = useState<boolean>(false)
  const closeModal = () => {
    onClose && onClose()
    setVisible(false)
  }
  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    closeModal()
    onConfirm && onConfirm(event)
  }
  useEffect(() => {
    if (typeof customVisible === 'undefined') return
    setVisible(customVisible)
  }, [customVisible])
  const renderContent = () => {
    return (
      <div className="pop-confirm__content">
        <Text p font="12px" px={1}>{msg}</Text>
        <div className="pop-confirm__actions">
          <Button auto scale={1/6} onClick={closeModal}>Cancel</Button>
          <Button type="success" auto scale={1/6} onClick={clickHandler} ml={0.5}>OK</Button>
        </div>
      </div>
    )
  }
  return (
    <>
      <Popover portalClassName="pop-confirm" content={renderContent} visible={visible}
        onVisibleChange={setVisible}>
        {children}
      </Popover>
      <style jsx>{`
        :global(.pop-confirm__actions) {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export type PopConfirmHooksBindings = Pick<Props, 'visible' | 'onClose'>

export const usePopConfirm = (
  initialVisible: boolean = false,
): {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  currentRef: MutableRefObject<boolean>
  bindings: PopConfirmHooksBindings
} => {
  const [visible, setVisible, currentRef] = useCurrentState<boolean>(initialVisible)

  return {
    visible,
    setVisible,
    currentRef,
    bindings: {
      visible,
      onClose: () => setVisible(false),
    },
  }
}

export default PopConfirm
