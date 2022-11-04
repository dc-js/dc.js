import express from 'express';
import cors from 'cors';
import { creatAdapter, loadAndProcessData } from './data-server.mjs';
import { dateTimeReviver } from './utils/date-time-reviver.mjs';

const app = express();
const port = 3030;

app.use(express.json({ reviver: dateTimeReviver })); // for parsing application/json
app.use(cors()); // cors

const data = loadAndProcessData('src/ndx.csv');
const adaptor = creatAdapter(data);

app.post('/api/stock', (req, res) => {
    adaptor.filterStorage.restore(req.body.filters);
    console.log(`${adaptor.groupAll.value()} of ${adaptor.cf.size()}`);
    const result = adaptor.computeChartData();
    res.json(result);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
