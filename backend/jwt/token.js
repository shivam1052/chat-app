import jwt from "jsonwebtoken";

const createToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "10d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
};

export default createToken;
