import { NUMBER_OF_POSTS_PER_PAGE } from '@/constants/constants'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { start } from 'repl'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    page_size: 100,
  })
  const allPosts = posts.results
  return allPosts.map((post) => {
    return getPageMetaData(post)
  })
}
export type MetadataProps = {
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
}
const getPageMetaData = (post: any): MetadataProps => {
  const getTags = (tags: any) => {
    const allTags = tags.map((tag: any) => tag.name)
    return allTags
  }
  return {
    title: post.properties.Name.title[0]?.plain_text || null,
    description: post.properties.Description.rich_text[0]?.plain_text || null,
    date: post.properties.Date.date?.start || null,
    slug: post.properties.Slug.rich_text[0]?.plain_text || null,
    tags: getTags(post.properties.Tags.multi_select) || null,
  }
}

export const getSinglePost = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  })
  const page = response.results[0]
  const metaData = getPageMetaData(page)

  const mdblocks = await n2m.pageToMarkdown(page.id)
  const mdString = n2m.toMarkdownString(mdblocks)
  console.log(mdString)
  return { metaData, markdown: mdString }
}

// TOPページ用記事の取得（4つ）
export const getPostsForTopPage = async (pageSize = 4) => {
  const allPosts = await getAllPosts()
  return await allPosts.slice(0, pageSize)
}

// ページ番号に応じた記事取得
export const getPostsByPage = async (page: number) => {
  const allPosts = await getAllPosts()
  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE
  return allPosts.slice(startIndex, endIndex)
}

// ページ数を取得
export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts()

  return (
    Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
    (allPosts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}

//
export const getPostsTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  )

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE
  return posts.slice(startIndex, endIndex)
}

export const getNumberOfPagesByTags = async (tagName: string) => {
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((post) =>
    post.tags.find((tag) => tag === tagName)
  )
  return (
    Math.floor(posts.length / NUMBER_OF_POSTS_PER_PAGE) +
    (posts.length % NUMBER_OF_POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}

export const getAllTags = async () => {
  const allPosts = await getAllPosts()
  const allTagsDupulicationLists = allPosts.flatMap((post) => post.tags)
  const set = new Set(allTagsDupulicationLists)
  const allTagsList = Array.from(set)
  return allTagsList
}
