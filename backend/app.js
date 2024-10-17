const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const eventRoute = require("./routes/eventRoute");
const loginRoute = require("./routes/loginRoute");
const tokenRoute = require("./routes/tokenRoute");
const signupRoute = require("./routes/signupRoute");

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    })
);
app.options('*', cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// unprotected route
app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/token", tokenRoute);

// protected routes
app.use("/event", eventRoute);

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;