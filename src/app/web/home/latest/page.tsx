"use client";
import PostCard from "@/app/ui/PostCard";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import { PostInterface } from "@/types/types";
import { useInView } from "react-intersection-observer";
import { oswald } from "@/app/ui/fonts";
import LoadingScreen from '@/app/ui/LoadingScreen'
import cookies from 'js-cookie'

export default function Latest() {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(true)
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const getPosts = async () => {
    try {
      if (!hasMorePosts) {
        return;
      }
      const username = cookies.get('username')
      const response = await api.get(`/posts?page=${currentPage}&username=${username}`);
      if (response.status === 200) {
        setPosts([...posts, ...response.data.posts]);
        if (response.data.posts.length < 10) {
          setHasMorePosts(false);
          return;
        }
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getPosts();
  }, [inView]);

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="pt-16 pb-16">
      {posts.length !== 0 &&
        posts.map((post: PostInterface) => {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              author={post.author}
              content={post.content}
              likeCount={post.likeCount}
              userLikedPost={post.userLikedPost}
              commentCount={post.commentCount}
              createdAt={post.createdAt}
              updatedAt={post.updatedAt}
              deletedAt={post.deletedAt}
            />
          );
        })}
      <div ref={ref}></div>
      {!hasMorePosts && (
        <div className="h-48 flex items-center justify-center">
          <p className={`${oswald.className} text-3xl text-center`}>
            <span className='text-primary-200'>¡Fin del feed!</span> <br /> ¡A esperar más sorpresas!{" "}
          </p>
        </div>
      )}
    </div>
  );
}
