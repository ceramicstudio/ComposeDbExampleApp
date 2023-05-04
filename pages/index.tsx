import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

import { useCeramicContext } from '../context';
import { PostProps } from '../types';

import Head from 'next/head'

import Post from "../components/post.component"
import styles from "../styles/Home.module.scss"
import AuthPrompt from "./did-select-popup";
import React from "react";

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
              name
            }
          }
        }
      `)
      if(profile && profile.data?.viewer.basicProfile?.name) {
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
        alert("Created post.")
      } else {
        alert("Failed to fetch profile for authenticated user. Please register a profile.");
      }
    }
  }
  const getPosts = async () => {
    const profile = await composeClient.executeQuery(`
        query {
          viewer {
            id
            basicProfile {
              id
              name
              username
            }
          }
        }
      `);
    localStorage.setItem("viewer", profile?.data?.viewer?.id)

    const following = await composeClient.executeQuery(`
      query {
        node(id: "${localStorage.getItem('viewer')}") {
          ...on CeramicAccount {
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
      }
    `)
    const explore = await composeClient.executeQuery(`
      query {
        postsIndex(last:300) {
          edges {
            node {
              id
              body
              created
              profile{
                id
                name
                username
              }
            }
          }
        }
      }
    `)

    // TODO: Sort based off of "created date"
    const posts:PostProps[] = []
    
    if(following.data !== undefined) {
      following.data?.node?.followingList.edges.map(profile => {
        profile.node.profile.posts.edges.map(post => {
            posts.push({
              author: {
                id: profile.node.profile.id,
                name: profile.node.profile.name,
                username: profile.node.profile.username,
              },
              post: {
                id: post.node.id,
                body: post.node.body,
                created: post.node.created
              }
            })
        })
      })
    } else {
      explore.data?.postsIndex?.edges.map(post => {
        posts.push({
          author: {
            id: post.node.profile.id,
            name: post.node.profile.name,
            username: post.node.profile.username
          },
          post: {
            id: post.node.id,
            body: post.node.body,
            created: post.node.created
          }
        })
      }) 
    }
    posts.sort((a,b)=> (new Date(b.created) - new Date(a.created)))
    console.log(posts)
    setPosts((posts?.reverse())) // reverse to get most recent msgs
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
            maxLength={100}
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
              <Post author = {post.author} post = {post.post} key = {post.post.id} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Home