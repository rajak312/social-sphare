import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { loginUser } from "../store/userSlice";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import LogIn from "../components/Auth/LogIn";
import { auth } from "../firebase";
import { supabase } from "../supabase";

interface WithAuthProps {}

export interface SupabaseUser {
  id: string | null;
  email: string | null;
  display_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  background_image: string;
}

function withAuth<T extends object>(WrappedComponent: React.ComponentType<T>) {
  const WithAuth: React.FC<T & WithAuthProps> = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email: userEmail } = useSelector((state: RootState) => state.user);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user: FirebaseUser | null) => {
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
                setShowLoginModal(false);
              } else {
                console.error("Could not load Supabase user record.");
              }
            }
          } else {
            setShowLoginModal(true);
          }
          setCheckingAuth(false);
        }
      );

      return () => {
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
          const { data: insertedData, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                display_name: displayName,
                bio: "",
                profile_picture_url: profilePictureUrl || "",
                email: email,
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
            return insertedData[0] as SupabaseUser;
          }
        } else {
          return existingUsers[0] as SupabaseUser;
        }
      } catch (error) {
        console.error("Unexpected error ensuring user in Supabase:", error);
      }

      return null;
    };

    if (checkingAuth) return null;

    return (
      <div>
        <WrappedComponent {...(props as T)} />
        {!userEmail && showLoginModal && <LogIn />}
      </div>
    );
  };

  return WithAuth;
}

export default withAuth;
