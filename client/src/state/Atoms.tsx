import { atom } from "jotai";
import { QueryData, referralData } from "../../types";

// const userStore = createStore();
// IF RUNNING ON LOCAL HOST, REPLACE backendURL value with empty string.
//http://ec2-18-144-89-57.us-west-1.compute.amazonaws.com

export const backendUrl: string = "https://os-analytics-backend.vercel.app"; // backend URI
export const activeUserAtom = atom<string>("");
export const activeNavAtom = atom<boolean>(false);

export const loadingAtom = atom<boolean>(false);

// User's Click Data
export const userDataAtom = atom<QueryData[]>([]);
export const userReferralDataAtom = atom<referralData[]>([]);
export const websitesAtom = atom<string[]>([]);
export const activeWebsiteAtom = atom<string>("overview");

export const websiteDataAtom = atom((get) => {
  //references the active website atom
  const activeWebsite = get(activeWebsiteAtom);
  //references the complete data set and filters according to the active website atom
  return get(userDataAtom).filter((el) => el.website_name === activeWebsite);
});

export const websiteReferralDataAtom = atom((get) => {
  const activeWebsite = get(activeWebsiteAtom);
  return get(userReferralDataAtom).filter(
    (el) => el.website_name === activeWebsite
  );
});
export const timeFrameAtom = atom<string>("1 day");
