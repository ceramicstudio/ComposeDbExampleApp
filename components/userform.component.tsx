
import { useState, useEffect } from 'react'
import { authenticateCeramic } from '../utils'
import { useCeramicContext } from '../context'

import { Profile } from "../types"

import styles from "../styles/profile.module.scss"

export const Userform = () => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients

  const [profile, setProfile] = useState<Profile | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient)
    await getProfile()
  }

  const getProfile = async () => {
    setLoading(true)
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      console.log(profile)

      setProfile(profile?.data?.viewer?.basicProfile)
      setLoading(false);
    }
  }

  const updateProfile = async () => {
    setLoading(true);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery(`
        mutation {
          createBasicProfile(input: {
            content: {
              name: "${profile?.name}"
              username: "${profile?.username}"
              description: "${profile?.description}"
              gender: "${profile?.gender}"
              emoji: "${profile?.emoji}"
            }
          }) 
          {
            document {
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      await getProfile();
      setLoading(false);
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  return (
    <>
      {profile === undefined && ceramic.did === undefined ? (
        <div className="content">
          <button
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div className="content">
          <div className={styles.formGroup}>
            <div className="">
              <label className="">Name</label>
              <input
                className=""
                type="text"
                defaultValue={profile?.name || ''}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Username</label>
              <input
                type="text"
                defaultValue={profile?.username || ''}
                onChange={(e) => {
                  setProfile({ ...profile, username: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Description</label>
              <input
                type="text"
                defaultValue={profile?.description || ''}
                onChange={(e) => {
                  setProfile({ ...profile, description: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Gender</label>
              <input
                type="text"
                defaultValue={profile?.gender || ''}
                onChange={(e) => {
                  setProfile({ ...profile, gender: e.target.value });
                }}
              />
            </div>
            <div className="">
              <label>Emoji</label>
              <input
                type="text"
                defaultValue={profile?.emoji || ''}
                onChange={(e) => {
                  setProfile({ ...profile, emoji: e.target.value });
                }}
                maxLength={2}
              />
            </div>
            <div className="">
              <button
                onClick={() => {
                  updateProfile();
                }}>
                {loading ? 'Loading...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}