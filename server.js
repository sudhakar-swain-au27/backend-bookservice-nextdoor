import app from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";

const PORT = process.env.PORT ;

// Connect Database First
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
