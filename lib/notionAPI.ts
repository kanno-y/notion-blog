import { Client } from '@notionhq/client'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

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

const getPageMetaData = (post: any) => {
  return {
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tag: post.properties.Tag.multi_select[0].name,
  }
}
