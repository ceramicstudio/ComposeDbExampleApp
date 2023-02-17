import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

import { useCeramicContext } from '../context';
import { PostProps } from '../types';

import Head from 'next/head'

import Post from "../components/post.component"
import styles from "../styles/Home.module.scss"


const Home: NextPage = () => {  
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [ newPost, setNewPost ] = useState('')
  const [ posts, setPosts ] = useState<PostProps[] | []>([])

  const createPost = async () => {
    if(ceramic.did !== undefined) { 
      const profile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
            }
          }
        }
      `)
      const post = await composeClient.executeQuery(`
        mutation {
          createPosts(input: {
            content: {
              body: """${newPost}"""
              created: "${new Date().toISOString()}"
              profileId: "${profile.data.viewer.basicProfile.id}"
            }
          })
          {
            document {
              body
            }
          }
        }
      `)
      getPosts()
      setNewPost('')
    }
  }
  const getPosts = async () => {
    if(ceramic.did !== undefined){
      const posts = await composeClient.executeQuery(`
        query {
          viewer {
            followingList(last:300) {
              edges {
                node {
                  profile {
                    id
                    username
                    name
                    posts(last:30) {
                      edges {
                        node {
                          id
                          body
                          created
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `)
      const followedPosts = await destructurePosts(posts)

      setPosts((followedPosts || [])) // reverse to get most recent msgs
    }
  }
  //TODO: Tighting up types
  const destructurePosts = async (viewerObj:any) => {
    if(viewerObj?.data?.viewer?.followingList.edges === undefined) {
      return
    }
    const following = viewerObj.data.viewer.followingList.edges
    console.log('following', viewerObj.data.viewer.followingList)
    
    const posts:PostProps[] = []

    // TODO: Any => something more useful.
    following.map((post: any) => {
      console.log("post", post)
      if(post.node.profile !== null && post.node.profile?.posts !== undefined) {
        post.node.profile.posts.edges.forEach((profilePosts: any) => {
          posts.push(
            {
              author: {
                id: post.node.profile.id,
                name: post.node.profile.name,
                username: post.node.profile.username
              },
              post: {
                body: profilePosts.node.body,
                created: profilePosts.node.created,
                id: profilePosts.node.id
              }
            }
          )
          console.log("profilePosts", profilePosts)
        })
      }
    })
    return posts
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <>
      <Head>
        <title>DecentraTwitter</title>
        {/* TODO: UPDATE FAVICON */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className = "content">
        <div className = {styles.share}>
          <textarea 
            value={newPost}
            placeholder="What are you thinking about?"
            className = {styles.postInput}
            onChange={(e) => {
              setNewPost(e.target.value)
            }}
          />
          <button onClick = {() => {createPost()}}>
            Share
          </button>
        </div>
        <div className = {styles.postContainer}>
            {(posts).map(post => (
              <Post author = {post.author} post = {post.post} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Home
