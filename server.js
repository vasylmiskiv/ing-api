import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import UserRoutes from "./routes/userRoutes.js";

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  initializeMiddlewares() {
    this.app.use(
      cors({
        origin: ["*"],
        methods: ["GET", "POST", "PUT", "PATCH"],
        credentials: true,
      })
    );

    connectDB();

    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.engine("handlebars", engine({ defaultLayout: false }));
    this.app.set("view engine", "handlebars");
    this.app.set("views", "./views");
  }

  initializeRoutes() {
    const userRoutes = new UserRoutes();

    this.app.use("/api/users", userRoutes.getRouter());

    this.app.get("/api", (req, res) => {
      res.render("index");
    });
  }

  initializeErrorHandlers() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  listen() {
    this.app.listen(this.port, () =>
      console.log(`Server started on port ${this.port}`)
    );
  }
}

const app = new App();

app.listen();
