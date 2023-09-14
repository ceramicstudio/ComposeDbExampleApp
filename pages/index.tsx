import type { NextPage } from 'next'
import { useEffect, useState } from 'react';

import { useCeramicContext } from '../context';
import { PostProps } from '../types';

import Head from 'next/head'

import Post from "../components/post.component"
import styles from "../styles/Home.module.scss"
import AuthPrompt from "./did-select-popup";
import React from "react";
import {authenticateCeramic} from "../utils";

const Home: NextPage = () => {  
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [ newPost, setNewPost ] = useState('')
  const [ tag, setTag ] = useState('')
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
              tag: """${tag}"""
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
        setTag('')
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
              emoji
            }
          }
        }
      `);
    localStorage.setItem("viewer", profile?.data?.viewer?.id)
    const following = await composeClient.executeQuery(`
      query {
        node(id: "${profile?.data?.viewer?.id}") {
          ...on CeramicAccount {
            followingList(last:300) {
              edges {
                node {
                  profile {
                    id
                    username
                    name
                    emoji
                    posts(last:30) {
                      edges {
                        node {
                          id
                          body
                          created
                          tag
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
    console.log(following)
    const explore = await composeClient.executeQuery(`
      query {
        postsIndex(last:300) {
          edges {
            node {
              id
              body
              tag
              created
              profile{
                id
                name
                username
                emoji
              }
            }
          }
        }
      }
    `)
    // TODO: Sort based off of "created date"
    const posts:PostProps[] = []
    
    if(following.data.node !== null) {
      console.log(following)
      following.data?.node?.followingList.edges.map(profile => {
        if(profile.node !== null){
        profile.node.profile.posts.edges.map(post => {
          if(post.node !== null){
          posts.push({
            author: {
              id: profile.node.profile.id,
              name: profile.node.profile.name,
              username: profile.node.profile.username,
              emoji: profile.node.profile.emoji
            },
            post: {
              id: post.node.id,
              body: post.node.body,
              tag: post.node.tag,
              created: post.node.created
            }
          })
        }
        })
      }
      })
      console.log(explore)
    } else {
      explore.data?.postsIndex?.edges.map(post => {
        posts.push({
          author: {
            id: post.node.profile.id,
            name: post.node.profile.name,
            username: post.node.profile.username,
            emoji: post.node.profile.emoji
          },
          post: {
            id: post.node.id,
            body: post.node.body,
            tag: post.node.tag,
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
        <title>Ceramic Social</title>
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
          <textarea 
            value={tag}
            maxLength={100}
            placeholder="Enter a Category Tag"
            className = {styles.postInput}
            onChange={(e) => {
              setTag(e.target.value)
            }}
          />
          <button onClick = {() => {createPost()}}>
            Share
          </button>
        </div>
        <div className = {styles.postContainer}>
            {(posts).map(post => (
              <Post author = {post.author} post = {post.post} key = {post.post.id} tag = {post.post.tag}/>
            ))}
        </div>
      </div>
    </>
  );
}

export default Home