import React, { useState, useEffect, useRef } from "react";
import msgAlert from "./audio/message-alert.mp3";

export const Chat = ({ socket, userName, room }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState("");
  const music = new Audio(msgAlert);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: userName,
        message: currentMessage,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      socket.emit("stop_typing", { room });
      setMessageList((list) => [...list, messageData]);
      setcurrentMessage("");
      music.play();
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const handleTyping = (data) => {
      setIsTyping(`${data.author} is typing...`);
    };

    const handleStopTyping = () => {
      setIsTyping("");
    };

    socket.on("receive_message", handleReceiveMsg);
    socket.on("show_typing", handleTyping);
    socket.on("hide_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleReceiveMsg);
      socket.off("show_typing", handleTyping);
      socket.off("hide_typing", handleStopTyping);
    };
  }, [socket]);

  const containRef = useRef(null);

  useEffect(() => {
    if (containRef.current) {
      containRef.current.scrollTop = containRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <>
      <div className="chatcontainer">
        <div className="chatHeader">
          <h2>Chatroom:- {room}</h2>
          <p className={`headerStatus ${isTyping ? "typing" : ""}`}>
            {isTyping ? (
              isTyping
            ) : (
              <>
                Logged in as:- <span>{userName}</span>
              </>
            )}
          </p>
        </div>

        <div className="chatbox">
          <div className="autoscroll" ref={containRef}>
            {messageList.map((data) => (
              <div
                key={data.id}
                className="msgcontent"
                id={userName == data.author ? "you" : "other"}
              >
                <div>
                  <div
                    className="msg"
                    id={userName == data.author ? "send" : "receive"}
                  >
                    <p>{data.message}</p>
                  </div>
                  <div className="msgdetail">
                    <p>{data.author}</p>
                    <p>{data.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chatbody">
            <input
              type="text"
              placeholder="Type your message"
              value={currentMessage}
              onChange={(e) => {
                setcurrentMessage(e.target.value);

                if (e.target.value !== "") {
                  socket.emit("typing", { room, author: userName });
                } else {
                  socket.emit("stop_typing", { room });
                }
              }}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
              }}
            />
            <button onClick={sendMessage}>&#9658;</button>
          </div>
        </div>
      </div>
    </>
  );
};
