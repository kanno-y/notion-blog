import React from 'react'

export const getPageLink = (tag: string, page: number) => {
  return tag ? `/posts/tags/${tag}/page/${page}` : `/posts/page/${page}`
}
