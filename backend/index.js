const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const authAdminRouter=require('./routes/adminAuth');
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors');
const truckRouter = require('./routes/truckRoutes');

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(authRouter);
app.use(authAdminRouter);
app.use('/api', truckRouter);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port ${PORT}`);
});

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   next();
// });



