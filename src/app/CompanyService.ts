import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private baseUrl = 'http://localhost:8080'; // Substitua pela URL da sua API local

    constructor(private http: HttpClient) { }

    enviarDados(formData: any): Observable<any> {
        const url = `${this.baseUrl}/company`; // Substitua 'company' pela rota apropriada

        return this.http.post(url, formData);
    }
}
