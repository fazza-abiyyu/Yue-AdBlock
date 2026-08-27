import { app } from '../src/app';

const fetchFn = app.fetch.bind(app);
export default fetchFn;
