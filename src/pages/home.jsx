import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authHeaders, API_BASE_URL, removeToken } from "../api";
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
      .get(`${API_BASE_URL}/posts/`, authHeaders())
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
        `${API_BASE_URL}/posts/create`,
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

  const myPosts = feeds.filter((f) => f.user?.username === username);
  const totalPosts = feeds.length;
  const totalLikes = myPosts.reduce((sum, f) => sum + (f.likesCount || 0), 0);
  const totalComments = myPosts.reduce(
    (sum, f) => sum + (f.comments?.length || 0),
    0,
  );

  return (
    <>
      {/* Full-width page wrapper — no max-width, no centering */}
      <div
        className="home-grid min-h-screen grid items-start"
        style={{
          backgroundColor: "#f0effe",
          width: "100%",
          padding: "1.5rem 2rem",
          gridTemplateColumns: "240px 1fr",
          gap: "1.5rem",
        }}
      >
        {/* LEFT column — stats + account only, sticky */}
        <div
          className="space-y-4 self-start"
          style={{ position: "sticky", top: "72px" }}
        >
          {/* Stats card */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Your Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Posts</span>
                <span className="text-sm font-bold text-indigo-600">
                  {totalPosts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Likes received</span>
                <span className="text-sm font-bold text-red-500">
                  {totalLikes}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Comments</span>
                <span className="text-sm font-bold text-indigo-400">
                  {totalComments}
                </span>
              </div>
            </div>
          </div>

          {/* Account card */}
          <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Account
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">
                  @{username}
                </p>
                <p className="text-xs text-indigo-400 font-medium">
                  Verified member
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT column — welcome heading + compose + feed, stretches to right edge */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold mb-6 text-indigo-700">
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
                      <p className="text-xs text-gray-400 mt-1">
                        Selected: {imageFile.name}
                      </p>
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
              <p className="text-center text-gray-400 py-10">
                Loading posts...
              </p>
            ) : feeds.length === 0 ? (
              <p className="text-center text-gray-400 py-10">
                No posts yet. Be the first!
              </p>
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
      </div>

      {/* Mobile: collapse to single column under 768px */}
      <style>{`
        @media (max-width: 768px) {
          .home-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default Home;
