import '../styles/globals.scss'
import { Sidebar } from "../components/sidebar.component"
import { Footer } from '../components/footer.component';

import {CeramicWrapper} from "../context";
import type { AppProps } from 'next/app'

import { useState, useEffect } from "react"

import { useCeramicContext } from '../context';
import { authenticateCeramic } from '../utils';

type Profile = {
  id?: any
  name?: string
  username?: string
  description?: string
  gender?: string
  emoji?: string
}


const MyApp = ({ Component, pageProps }: AppProps) => {
  const clients = useCeramicContext()
  const { ceramic, composeClient } = clients
  const [profile, setProfile] = useState<Profile | undefined>()

  const handleLogin = async () => {
    await authenticateCeramic(ceramic,composeClient)
    await getProfile()
  }

  const getProfile = async () => {
    if(ceramic.did !== undefined) {
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
      
      setProfile(profile?.data?.viewer?.basicProfile)
    }
  }
  // Update to include refresh on auth
  useEffect(() => {
    if(localStorage.getItem('did')) {
      handleLogin()
      getProfile()
    } else {
      handleLogin()
    }
  }, [ ])

  return (
    <div className="container">
      <CeramicWrapper>
        <Sidebar name = {profile?.name} username = {profile?.username} id={profile?.id}/>
        <div className="body">
          <Component {...pageProps} ceramic />
          <Footer />
        </div>
      </CeramicWrapper>
    </div>
  );
}

export default MyApp