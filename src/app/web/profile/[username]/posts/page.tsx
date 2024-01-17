"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import PostCard from "@/app/ui/PostCard";
import { PostInterface } from "@/types/types";
import { oswald } from "@/app/ui/fonts";
import axios from "axios";
import cookies from "js-cookie";
import { useInView } from "react-intersection-observer";

type props = {
  params: {
    username: string;
  };
};

export default function ProfilePosts({ params }: props) {
  const { username } = params;
  const currentUser = cookies.get("username");
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const getPosts = async () => {
    try {
      if (!hasMorePosts) {
        return;
      }
      const response = await api.get(
        `/posts?page=${currentPage}&username=${currentUser}&author=${username}`
      );
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
    }
  };

  useEffect(() => {
    getPosts();
  }, [inView]);

  return (
    <>
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
            ¡<span className="text-primary-200">{`${username} `}</span>
            no tiene más publicaciones!
          </p>
        </div>
      )}
    </>
  );
}
