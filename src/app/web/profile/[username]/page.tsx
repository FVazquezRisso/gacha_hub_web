"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import PostCard from "@/app/ui/PostCard";
import { PostInterface } from "@/types/types";
import { oswald } from "@/app/ui/fonts";
import UserCard from "../../../ui/UserCard";
import { UserInterface, PostInterface } from "../../../../types/types.ts";
import Header from '../../../ui/Header'

export default function Profile({ params }) {
  const { username } = params;
  const currentUser = localStorage.getItem("username");
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [posts, setPosts] = useState<PostInterface[]>([]);

  const getData = async () => {
    try {
      const response = await api.get(`/users/${username}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await api.get(
        `/posts?username=${currentUser}&author=${username}`
      );
      if (response.status === 200) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    getPosts();
  }, []);

  return (
    <div className="mb-16">
      <Header title={`Perfil de ${username}`} />
      <div className="m-4">
        <UserCard username={username} avatar={userData?.avatar} />
      </div>
      <h3 className="text-xl mx-8 mt-4">Biografía:</h3>
      <p className="overflow-x-hidden whitespace-pre-wrap break-all px-8 pb-4 mt-2 border-b-[1px] border-bg-300">
        {userData?.bio}
      </p>
      <div className="flex flex-col mt-8">
        <h2 className="text-2xl text-center">Publicaciones de {username}</h2>
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
              />
            );
          })}
        {posts.length === 0 && (
          <div className="h-48 flex items-center justify-center">
            <p className={`${oswald.className} text-3xl text-center`}>
              ¡<span className="text-primary-200">{`${username} `}</span>
              no tiene publicaciones aún!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
