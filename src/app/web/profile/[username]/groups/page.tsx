"use client";
import { useState, useEffect } from "react";
import { api } from "@/services/apiConfig";
import GroupCard from "@/app/ui/GroupCard";
import { GroupInterface } from "@/types/types";
import { oswald } from "@/app/ui/fonts";
import cookies from "js-cookie";
import { useInView } from "react-intersection-observer";

type props = {
  params: {
    username: string;
  };
};

export default function ProfileGroups({ params }: props) {
  const { username } = params;
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreGroups, setHasMoreGroups] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const getGroups = async () => {
    try {
      if (!hasMoreGroups) {
        return;
      }
      const response = await api.get(
        `/groups?page=${currentPage}&username=${username}`
      );
      if (response.status === 200) {
        setGroups([...groups, ...response.data.groups]);
        if (response.data.groups.length < 10) {
          setHasMoreGroups(false);
          return;
        }
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getGroups();
  }, [inView]);

  return (
    <>
      {groups.length !== 0 &&
        groups.map((group: GroupInterface) => {
          return (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              userCount={group.userCount}
              postCount={group.postCount}
              createdAt={group.createdAt}
              updatedAt={group.updatedAt}
              deletedAt={group.deletedAt}
            />
          );
        })}
      <div ref={ref}></div>
      {!hasMoreGroups && (
        <div className="h-48 flex items-center justify-center">
          <p className={`${oswald.className} text-3xl text-center`}>
            ¡<span className="text-primary-200">{`${username} `}</span>
            no tiene más grupos!
          </p>
        </div>
      )}
    </>
  );
}
