const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

// set up server

const app = express();
const PORT = process.env.PORT || 5000;
const SERVERNAME = process.env.SERVERNAME || "localhost";
const PROTOCOL = process.env.PROTOCOL || "http";

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: [
            `${PROTOCOL}://${SERVERNAME}:${PORT}`,
            `${PROTOCOL}://${SERVERNAME}`,
            `${PROTOCOL}://${SERVERNAME}:3000`,
            `${SERVERNAME}`,
        ],
        credentials: true,
    })
);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const attributesRouter = require("./routes/Attributes");
app.use("/attributes", attributesRouter);
const categoriesRouter = require("./routes/Categories");
app.use("/categories", categoriesRouter);
const productsRouter = require("./routes/Products");
app.use("/products", productsRouter);
const customerRouter = require("./routes/Customers");
app.use("/customers", customerRouter);

const db = require("./models");

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});