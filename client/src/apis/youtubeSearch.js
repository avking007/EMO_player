import axios from "axios";

export const selectRandomKey = () => {
  console.log(process.env);
  const keys = process.env.YOUTUBE_KEYS.split(" ");

  const random = Math.floor(Math.random() * Math.floor(keys.length)); //this will get a random number
  return keys[random];
};

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    videoCategoryId: "10",
    type: "video",
    key: selectRandomKey(),
  },
});
