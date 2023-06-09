import {
  MetadataProps,
  getAllPosts,
  getAllTags,
  getPostsForTopPage,
} from '@/lib/notionAPI'
import Head from 'next/head'
import { SinglePost } from '@/components/Post/SinglePost'
import { GetStaticProps } from 'next/types'
import Link from 'next/link'
import { Tag } from '@/components/Tag/Tag'

export const getStaticProps: GetStaticProps = async () => {
  const fourPosts: MetadataProps[] = await getPostsForTopPage()
  const allTags = await getAllTags()
  return {
    props: { fourPosts, allTags },
    revalidate: 60, // 60秒ごと更新する(ISR)
  }
}
type Props = {
  fourPosts: MetadataProps[]
  allTags: string[]
}

export default function Home({ fourPosts, allTags }: Props) {
  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
      </main>
      {fourPosts.map((post: any) => (
        <div className="mx-4" key={post.title}>
          <SinglePost
            title={post.title}
            description={post.description}
            date={post.date}
            slug={post.slug}
            tags={post.tags}
            isPaginationPage={false}
          />
        </div>
      ))}
      <Link
        href={'/posts/page/1'}
        className="mb-6 lg:w-1/2 mx-auto  px-5 block text-right"
      >
        <span>...もっと見る</span>
      </Link>
      <Tag tags={allTags} />
    </div>
  )
}
