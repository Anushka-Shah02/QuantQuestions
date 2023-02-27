const express = require('express');
const dotenv = require('dotenv');
const {mongoose} = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

// imports
const authController = require('./routes/auth')
const questionsController = require('./routes/questions');

dotenv.config();
const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;

mongoose.set('strictQuery', false);
mongoose.connect(mongo_url,()=>{
    console.log("DB connection successful!!!");
})

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

app.use('/auth',authController);
app.use('/question',questionsController);

app.listen(port,()=>{
    console.log(`Server is listening at ${port}`);
})