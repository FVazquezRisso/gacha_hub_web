"use client";
import { useState } from "react";
import { api } from "../../../../services/apiConfig";
import { oswald } from "@/app/ui/fonts";
import { UserInterface } from "@/types/types";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchUser() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [allUsers, setAllUsers] = useState<UserInterface[]>([]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    if (value.length > 3) {
      try {
        const response = await api.get(`/users?username=${value}`);
        setAllUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setAllUsers([]);
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
        {allUsers.length !== 0 ? (
          allUsers.map(({ username, avatar, bio }) => {
            const bioSplitted =
              bio?.length > 40 ? `${bio.substring(0, 40)}...` : bio;
            return (
              <div
                key={username}
                className="border-b-[1px] border-bg-300 grid grid-cols-6 p-4 gap-2"
                onClick={() => router.push(`/web/profile/${username}`)}
              >
                <div className="col-span-1 flex justify-center">
                  <img
                    src={avatar}
                    alt={username}
                    className="w-12 aspect-square object-cover rounded-full"
                  />
                </div>
                <div className="col-span-5 pr-4">
                  <h3 className="text-lg font-bold">{username}</h3>
                  <p className="overflow-x-hidden whitespace-pre-wrap">
                    {bioSplitted}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p
              className={`${oswald.className} text-3xl text-center text-primary-200`}
            >
              ¡Ups! No hay resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
