import React from 'react'
import Router from 'next/router'
import { Display, Button } from '@geist-ui/core'
import Plus from '@geist-ui/icons/plus'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  link?: string
  message?: string
}

const NoItem: React.FC<Props> = ({
  link,
  message,
}) => {
  const { t } = useTranslation('common')

  return (
    <Display caption={message || t('Nothing to see here. Press \'New\' button to start.')}>
      { link && <Button auto icon={<Plus />} onClick={() => Router.push(link)}>{t('New')}</Button> }
    </Display>
  )
}

export default NoItem
