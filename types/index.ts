export type Profile = {
  id?: any
  name?: string
  username?: string
  description?: string
  gender?: string
  emoji?: string
}

export type PostProps = { 
  author: Author
  post: Post
}

export type SidebarProps = {
  name?: string
  username?: string
  id?: string
}

type Author = {
  id: string
  name: string
  username: string
}

type Post = {
  body: string
  id: string

  created?: string
}