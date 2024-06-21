import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class WorldbankApiService {
  private baseUrl = 'http://api.worldbank.org/V2/';

  constructor(private http: HttpClient) { }

  getCountryInfoFromWorldbank(countryId: string): Observable<any> {
    const countryInfoUrl = `${this.baseUrl}/country/${countryId}?format=json`;

    return this.http.get<any>(countryInfoUrl).pipe(
      map(results => {
        const countryDataArray = results[1] as Array<any>;

        if (countryDataArray.length > 0) {
          return countryDataArray[0];
        }
        return null;
      })
    );
  }

  loadCountryNames(csvFilePath: string): Promise<{ [key: string]: string }> {
    return new Promise((resolve, reject) => {
      this.http.get(csvFilePath, { responseType: 'text' }).subscribe(
        data => {
          Papa.parse(data, {
            header: true,
            complete: (result) => {
              const countryNames: { [key: string]: string } = {};
              result.data.forEach((row: any) => {
                countryNames[row.code] = row.name;
              });
              resolve(countryNames);
            },
            error: (error: any) => {
              reject(error);
            }
          });
        },
        error => {
          reject(error);
        }
      );
    });
  }
}
