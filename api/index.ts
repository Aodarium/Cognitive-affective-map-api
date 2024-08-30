import http from "http";
import app from "./v1/src/app";

const httpServer = http.createServer(app);
const PORT: number = (process.env.PORT as unknown as number) ?? 3001;
httpServer.listen(PORT, () =>
    console.log(`The server is running on port ${PORT}`)
);

export default app;
