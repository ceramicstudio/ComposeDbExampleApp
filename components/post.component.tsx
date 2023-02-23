import Link from "next/link"
import styles from "../styles/Home.module.scss"

import { PostProps } from "../types"

const Post = ({author, post}: PostProps) => {
  return (
    <div className = {styles.post} key = {post.id}>
      <div>{post.body}</div>
      <Link href = {`/user/${author.id}`}>
        <a>
          {author.name} <small>@{author.username}</small>
        </a>
      </Link>
    </div>
  )
}

export default Post