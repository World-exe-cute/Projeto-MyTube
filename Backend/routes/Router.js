const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/videos", require("./VideoRouter"));
router.use("/api/home", require("./HomeRoutes"));
router.use("/api/posts", require("./PostRoutes"));
router.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

module.exports = router;
