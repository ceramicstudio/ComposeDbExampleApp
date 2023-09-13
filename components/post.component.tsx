import Link from "next/link"
import styles from "../styles/Home.module.scss"

import { PostProps } from "../types"

const Post = ({author, post}: PostProps) => {
  console.log(post)
  return (
    <div className = {styles.post} key = {post.id}>
      <div>{post.body}</div>
      {post.tag && <div><small>Category: {post.tag}</small></div>}
      <Link href = {`/user/${author.id}`}>
        <a>
        <small><small>{author.emoji} {author.name} @{author.username}</small></small>
        </a>
      </Link>
    </div>
  )
}

export default Post