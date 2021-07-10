import axios from "axios";

export const selectRandomKey = () => {
  const keys = ["AIzaSyBNPu5ClRIe0QpOMOVDiQ1vV95zNoKt604", "AIzaSyBNPu5ClRIe0QpOMOVDiQ1vV95zNoKt604"];

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
