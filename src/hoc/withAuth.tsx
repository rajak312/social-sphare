import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { loginUser } from "../store/userSlice";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";
import { supabase } from "../supabase";
import Login from "../components/Auth/Login";

interface WithAuthProps {}

export interface SupabaseUser {
  id: string | null;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  background_image: string | null;
}

function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithAuth: React.FC<T & WithAuthProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email: userEmail } = useSelector((state: RootState) => state.user);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
      console.log("Setting up auth state listener...");
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user: FirebaseUser | null) => {
          console.log("Auth state changed. User:", user);
          if (user) {
            const { email, displayName, photoURL } = user;
            const nameToUse =
              displayName || (email ? email.split("@")[0] : "Anonymous");

            if (email) {
              const supabaseUser = await ensureUserInSupabase(
                email,
                nameToUse,
                photoURL
              );
              console.log("Supabase user:", supabaseUser);
              if (supabaseUser) {
                dispatch(
                  loginUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    displayName: supabaseUser.display_name,
                    bio: supabaseUser.bio,
                    profilePictureUrl: supabaseUser.profile_picture_url,
                    backgroundImage: supabaseUser.background_image,
                  })
                );
              }
            }
          } else {
            console.log("No user is authenticated.");
          }
          setCheckingAuth(false);
        }
      );

      return () => {
        console.log("Unsubscribing from auth state listener.");
        unsubscribe();
      };
    }, [dispatch]);

    const ensureUserInSupabase = async (
      email: string,
      displayName: string,
      profilePictureUrl?: string | null
    ): Promise<SupabaseUser | null> => {
      try {
        const { data: existingUsers, error: selectError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .limit(1);

        if (selectError) {
          console.error(
            "Error checking if user exists in Supabase:",
            selectError
          );
          return null;
        }
        if (!existingUsers || existingUsers.length === 0) {
          console.log("User not found in Supabase. Inserting new user...");
          const { data: insertedData, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                display_name: displayName,
                bio: "",
                profile_picture_url: profilePictureUrl || "",
                email: email,
                background_image: "", // Provide a default value
              },
            ])
            .select();

          if (insertError) {
            console.error(
              "Error inserting new user into Supabase:",
              insertError
            );
            return null;
          }

          if (insertedData && insertedData.length > 0) {
            console.log("Inserted new user into Supabase:", insertedData[0]);
            return insertedData[0] as SupabaseUser;
          }
        } else {
          console.log("User already exists in Supabase:", existingUsers[0]);
          return existingUsers[0] as SupabaseUser;
        }
      } catch (error) {
        console.error("Unexpected error ensuring user in Supabase:", error);
      }

      return null;
    };

    if (checkingAuth) {
      console.log("Checking authentication...");
      return null; // Or a loading spinner
    }

    if (!userEmail) {
      console.log("User is not authenticated. Rendering Login component.");
      return <Login />;
    }

    console.log("User is authenticated. Rendering WrappedComponent.");
    return <WrappedComponent {...(props as T)} />;
  };

  return WithAuth;
}

export default withAuth;
