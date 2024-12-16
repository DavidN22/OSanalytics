import { useAtom } from "jotai";
import { userDataAtom, websitesAtom, backendUrl } from "../state/Atoms";
import axios from "axios";
import { useEffect } from "react";

export const usePopulateAtoms = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [, setWebsites] = useAtom(websitesAtom);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!userData.length) {
        try {
          const userDataResponse = await axios.get(`${backendUrl}/api/data`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData(userDataResponse.data);

          const websiteList: Set<string> = new Set(
            userDataResponse.data.map((el: { website_name: string }) => el.website_name)
          );
          setWebsites(Array.from(websiteList));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userData, setUserData, setWebsites, token]);
};
