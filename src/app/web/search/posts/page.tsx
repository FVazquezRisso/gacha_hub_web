"use client";
import { useState } from "react";
import { api } from "../../../../services/apiConfig";
import { oswald } from "@/app/ui/fonts";
import { PostInterface } from "@/types/types";
import { ChangeEvent } from "react";
import PostCard from '@/app/ui/PostCard';

export default function SearchPost() {
  const [searchValue, setSearchValue] = useState("");
  const [allPosts, setAllPosts] = useState<PostInterface[]>([]);
  const username = localStorage.getItem('username')

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    if (value.length > 3) {
      try {
        const response = await api.get(
          `/posts?username=${username}&content=${value}`
        );
        setAllPosts(response.data.posts);
      } catch (error) {
        console.error(error);
      }
    } else {
      setAllPosts([]);
    } 
  };

  return (
    <div className="pt-16 pb-16">
      <div className="flex items-center justify-center p-8">
        <input
          type="text"
          className="form-input-text"
          autoFocus
          value={searchValue}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col justify-center gap-4">
        {allPosts.length !== 0 ? (
          allPosts.map((post) => {
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
              />
            );
          })
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p
              className={`${oswald.className} text-3xl text-center text-primary-200`}
            >
              {searchValue.length < 4
                ? "Ingresa al menos 4 caracteres"
                : "¡Ups! No hay resultados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
