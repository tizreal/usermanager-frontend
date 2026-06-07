import React, { useEffect, useState } from "react";
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

const Home = () => {
  const [username, setUsername] = useState("");
  const [post, setPost] = useState("");
  const [feeds, setFeeds] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
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
      const response = await axios.post(
        `${API_BASE}/posts/create`,
        { content: post },
        authHeaders(),
      );
      setFeeds([response.data, ...feeds]);
      setPost("");
    } catch (err) {
      console.error("Error creating post:", err);
      if (err.response?.status === 401) {
        removeToken();
        navigate("/login");
      }
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 relative">
      <button
        onClick={handleLogout}
        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Logout
      </button>
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">
        Welcome {username}!
      </h1>
      {/* Post form */}
      <form onSubmit={handlePost} className="mb-6">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 resize-none"
          rows={3}
          placeholder="What's on your mind?"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <button
          type="submit"
          className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Post
        </button>
      </form>
      {/* Feed list */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Feeds</h2>
        {loadingPosts ? (
          <p className="text-center text-gray-400">Loading posts...</p>
        ) : feeds.length === 0 ? (
          <p className="text-center text-gray-400">
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
  );
};

export default Home;
