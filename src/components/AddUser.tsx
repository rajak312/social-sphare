import React, { useState } from "react";
import { supabase } from "../supabase";

const AddUser: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const { data, error } = await supabase.from("users").insert([
        {
          display_name: displayName,
          bio: bio,
          profile_picture_url: profilePictureUrl,
          email: email,
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage(`User added successfully`);
      setDisplayName("");
      setBio("");
      setProfilePictureUrl("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user: ", error);
      setMessage("Error adding user");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>Add User</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minHeight: "60px",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Profile Picture URL:
            <input
              type="url"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="https://example.com/my-picture.jpg"
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              placeholder="user@example.com"
            />
          </label>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add User
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("Error") ? "red" : "green",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AddUser;
