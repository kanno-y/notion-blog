import { Post } from '@/pages'
import React from 'react'

export const SinglePost = (props: Post) => {
  // 分割代入
  const { title, description, date, slug, tags } = props
  return <div>Singlepost</div>
}
