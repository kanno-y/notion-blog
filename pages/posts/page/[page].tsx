import {
  MetadataProps,
  getAllPosts,
  getNumberOfPages,
  getPostsByPage,
  getPostsForTopPage,
} from '@/lib/notionAPI'
import Head from 'next/head'
import { SinglePost } from '@/components/Post/SinglePost'
import { GetStaticPaths, GetStaticProps } from 'next/types'
import { Pagination } from '@/components/Pagination/Pagination'

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages()

  let params = []
  for (let i = 1; i <= numberOfPage; i++) {
    params.push({ params: { page: i.toString() } })
  }
  return {
    paths: params,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page
  const postsByPage =
    currentPage && (await getPostsByPage(parseInt(currentPage.toString(), 10)))

  const numberOfPage = await getNumberOfPages()
  return {
    props: { postsByPage, numberOfPage },
    revalidate: 60, // 60秒ごと更新する(ISR)
  }
}
type Props = {
  postsByPage: MetadataProps[]
  numberOfPage: number
}

const BlogPageList = ({ postsByPage, numberOfPage }: Props) => {
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
      <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
        {postsByPage.map((post: MetadataProps) => (
          <div key={post.title}>
            <SinglePost
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              tags={post.tags}
              isPaginationPage={true}
            />
          </div>
        ))}
      </section>
      <Pagination numberOfPage={numberOfPage} />
    </div>
  )
}

export default BlogPageList
