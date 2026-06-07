import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE, removeToken } from "../api";
import PostCard from "../components/postCard";

function getUsernameFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.username || "";
  } catch {
    return "";
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const Home = () => {
  const [username, setUsername] = useState("");
  const [post, setPost] = useState("");
  const [feeds, setFeeds] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(getUsernameFromToken());
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE}/posts/`, authHeaders())
      .then((res) => {
        setFeeds(res.data);
        setLoadingPosts(false);
      })
      .catch((err) => {
        console.error("Error loading posts:", err);
        setLoadingPosts(false);
      });
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!post.trim()) return;
    try {
      let imageBase64 = null;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }
      const response = await axios.post(
        `${API_BASE}/posts/create`,
        { content: post, image: imageBase64 },
        authHeaders(),
      );
      setFeeds([response.data, ...feeds]);
      setPost("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    }
  };

  const initials = username ? username[0].toUpperCase() : "?";

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-5 text-indigo-700">
        Welcome back, {username}!
      </h1>

      {/* Compose box */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-4 mb-6">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {initials}
          </div>
          <form onSubmit={handlePost} className="flex-1">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 resize-none text-sm"
              rows={3}
              placeholder="What's on your mind?"
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="text-sm text-gray-500"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
                {imageFile && (
                  <p className="text-xs text-gray-400 mt-1">Selected: {imageFile.name}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feed list */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Feed</h2>
        {loadingPosts ? (
          <p className="text-center text-gray-400 py-10">Loading posts...</p>
        ) : feeds.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No posts yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {feeds.map((feed) => (
              <PostCard
                key={feed.id}
                feed={feed}
                onDelete={(id) =>
                  setFeeds((prev) => prev.filter((f) => f.id !== id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
