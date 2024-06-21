import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './app/app.server.module';
import { environment } from './environments/environment';
import { readFileSync } from 'fs';
import { join } from 'path';

if (environment.production) {
  enableProdMode();
}

const indexHtml = readFileSync(join(__dirname, '..', 'dist/world-map/browser/index.html')).toString();

export function appServerModule() {
  return renderModule(AppServerModule, {
    document: indexHtml
  });
}

function enableProdMode() {
    throw new Error('Function not implemented.');
}