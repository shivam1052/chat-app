import React, { useState } from "react";
import io from "socket.io-client";
import { Chat } from "./Chat";
import loginMusic from "./audio/login.wav";

const socket = io.connect("http://localhost:3000");

const App = () => {
  const [userName, setuserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const music = new Audio(loginMusic);

  const joinChat = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      music.play();
    }
  };

  return (
    <>
      {!showChat && (
        <div className="joinRoom">
          <h1>Chat App</h1>
          <input
            type="text"
            placeholder="Enter name"
            onChange={(e) => setuserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter chat room no."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinChat}>Join Chat</button>
        </div>
      )}

      {showChat && <Chat socket={socket} userName={userName} room={room} />}
    </>
  );
};

export default App;
