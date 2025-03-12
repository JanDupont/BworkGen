import { Application, Router } from "@oak/oak";
import { oakCors } from "@tajpouria/cors";
import { handleWebSocket } from "./socket.ts";

const router = new Router();

router
	.get("/", (context) => {
		context.response.body = "Welcome to BworkGen API!";
	})
	.get("/stuff", (context) => {
		context.response.body = "Please connect to /ws/stuff for genetic algorithm updates";
	});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

// Socket
app.use(handleWebSocket);

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
