import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const port = process.env.PORT || 8080;

const app = express();

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/api", (req, res) => {
  res.render("index");
});

// custom middleware handlers
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
