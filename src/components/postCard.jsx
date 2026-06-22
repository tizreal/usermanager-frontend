import React, { useState } from "react";
import axios from "axios";
import { authHeaders, API_BASE_URL_URL } from "../api";

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

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill={filled ? "currentColor" : "none"}
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
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const PostCard = ({ feed, onDelete }) => {
  const [comments, setComments] = useState(feed.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(feed.likesCount || 0);

  const currentUsername = getCurrentUsername();
  const isOwner = currentUsername && currentUsername === feed.user?.username;
  const postUsername = feed.user?.username || "Anonymous";
  const initials = postUsername[0].toUpperCase();

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post(
          `${API_BASE_URL}/posts/${feed.id}/unlike`,
          {},
          authHeaders(),
        );
        setLikeCount((c) => c - 1);
      } else {
        await axios.post(
          `${API_BASE_URL}/posts/${feed.id}/like`,
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
      await axios.delete(`${API_BASE_URL}/posts/${feed.id}`, authHeaders());
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
        `${API_BASE_URL}/comments/create`,
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
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-tight">
              {postUsername}
            </p>
            {feed.createdAt && (
              <p className="text-xs text-gray-400">
                {new Date(feed.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"
            title="Delete post"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 text-sm mb-3">{feed.content}</p>

      {/* Post image */}
      {feed.image && (
        <img
          src={feed.image}
          alt="Post attachment"
          className="max-h-64 max-w-full rounded-lg border border-gray-200 shadow-sm mx-auto mt-2 mb-3"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <HeartIcon filled={liked} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-indigo-500 transition-colors"
        >
          <CommentIcon />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 border-t border-gray-100 pt-3">
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
            {comments.length === 0 && (
              <p className="text-xs text-gray-400">No comments yet.</p>
            )}
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
