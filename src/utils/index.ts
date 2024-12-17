import { supabase } from "../supabase";
import { PostWithRelations, User } from "./types";
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

export async function uploadFile(file: File): Promise<string | null> {
  if (!file) {
    alert("Please select a file!");
    return null;
  }

  const sanitizedFileName = file.name.replace(/\s+/g, "");
  const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;
  const sanitizedFile = new File([file], sanitizedFileName, {
    type: file.type,
  });

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, sanitizedFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    if (!data) {
      console.error("No data returned after upload.");
      return null;
    }

    const publicUrl = `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/${bucketName}/${data.path}`;
    return publicUrl;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}

export async function getUser(id: string) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .limit(1);
    if (error) {
      console.error("Error in fetchin user", error);
    }
    return data?.[0] as User;
  } catch (error) {
    console.error("Error in Fetcing the data", error);
  }
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
          *,
          post_images(*),
          likes(*)
        `
    )
    .eq("id", id)
    .limit(1);
  if (error) {
    console.log("Error is fetching posts", error);
  }

  return data?.[0] as PostWithRelations;
}
