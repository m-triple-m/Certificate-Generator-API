const express = require('express');
const app = express();
const certificateRouter = require('./routers/certificateRouter');
const templateRouter = require('./routers/templateRouter');
const userRouter = require('./routers/userRouter');
const utilRouter = require('./routers/utils');
const cors = require('cors');

const port = process.env.PORT || 5000;

app.use(cors({
    origin: ['http://localhost:3000', 'https://digi-generate.onrender.com'],
}))

app.use(express.json());

app.use('/certificate', certificateRouter);
app.use('/template', templateRouter);
app.use('/user', userRouter);
app.use('/util', utilRouter);

app.use(express.static('./static'));

app.get('/', (req, res) => {
    res.send('server works');
    });

app.listen(port, () => {
    console.log(`listening at ${port}`);
});