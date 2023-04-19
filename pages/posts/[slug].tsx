import React from 'react'
import { getAllPosts, getSinglePost } from '@/lib/notionAPI'

export async function getStaticPaths() {
  const allPosts = getAllPosts()
  const paths = (await allPosts).map(({ slug }) => ({ params: { slug } }))
  return {
    paths: paths,
    fallback: 'blocking', // can also be true or 'blocking'
  }
}
export async function getStaticProps<GetStaticProps>({ params }: any) {
  console.log('params', params)
  const post = await getSinglePost(params.slug)
  return {
    props: { post },
    revalidate: 60, // 60秒ごと更新する(ISR)
  }
}

type Props = {
  // allPosts: Post[]
}

const Post = ({ post }: any) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">３回目の投稿です。</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">2023/03/03</span>
      <br />
      <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block">
        Next.js
      </p>
    </section>
  )
}

export default Post
