import Post from '../components/post.component'
import styles from "../styles/Home.module.scss"

import type { NextPage } from 'next'

import { useEffect, useState } from 'react'
import { useCeramicContext } from '../context'
import { PostProps } from '../types'

const ExplorePage: NextPage = () => {
  const clients = useCeramicContext()
  const {ceramic, composeClient} = clients

  const [posts, setPosts ] = useState<PostProps[] | []>([])

  const explorePosts = async () => {
    const res = await composeClient.executeQuery(`
      query {
        postsIndex (last:300) {
          edges {
            node {
              id
              body
              created
              profile {
                id
                name
                username 
              }
            }
          }
        }
      }
    `)
    const posts: PostProps[] = []
    res.data.postsIndex.edges.map(post => {
      posts.push({
        author: {
          id: post.node.profile.id,
          name: post.node.profile.name,
          username: post.node.profile.username
        },
        post: {
          body: post.node.body,
          created: post.node.created,
          id: post.node.id
        }
      })
    })
    posts.sort((a,b)=> (new Date(b.created) - new Date(a.created)))
    setPosts(posts)
  }

  useEffect(() => {
    explorePosts()
  }, [])

  return (
    <div className = "content">
      <div className={styles.postContainer}>
        {posts?.map(post => (
          <Post author = {post.author} post = {post.post} key = {post.post.id} />
        ))}
      </div>
    </div>
  )
}

export default ExplorePage