import { useAtom } from "jotai";
import {
  userDataAtom,
  userReferralDataAtom,
  websitesAtom,
  backendUrl,
} from "../state/Atoms";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePopulateAtoms = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [userReferralData, setUserReferralData] = useAtom(userReferralDataAtom);
  const [, setWebsites] = useAtom(websitesAtom);
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResponse = await axios.get(`${backendUrl}/api/data`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const referralDataResponse = await axios.get(`${backendUrl}/api/data/referral`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserReferralData(referralDataResponse.data);
        setUserData(userDataResponse.data);

        const websiteList: Set<string> = new Set(
          userDataResponse.data.map((el: { website_name: string }) => el.website_name)
        );
        setWebsites(Array.from(websiteList));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.pathname, token, setUserData, setUserReferralData, setWebsites]);
};
