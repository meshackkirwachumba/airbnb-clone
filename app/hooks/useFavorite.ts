import axios from "axios";
import { useRouter } from "next/navigation";
import useLoginModalState from "./useLoginModalState";
import { SafeUser } from "../types";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const loginModalState = useLoginModalState();

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];
    return list.includes(listingId);
  }, [currentUser, listingId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      if (!currentUser) {
        return loginModalState.onOpen();
      }

      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        }

        await request();
        router.refresh();
        toast.success("success");
      } catch (error) {
        toast.error("Something went wrong ");
      }
    },
    [currentUser, hasFavorited, listingId, loginModalState, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};

export default useFavorite;
