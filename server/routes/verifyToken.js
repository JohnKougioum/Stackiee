const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

module.exports = function (req, res, next) {
  const authHeader = req.cookies.accessToken;
  // console.log(authHeader);
  // const token = authHeader && authHeader.split(" ")[1];
  if (authHeader == null) return res.sendStatus(401);

  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, useruid) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.useruid = useruid;
    next();
  });
};
