import React, { useState } from "react";
import { supabase } from "../supabase";

const AddUser: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setUploading(true);

    let profilePictureUrl = "";

    try {
      // If a file is selected, upload it
      if (selectedFile && email) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${email.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw uploadError;
        }

        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from("profile-pictures")
          .getPublicUrl(fileName);

        if (publicUrlData) {
          profilePictureUrl = publicUrlData.publicUrl;
        }
      }

      // Insert the user record
      const { error: insertError } = await supabase.from("users").insert([
        {
          display_name: displayName,
          bio: bio,
          profile_picture_url: profilePictureUrl, // Will be empty string if no file uploaded
          email: email,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setMessage("User added successfully");
      setDisplayName("");
      setBio("");
      setEmail("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error adding user: ", error);
      setMessage("Error adding user");
    } finally {
      setUploading(false);
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

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", color: "#555" }}
          >
            Profile Picture:
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                marginTop: "5px",
                display: "block",
              }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: uploading ? "#ccc" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Add User"}
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
