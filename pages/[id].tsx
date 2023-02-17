import type { NextPage } from 'next'

import { Userform } from '../components/userform.component'

const ProfilePage: NextPage = () => {
  return (
    <div className = "content">
      <div>
        <Userform />
      </div>
    </div>
  )
}

export default ProfilePage