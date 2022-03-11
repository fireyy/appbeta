import { Seed, Seeds } from 'lib/interfaces'

export type SeedType = Seed
export type SearchResults = Seeds
export type SearchResultGroup = {
  title: string
  items: Seeds
}

export const search = async (keyword: string): Promise<SearchResults> => {
  const res = await fetch(`/api/search?s=${keyword}`, {
    method: 'GET'
  })
  const result = await res.json()
  return result
}

export const groupResults = (data: SearchResults) => {
  return data.reduce<SearchResultGroup[]>((acc, item) => {
    const title = item.group || 'General'
    const group = acc.find(group => group.title === title)
    if (!group) {
      acc.push({ title, items: [item] })
    } else {
      group.items.push(item)
    }
    return acc
  }, [])
}

export const flattenArray = <T>(contents: T[][] | unknown): T[] => {
  if (!Array.isArray(contents)) return contents as T[]
  return contents.reduce((pre, current) => {
    return pre.concat(
      Array.isArray(current) ? flattenArray(current as any as T[][]) : current,
    )
  }, [])
}

export const isSearchItem = (el?: HTMLElement): boolean => {
  if (!el) return false
  return !!el.attributes.getNamedItem('data-search-item')
}

export const focusNextElement = (
  containerElement: HTMLElement | null,
  done: () => void,
  isBack?: boolean,
) => {
  const focusTo = (child?: HTMLElement) => {
    if (child?.tagName !== 'BUTTON') return
    done()
    ;(child as HTMLButtonElement)?.focus()
  }

  if (!containerElement) return
  const children = Array.from(containerElement.querySelectorAll('button'))
  if (children.length === 0) return

  const index = children.findIndex(child => child === document.activeElement)

  if (index === -1) {
    if (isBack) return
    return focusTo(children[0])
  }

  if (isBack) {
    if (index - 1 < 0) return focusTo(children[children.length - 1])
    return focusTo(children[index - 1])
  }

  if (index + 2 > children.length) return focusTo(children[0])
  focusTo(children[index + 1])
}
