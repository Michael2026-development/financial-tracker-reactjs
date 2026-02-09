import "dotenv/config";
import { createApp } from "./app";

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📚 API available at http://localhost:${port}/api`);
    console.log(`🔐 Auth available at http://localhost:${port}/api/auth`);
});
