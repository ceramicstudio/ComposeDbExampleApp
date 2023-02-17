import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useCeramicContext } from '../../context'

import Head from 'next/head'
import Link from 'next/link'
import styles from "../../styles/Home.module.scss"

const UserProfile: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [ profile, setProfile ] = useState({})
  const [ posts, setPosts ] = useState([])

  const getUser = async () => {
    const test = await composeClient.executeQuery(`
      query {
        viewer {
          followingList(last:300) {
            edges {
              node {
                id
                profile {
                  name
                }
              }
            }
          }
        }
      }
    `)
    console.log ('test', test)
    const profile = await composeClient.executeQuery(`
      query {
        node(id: "${id}") {
          ...on CeramicAccount {
            basicProfile{
              username
              name
              id
            }
          }
        }
      }
    `)
    console.log("profile", profile)
    setProfile(profile)
  }

  // TODO: Add check to see if viewer is already following this account to
  //       prevent dupes
  const follow = async () => {
    const follow = await composeClient.executeQuery(`
      mutation {
        createFollowing(input: {
          content: {
            profileId: "${profile.data.node.basicProfile.id}"
          }
        }) 
        {
          document {
            profileId
          }
        }
      }
    `)
    console.log(follow)
  }
  const getPosts = async () => {
    const posts = await composeClient.executeQuery(`
      query {
        node(id:"${id}") {
          ...on CeramicAccount {
            postsList(last:30) {
              edges{
                node {
                  id
                  body
                }
              }
            }
          }
        }
      }
    `)
    setPosts(posts.data.node.postsList.edges)
  }

  useEffect(() => {
    getPosts()
    getUser()
  }, [])
  return (
    <>
      <Head>
        <title>{profile !== undefined ? `${profile?.data?.node?.basicProfile.username}'s Profile`: 'No profile'}</title>
      </Head>
      {profile?.data?.node?.basicProfile.username === undefined ? 
        <div className = "content">
          <Link href = "/">
            <a>
              <button>Profile Not found</button>
            </a>
          </Link>
        </div>
      : 
        <div className = "content">
          <div>this is the profile page for {profile.data.node.basicProfile.username}</div>
          <button onClick={() => {
            follow()
          }}>Follow</button>
          <div className = {styles.postContainer}>
            {(posts).map(post => (
              <div 
                className = {styles.post} 
                key = {post.node.id}>
                  {post.node.body}
                </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default UserProfile