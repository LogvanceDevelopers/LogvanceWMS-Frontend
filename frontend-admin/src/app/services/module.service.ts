import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ModuleDefinition,
  WarehouseModule,
  EnableModuleRequest,
  DisableModuleRequest,
  Warehouse
} from '../models/module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private readonly baseUrl = `${environment.apiUrl}/modules`;

  constructor(private http: HttpClient) {}

  /**
   * Get all available module definitions
   */
  getModuleDefinitions(): Observable<ModuleDefinition[]> {
    return this.http.get<ModuleDefinition[]>(`${this.baseUrl}/definitions`);
  }

  /**
   * Get active modules for a warehouse
   */
  getWarehouseModules(warehouseId: string): Observable<WarehouseModule[]> {
    return this.http.get<WarehouseModule[]>(`${this.baseUrl}/warehouse/${warehouseId}`);
  }

  /**
   * Enable a module for a warehouse
   */
  enableModule(request: EnableModuleRequest): Observable<{ warehouseModuleId: string; message: string }> {
    return this.http.post<{ warehouseModuleId: string; message: string }>(
      `${this.baseUrl}/enable`,
      request
    );
  }

  /**
   * Disable a module for a warehouse
   */
  disableModule(request: DisableModuleRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/disable`,
      request
    );
  }

  /**
   * Get all warehouses (for selection)
   */
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${environment.apiUrl}/warehouses`);
  }
}
