import { supabase } from "../supabase";
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;

export async function uploadImage(file: File): Promise<string | null> {
  if (!file) {
    alert("Please select a file!");
  }

  const fileName = `${Date.now()}-${file.name}`;
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
    }
    if (!data) return null;
    const publicUrl = `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/${bucketName}/${data.path}`;
    return publicUrl;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}

// export async function getUser(userId:string){
//     return await supabase.from('users').fetch()
// }
