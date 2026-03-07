import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Signup from "./components/Signup";
import Login from "./components/Login";
import JoinRoom from "./components/JoinRoom";
import { Chat } from "./Chat";

const socket = io.connect("http://localhost:3000");

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(localStorage.getItem("room") || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/user/${savedUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setRoom(localStorage.getItem("room") || "");
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("room");
          setUser(null);
        }
      } catch (err) {
        console.log("User verification failed:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("room");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return authMode === "login" ? (
      <Login setUser={setUser} setAuthMode={setAuthMode} />
    ) : (
      <Signup setUser={setUser} setAuthMode={setAuthMode} />
    );
  }
  if (!room) {
    return <JoinRoom socket={socket} user={user} setRoom={setRoom} />;
  }

  return (
    <Chat
      socket={socket}
      userName={user.name}
      room={room}
      setUser={setUser}
      setRoom={setRoom}
      setAuthMode={setAuthMode}
    />
  );
}

export default App;
