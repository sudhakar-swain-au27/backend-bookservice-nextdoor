import app from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";
import reminderJob from './src/jobs/reminder.job.js';

const PORT = process.env.PORT ;

// Connect Database First
connectDB();

// Start scheduled jobs
reminderJob.startReminderJob();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
