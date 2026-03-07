import React, { useState } from "react";

function JoinRoom({ socket, user, setRoom, setPage }) {
  const [roomInput, setRoomInput] = useState("");

  const joinChat = () => {
    if (roomInput !== "") {
      socket.emit("join_room", roomInput);
      setRoom(roomInput);
      localStorage.setItem("room", roomInput);
      setPage("chat");
    }
  };

  return (
    <div className="joinRoom">
      <h1>Chat App</h1>

      <p>Welcome {user.name}</p>

      <input
        type="text"
        placeholder="Enter chat room number"
        onChange={(e) => setRoomInput(e.target.value)}
      />

      <button onClick={joinChat}>Join Chat</button>
    </div>
  );
}

export default JoinRoom;
