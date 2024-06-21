import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

const app = express.default();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/world-map');

app.engine('html', ngExpressEngine({
  bootstrap: require('./dist/world-map/server/main').AppServerModule
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});