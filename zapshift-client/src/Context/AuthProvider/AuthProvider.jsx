import React, { useEffect, useState } from "react";

import { AuthContext } from "../AuthContext/AuthContext";
import axiosInstance from "../../service/axiosInstance";


const TOKEN_KEY = "zapshift-token";
const USER_KEY = "zapshift-user";


const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem(USER_KEY);

    return cachedUser
      ? JSON.parse(cachedUser)
      : null;
  });


  const [loading, setLoading] = useState(true);



  // Verify existing token
  useEffect(() => {

    const verifyUser = async () => {

      const token = localStorage.getItem(TOKEN_KEY);


      if (!token) {
        setLoading(false);
        return;
      }


      try {

        const res = await axiosInstance.get("/auth/me");


        const freshUser = {
          displayName: res.data.data.name,
          email: res.data.data.email,
          role: res.data.data.role
        };


        setUser(freshUser);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(freshUser)
        );


      } catch (error) {
        console.log(error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    verifyUser();

  }, []);




  const persistSession = ({ token, user: apiUser }) => {


    const mappedUser = {

      displayName: apiUser.name,

      email: apiUser.email,

      role: apiUser.role

    };


    localStorage.setItem(
      TOKEN_KEY,
      token
    );


    localStorage.setItem(
      USER_KEY,
      JSON.stringify(mappedUser)
    );


    setUser(mappedUser);


    return mappedUser;

  };




  const signup = async ({ name, email, password }) => {

    setLoading(true);


    try {

      const res = await axiosInstance.post(
        "/auth/register",
        {
          name,
          email,
          password
        }
      );


      return persistSession(
        res.data.data
      );


    } finally {

      setLoading(false);

    }

  };





  const login = async (email, password) => {

    setLoading(true);


    try {

      const res = await axiosInstance.post(
        "/auth/login",
        {
          email,
          password
        }
      );


      return persistSession(
        res.data.data
      );


    } finally {

      setLoading(false);

    }

  };





  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(USER_KEY);

    setUser(null);

  };




  const authInfo = {

    user,

    loading,

    setUser,

    login,

    signup,

    logout

  };



  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );

};


export default AuthProvider;