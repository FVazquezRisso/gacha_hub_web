"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import PostCard from "@/app/ui/PostCard";
import { PostInterface } from "@/types/posts.types";
import { oswald } from "@/app/ui/fonts";

export default function Profile({ params }) {
  const { username } = params;
  const currentUser = localStorage.getItem("username");
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);

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
      <div className="w-screen h-16 bg-primary-100 flex items-center p-4">
        <h2 className="text-2xl font-semibold">Perfil de {username}</h2>
      </div>
      <div className="h-12 w-screen flex justify-start items-center gap-4 p-6 mt-8">
        <img
          src={userData.avatar}
          alt={username}
          className="w-12 rounded-full"
        />
        <p className="font-medium text-xl">{username}</p>
      </div>
      <h3 className="text-xl mx-8 mt-4">Biografía:</h3>
      <p className="overflow-x-hidden whitespace-pre-wrap break-all px-8 pb-4 mt-2 border-b-[1px] border-bg-300">
        {userData.bio}
      </p>
      <div className="flex flex-col mt-8 px-8">
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
