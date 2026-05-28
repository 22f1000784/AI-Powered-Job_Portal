import express from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import { DatabaseConnection } from "./config/database_connection"; 
import v1Routes from "./routes/v1";
import { errorHandler } from "./middle_wares/errorHandler";
import { seedAdmin } from "./config/seedadmin";

console.log("Save testing")
config();

class Server {
  private _app = express();

  async init() {
    await this._configure();
  }

  get app() {
    return this._app;
  }

  private async _configure() {
    // ❌ Disable DB for now (we isolate routing first)
    await DatabaseConnection.getInstance().init();
    console.log("save working")
    await seedAdmin();
  }
}

const server = new Server();

(async () => {
  await server.init();
  console.log("Save testing");

  // ✅ MIDDLEWARES
  server.app.use((req, res, next) => {
  console.log("🌍 GLOBAL HIT:", req.method, req.url);
  next();
});

  
  server.app.use(cors());
  server.app.use(express.json());
  server.app.use("/api/v1", v1Routes);
  
  // Serve user uploads statically
  server.app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      const filename = path.basename(filePath);
      if (!filename.includes(".")) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=" + filename + ".pdf");
      }
    }
  }));

  // Serve frontend build static files in production / when built
  const distPath = path.join(__dirname, "../../frontend/job_portal/dist");
  server.app.use(express.static(distPath));
  
  console.log("save working")

  // ✅ TEST ROUTE
  server.app.get("/test", (req, res) => {
    res.send("Server is working");
  });

  // Wildcard fallback route for client-side routing (React Router)
  server.app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  

  

   
  

  // ❌ ERROR HANDLER (add later)
  server.app.use(errorHandler);

  const port = Number(process.env.PORT) || 8080;

  server.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();