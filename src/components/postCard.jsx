// Create a PostCard component in src/components/PostCard.jsx
import React, { useState } from "react";
import axios from "axios";
import { authHeaders, API_BASE } from "../api";

const PostCard = ({ feed }) => {
  const [comments, setComments] = useState(feed.comments || []);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

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
        {feed.createdAt && (
          <span className="text-xs text-gray-400">
            {new Date(feed.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
      {/* Post content */}
      <p className="text-gray-700 mb-3">{feed.content}</p>",
      {/* Toggle comments */}
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="text-sm text-indigo-500 hover:underline mb-2"
      >
        {showComments ? "Hide" : "Show"} comments ({comments.length})
      </button>
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
          {/* Add comment form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring
2 focus:ring-indigo-400"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded
lg text-sm font-semibold"
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
