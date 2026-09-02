import express from "express";
import {
  addCoins,
  GoogleAuth,
  logOut,
  useCoins
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", GoogleAuth);
authRouter.get("/logout", logOut);
authRouter.post("/use-coins",useCoins);
authRouter.post("/add-coins",addCoins);

export default authRouter;