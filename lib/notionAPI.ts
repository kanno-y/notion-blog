import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

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
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
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
