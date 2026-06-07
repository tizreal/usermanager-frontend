import React, { useState } from "react";
import axios from "axios";
import { authHeaders, API_BASE } from "../api";

function getCurrentUsername() {
  const token = localStorage.getItem("authToken");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || "";
  } catch {
    return "";
  }
}

const PostCard = ({ feed, onDelete }) => {
  const [comments, setComments] = useState(feed.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(feed.likesCount || 0);

  const currentUsername = getCurrentUsername();
  const isOwner = currentUsername && currentUsername === feed.user?.username;

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post(
          `${API_BASE}/posts/${feed.id}/unlike`,
          {},
          authHeaders(),
        );
        setLikeCount((c) => c - 1);
      } else {
        await axios.post(
          `${API_BASE}/posts/${feed.id}/like`,
          {},
          authHeaders(),
        );
        setLikeCount((c) => c + 1);
      }
      setLiked((prev) => !prev);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API_BASE}/posts/${feed.id}`, authHeaders());
      onDelete(feed.id);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/comments/create`,
        { content: newComment, post: { id: feed.id } },
        authHeaders(),
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
      {/* Post header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-indigo-600">
          {feed.user?.username || "Anonymous"}
        </span>
        <div className="flex items-center gap-3">
          {feed.createdAt && (
            <span className="text-xs text-gray-400">
              {new Date(feed.createdAt).toLocaleDateString()}
            </span>
          )}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-xs text-red-400 hover:text-red-600 font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-700 mb-3">{feed.content}</p>

      {/* Post image */}
      {feed.image && (
        <img
          src={feed.image}
          alt="Post attachment"
          className="max-h-64 max-w-full rounded-lg border border-gray-200 shadow-sm mx-auto mt-2"
        />
      )}

      {/* Like & comments row */}
      <div className="flex items-center gap-4 mb-2">
        {/* Like button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "fill-none"}`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        {/* Toggle comments */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="text-sm text-indigo-500 hover:underline"
        >
          {showComments ? "Hide" : "Show"} comments ({comments.length})
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div>
          <div className="space-y-2 mb-3">
            {comments.map((c, i) => (
              <div
                key={c.id || i}
                className="bg-gray-50 rounded-lg p-2 text-sm"
              >
                <span className="font-semibold text-indigo-500">
                  {c.user?.username || "User"}:
                </span>{" "}
                {c.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
