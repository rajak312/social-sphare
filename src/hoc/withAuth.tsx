// src/hoc/withAuth.tsx
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
              dispatch(loginUser({ email, name: nameToUse }));
              await ensureUserInSupabase(email, nameToUse, photoURL);
              setShowLoginModal(false);
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
    ) => {
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
          return;
        }

        if (!existingUsers || existingUsers.length === 0) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              display_name: displayName,
              bio: "",
              profile_picture_url: profilePictureUrl || "",
              email: email,
            },
          ]);

          if (insertError) {
            console.error(
              "Error inserting new user into Supabase:",
              insertError
            );
          }
        }
      } catch (error) {
        console.error("Unexpected error ensuring user in Supabase:", error);
      }
    };

    if (checkingAuth) return null;
    if (!userEmail && showLoginModal) {
      return <LogIn onClose={() => navigate("/")} />;
    }

    return userEmail ? <WrappedComponent {...(props as T)} /> : null;
  };

  return WithAuth;
}

export default withAuth;
