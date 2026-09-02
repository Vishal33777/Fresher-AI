import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import { isAuth } from "./middleware/isAuth.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";

const app=express()
app.use(express.json())

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(morgan("dev"))
app.use(cookieParser())

const PORT=process.env.PORT

app.get("/",(req,res)=>{
  res.send("Hello from Gateway")
})

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace("/api/auth", "");
    }
  })
);

app.use(
  "/api/resume",
  isAuth,
  proxyWithHeaders(process.env.RESUME_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace("/api/resume", "");
    }
  })
);

app.use(
  "/api/interview",
  isAuth,
  proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace("/api/interview", "");
    }
  })
);

app.use(
  "/api/roadmap",
  isAuth,
  proxyWithHeaders(process.env.ROADMAP_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace("/api/roadmap", "");
    }
  })
);

app.use(
  "/api/billing",
  isAuth,
  proxyWithHeaders(process.env.BILLING_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      return req.originalUrl.replace("/api/billing", "");
    }
  })
);

app.get("/api/me",isAuth,getCurrentUser) 

app.listen(PORT,()=>{
  console.log(`Gateway Started on ${PORT}`)
})