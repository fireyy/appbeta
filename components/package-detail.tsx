import React, { useEffect, useState } from 'react'
import { Drawer, Text, Textarea, useInput, useToasts, Modal, useModal, Button } from '@geist-ui/core'
import { PackageItem } from 'lib/interfaces'
import { bytesStr, timeAgo, formatDate } from 'lib/utils'
import useTranslation from 'next-translate/useTranslation'

type Props = {
  lastPkgId: number,
  visible: boolean,
  setVisible: (state: boolean) => void,
  data: PackageItem,
  onUpdate: (type: string, payload?: any) => void
}

const PackageDetail: React.FC<Props> = ({ lastPkgId, visible, setVisible, data, onUpdate }) => {
  const {state: changelog, setState: setChangelog, bindings: changelogBindings} = useInput('')
  const { setVisible: setModalVisible, bindings: modalBindings } = useModal()
  const { setToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const isDefault = data && data.id === lastPkgId
  const { t } = useTranslation('common')

  useEffect(() => {
    setChangelog(data?.changelog)
  }, [data])

  const handleDelete = async () => {
    onUpdate && onUpdate('remove')
    await fetch(`/api/apps/${data.appId}/packages/${data.id}`, {
      method: 'DELETE',
    })
    setToast({
      text: 'Removed package successfully.',
      type: 'success',
    })
  }
  const saveEdit = async (): Promise<void> => {
    setLoading(true)
    await fetch(`/api/apps/${data.appId}/packages/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changelog
      })
    })
    setModalVisible(false)
    setLoading(false)
    onUpdate && onUpdate('edit', { changelog })
    setToast({
      text: 'Updated package changelog successfully.',
      type: 'success',
    })
  }
  const handleCheck = async (row: PackageItem) => {
    setLoading(true)
    await fetch(`/api/apps/${data.appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lastPkgId: row.id,
        lastPkgSize: row.size,
        lastVersion: row.version,
      })
    })
    onUpdate && onUpdate('setDefault')
    setLoading(false)
  }

  return (
    <>
      <Drawer visible={visible} onClose={() => setVisible(false)} placement="right">
        <Drawer.Title>{data?.name}</Drawer.Title>
        <Drawer.Subtitle>{data?.bundleId}</Drawer.Subtitle>
        <Drawer.Content>
          <div className="package-detail">
            <Text h5>{t('Version')}</Text>
            <Text p>{data?.version} ({data?.buildVersion})</Text>
            <Text h5>{t('Size')}</Text>
            <Text p>{bytesStr(data?.size || 0)}</Text>
            <Text h5>{t('createdAt')}</Text>
            <Text p>{formatDate(data?.createdAt)}</Text>
            <Text h5>{t('updatedAt')}</Text>
            <Text p>{timeAgo(data?.updatedAt)}</Text>
            <Text h5>{t('Changelog')}</Text>
            <Textarea placeholder="Text" width="100%" height="100%" {...changelogBindings} />
            <div className="button-area">
              <Button type="secondary" loading={loading} onClick={saveEdit}>{t('Save')}</Button>
              <Button type="default" loading={loading} disabled={isDefault} onClick={() => handleCheck(data)}>{isDefault ? t('It\'s Default') : t('Set Default')}</Button>
              <Button type="error" loading={loading}>{t('Delete')}</Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
      <Modal {...modalBindings}>
        <Modal.Title>{t('Confirm')}</Modal.Title>
        <Modal.Content>
          {t('Are you sure you want to delete this item?')}
        </Modal.Content>
        <Modal.Action passive onClick={() => setModalVisible(false)}>{t('Cancel')}</Modal.Action>
        <Modal.Action loading={loading} onClick={() => handleDelete()}>{t('OK')}</Modal.Action>
      </Modal>
      <style jsx>{`
        .package-detail {
          width: 350px;
        }
        .package-detail .button-area {
          display: flex;
          flex-direction: column;
        }
        .package-detail .button-area :global(.btn) {
          margin-top: 10px;
        }
      `}</style>
    </>
  )
}

export default PackageDetail
