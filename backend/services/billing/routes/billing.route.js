import express from "express"
import { createrOrder, verifyPayment } from "../controllers/billing.controller.js"


const billingRouter=express.Router()

billingRouter.post("/create",createrOrder)
billingRouter.post("/verify",verifyPayment)


export default billingRouter