import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const searchVideo = async (topic) => {
  try {
    // 1️⃣ First search specifically for Virtual Code
    const virtualCodeQuery = `Virtual Code ${topic}`;

    let { data } = await axios.get(BASE_URL, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: virtualCodeQuery,
        maxResults: 5,
        type: "video",
      },
    });

    // Find a Virtual Code video from the results
    const virtualCodeVideo = data.items?.find((item) =>
      item.snippet.channelTitle
        ?.toLowerCase()
        .includes("virtual code")
    );

    if (virtualCodeVideo) {
      return {
        title: virtualCodeVideo.snippet.title,
        channel: virtualCodeVideo.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${virtualCodeVideo.id.videoId}`,
      };
    }

    // 2️⃣ Fallback: search for any tutorial
    const fallbackQuery = `${topic} tutorial`;

    ({ data } = await axios.get(BASE_URL, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: fallbackQuery,
        maxResults: 1,
        type: "video",
      },
    }));

    if (data.items?.length > 0) {
      const video = data.items[0];

      return {
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
    }

    return null;
  } catch (error) {
    console.error(
      "YouTube search error:",
      error.response?.data || error.message
    );

    return null;
  }
};

export default searchVideo;