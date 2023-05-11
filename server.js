import { app } from "./app.js";
import connectDb from "./database/connectDb.js";

connectDb();

app.listen(process.env.PORT, () => console.log(`server Started on http://localhost:${process.env.PORT}`))