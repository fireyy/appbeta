import React, { useEffect, useState } from 'react'
import { Card, Grid, Text, useTheme } from '@geist-ui/core'
import useSWR from 'swr'
import ChevronRight from '@geist-ui/icons/chevronRight'
import { PackageItem } from 'lib/interfaces'
import { bytesStr, timeAgo } from 'lib/utils'
import NoItem from 'components/no-item'
import PackageDetail from 'components/package-detail'
import Skeleton from 'components/skeleton'

type Props = {
  slug: string
  appId: number
  lastPkgId: number
}

const PackageItems: React.FC<Props> = ({ slug, appId, lastPkgId }) => {
  const theme = useTheme()
  const [detailId, setDetailId] = useState(0)

  const [lastId, setLastPkgId] = useState(lastPkgId)
  const [current, setCurrent] = useState(null)
  const [sideVisible, setSideVisible] = useState(false)

  const { data: packages = [], isValidating, mutate } = useSWR<PackageItem[]>(appId && `/api/apps/${appId}/packages`)
  const isLoading = isValidating && packages.length === 0

  useEffect(() => {
    setCurrent(packages.find(p => p.id === detailId))
  }, [detailId])

  const handleDetail = (id) => {
    setDetailId(id)
    setSideVisible(true)
  }

  const handleUpdate = (type, payload) => {
    if (type === 'remove') {
      mutate(packages.filter((item) => item.id !== detailId))
    } else if (type === 'edit') {
      mutate((mate) => {
        const index = mate.findIndex((item) => item.id === detailId)
        mate[index].changelog = payload.changelog
        return mate
      })
    } else if (type === 'setDefault') {
      setLastPkgId(detailId)
    }
  }

  return (
    <>
      <div className="card-box">
        {
          (isLoading ? [{id:0}, {id:1}, {id:2}] : packages).map(p => (
            <Card key={p.id} onClick={() => handleDetail(p.id)} className={p.id === lastId ? 'default' : ''}>
              <Grid.Container gap={2} alignItems="center">
                <Grid xs={12} direction="column">
                  <Text h6 my={0}>
                    {
                      isLoading ? <Skeleton inline width={150} /> : <>{p.name} {p.version}({p.buildVersion})</>
                    }
                  </Text>
                  <Text span font="14px" style={{ color: 'var(--body-color)' }}>
                  {
                    isLoading ? <Skeleton inline width={50} /> : bytesStr(p.size)
                  }
                  </Text>
                </Grid>
                <Grid xs={12} justify="flex-end">
                  <Text span font="14px" mr={0.5} style={{ color: 'var(--body-color)' }}>
                  {
                    isLoading ? <Skeleton inline width={100} /> : timeAgo(p.updatedAt)
                  }
                  </Text>
                  <ChevronRight color={theme.palette.accents_4} />
                </Grid>
              </Grid.Container>
            </Card>
          ))
        }
      </div>
      {
        current && <PackageDetail lastPkgId={lastPkgId} visible={sideVisible} setVisible={setSideVisible} data={current} onUpdate={handleUpdate} />
      }
      {
        packages.length === 0 && !isValidating && appId && (
          <NoItem link={`/apps/${appId}/packages/new`} />
        )
      }
      <style jsx>{`
        .card-box :global(.card) {
          border-radius: 0;
          cursor: pointer;
        }
        .card-box :global(.card:hover) {
          background-color: ${theme.palette.accents_1};
        }
        .card-box :global(.card + .card) {
          border-top: 0;
        }
        .card-box :global(.card:first-child) {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        .card-box :global(.card:last-child) {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      `}</style>
    </>
  )
}

export default PackageItems
