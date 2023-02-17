import type { NextPage } from 'next'

import { Userform } from '../components/userform.component'

const ExplorePage: NextPage = () => {
    return (
        <div className = "content">
            <div>
                <h1>This is the explore page</h1>
                <Userform />
            </div>
        </div>
    )
}

export default ExplorePage