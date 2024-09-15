import { glob } from 'glob';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), 'posts');

interface PostData {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  readTime: string;
  filepath: string;
  content: string;
  slug: string;
  [key: string]: any;
}

export function getPostSlugs() {
  return glob.sync('**/*.mdx', { cwd: postsDirectory });
}

export function getPost(filepath: string): PostData {
  const fullPath = join(postsDirectory, filepath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    ...data,
    content,
    filepath,
    slug: filepath.replace(/\.mdx$/, ''),
  } as PostData;
}

export function getPosts(limit: number = -1): PostData[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPost(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit === -1 ? posts : posts.slice(0, limit);
}

export function getPostBySlug(slug: string): PostData | undefined {
  //   console.log({ slug });
  const allPosts = getPosts();
  return allPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(limit: number = 8): PostData[] {
  const allPosts = getPosts();
  const featuredPosts = allPosts.filter((post) => Boolean(post.featured));
  return featuredPosts.slice(0, limit);
}
