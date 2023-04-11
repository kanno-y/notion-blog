import { GetStaticProps } from 'next'
import { Inter } from 'next/font/google'
import { getAllPosts } from '@/lib/notionAPI'

const inter = Inter({ subsets: ['latin'] })

export async function getStaticProps<GetStaticProps>(context: any) {
  const allPosts: any = await getAllPosts()
  return {
    props: { allPosts },
    revalidate: 60, // 60秒ごと更新する(ISR)
  }
}

export default function Home(allPosts: any) {
  console.log('allPosts', allPosts)
  return <h1 className="text-3xl font-bold underline">Hello world!</h1>
}
