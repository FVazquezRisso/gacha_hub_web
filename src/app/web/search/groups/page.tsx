"use client";
import { useState } from "react";
import { api } from "@/services/apiConfig";
import { oswald } from "@/app/ui/fonts";
import { GroupInterface } from "@/types/types";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import GroupCard from "@/app/ui/GroupCard";
import { MdGroupAdd } from "react-icons/md";

export default function SearchGroup() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [allGroups, setAllGroups] = useState<GroupInterface[]>([]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value.replace(/\s+/g, " "));
    if (value.length > 3) {
      try {
        const response = await api.get(`/groups?name=${value}`);
        setAllGroups(response.data.groups);
      } catch (error) {
        console.error(error);
      }
    } else {
      setAllGroups([]);
    }
  };

  const handleClickCreateGroup = () => {
    router.push('/web/group/create')
  }

  return (
    <div className="pt-16 pb-16">
      <div className="flex items-center justify-center p-8">
        <input
          type="text"
          className="form-input-text"
          autoFocus
          value={searchValue}
          onChange={handleChange}
          placeholder='Buscar grupo'
        />
      </div>
      <div className="flex flex-col justify-center gap-4">
        {allGroups.length !== 0 ? (
          allGroups.map(({ id, name, userCount, postCount, createdAt, updatedAt, deletedAt }) => {
            return (
              <GroupCard
                key={id}
                id={id}
                name={name}
                userCount={userCount}
                postCount={postCount}
                createdAt={createdAt}
                updatedAt={updatedAt}
                deletedAt={deletedAt}
                userJoined={false}
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
      <div
        className="h-14 w-14 bg-primary-100 rounded-full border-4 border-primary-100 fixed bottom-[5.5rem] right-6 flex items-center justify-center"
        onClick={handleClickCreateGroup}
      >
        <MdGroupAdd size={32} className="text-text-200" />
      </div>
    </div>
  );
}
