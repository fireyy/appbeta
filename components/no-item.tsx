import React from 'react'
import Router from 'next/router'
import { Display, Button } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'

type Props = {
  link: string
  message?: string
}

const NoItem: React.FC<Props> = ({
  link,
  message = 'Nothing to see here. Press \'New\' button to start.',
}) => {
  return (
    <Display caption={message}>
      <Button auto icon={<Plus />} onClick={() => Router.push(link)}>New</Button>
    </Display>
  )
}

export default NoItem
