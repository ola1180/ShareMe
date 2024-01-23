import React from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

import { client } from "../client";

function Login() {
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    const userObject = jwtDecode(response.credential);
    console.log(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));

    const { given_name, sub, picture } = userObject;

    const doc = {
      _id: sub,
      _type: "user",
      userName: given_name,
      image: picture,
    };

    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_API_TOKEN,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("google-button"), {
      theme: "outline",
      size: "large",
    });
  }, []);
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div id="google-button"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
