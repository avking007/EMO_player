import axios from "axios";

export const selectRandomKey = () => {
  const keys = "AIzaSyBNPu5ClRIe0QpOMOVDiQ1vV95zNoKt604"; 
  return keys;
};

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    videoCategoryId: "10",
    type: "video",
    key: "AIzaSyBNPu5ClRIe0QpOMOVDiQ1vV95zNoKt604",
  },
});
