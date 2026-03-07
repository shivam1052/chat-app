import express from "express";
import Message from "../models/message.models.js";

const router = express.Router();

router.get("/:room", async (req, res) => {
  const messages = await Message.find({ room: req.params.room });
  res.json(messages);
});

export default router;
