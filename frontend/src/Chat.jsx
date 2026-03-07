import React, { useState, useEffect, useRef } from "react";
import msgAlert from "./audio/message-alert.mp3";
import { IoClose } from "react-icons/io5";

export const Chat = ({
  socket,
  userName,
  room,
  setUser,
  setAuthMode,
  setRoom,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState("");
  const music = useRef(new Audio(msgAlert));
  const scrollRef = useRef(null);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const messageData = {
      id: Date.now(),
      room,
      author: userName,
      message: currentMessage,
      time:
        (new Date().getHours() % 12 || 12) +
        ":" +
        String(new Date().getMinutes()).padStart(2, "0"),
    };

    await socket.emit("send_message", messageData);
    socket.emit("stop_typing", { room });
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage("");
    music.current.play();
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("show_typing", (data) =>
      setIsTyping(`${data.author} is typing...`),
    );
    socket.on("hide_typing", () => setIsTyping(""));

    return () => {
      socket.off("receive_message");
      socket.off("show_typing");
      socket.off("hide_typing");
    };
  }, [socket]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/messages/${room}`);
        const data = await res.json();
        setMessageList(data);
      } catch (err) {
        console.log("Fetch messages error:", err);
      }
    };
    fetchMessages();
  }, [room]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="chatcontainer">
      {/* Header */}
      <div className="chatHeader">
        <div className="chatHeaderLeft">
          <h2>{room}</h2>
          <p className={`headerStatus ${isTyping ? "typing" : ""}`}>
            {isTyping || `Logged in as: ${userName}`}
          </p>
        </div>

        <IoClose
          className="logoutIcon"
          onClick={async () => {
            try {
              await fetch("http://localhost:3000/user/logout", {
                method: "POST",
                credentials: "include",
              });
            } catch (err) {
              console.log("Logout failed:", err);
            }

            localStorage.removeItem("user");
            localStorage.removeItem("room");

            setUser(null);
            setRoom("");
            setAuthMode("login");
          }}
        />
      </div>

      {/* Messages */}
      <div className="chatbox">
        <div className="autoscroll" ref={scrollRef}>
          {messageList.map((msg) => {
            const isMe = msg.author === userName;
            return (
              <div
                key={msg.id}
                className={`msgcontent ${isMe ? "you" : "other"}`}
              >
                <div className={isMe ? "bubble send" : "bubble receive"}>
                  {msg.message}
                  <div className="msgdetail">
                    <span>{msg.author}</span>
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="chatbody">
          <input
            type="text"
            placeholder="Type a message"
            value={currentMessage}
            onChange={(e) => {
              setCurrentMessage(e.target.value);
              if (e.target.value)
                socket.emit("typing", { room, author: userName });
              else socket.emit("stop_typing", { room });
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </div>
  );
};
