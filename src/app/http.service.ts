import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  dataUrl = 'assets/data2.json';

  getData() {
    return this.http.get<TreeNode[]>(this.dataUrl);
  }
}
