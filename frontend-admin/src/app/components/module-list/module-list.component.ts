import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleService } from '../../services/module.service';
import {
  ModuleDefinition,
  WarehouseModule,
  Warehouse
} from '../../models/module.model';
import { ModuleConfigComponent } from '../module-config/module-config.component';

@Component({
  selector: 'app-module-list',
  standalone: false,
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.scss']
})
export class ModuleListComponent implements OnInit {
  warehouses: Warehouse[] = [];
  selectedWarehouse: Warehouse | null = null;
  
  moduleDefinitions: ModuleDefinition[] = [];
  warehouseModules: WarehouseModule[] = [];
  
  loading = false;
  loadingDefinitions = false;

  displayedColumns: string[] = ['moduleName', 'code', 'order', 'required', 'status', 'actions'];

  constructor(
    private moduleService: ModuleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadModuleDefinitions();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.moduleService.getWarehouses().subscribe({
      next: (warehouses) => {
        this.warehouses = warehouses;
        if (warehouses.length > 0) {
          this.selectedWarehouse = warehouses[0];
          this.loadWarehouseModules();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouses', error);
        this.showMessage('Failed to load warehouses', 'error');
        this.loading = false;
      }
    });
  }

  loadModuleDefinitions(): void {
    this.loadingDefinitions = true;
    this.moduleService.getModuleDefinitions().subscribe({
      next: (definitions) => {
        this.moduleDefinitions = definitions;
        this.loadingDefinitions = false;
      },
      error: (error) => {
        console.error('Error loading module definitions', error);
        this.loadingDefinitions = false;
      }
    });
  }

  loadWarehouseModules(): void {
    if (!this.selectedWarehouse) return;

    this.loading = true;
    this.moduleService.getWarehouseModules(this.selectedWarehouse.id).subscribe({
      next: (modules) => {
        this.warehouseModules = modules.sort((a, b) => a.executionOrder - b.executionOrder);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading warehouse modules', error);
        this.showMessage('Failed to load modules', 'error');
        this.loading = false;
      }
    });
  }

  onWarehouseChange(): void {
    this.loadWarehouseModules();
  }

  isModuleEnabled(moduleCode: string): boolean {
    return this.warehouseModules.some(m => m.moduleCode === moduleCode && m.isEnabled);
  }

  getModuleForDefinition(definition: ModuleDefinition): WarehouseModule | undefined {
    return this.warehouseModules.find(m => m.moduleCode === definition.code);
  }

  openEnableDialog(definition: ModuleDefinition): void {
    if (!this.selectedWarehouse) return;

    const dialogRef = this.dialog.open(ModuleConfigComponent, {
      width: '600px',
      data: {
        warehouse: this.selectedWarehouse,
        moduleDefinition: definition,
        warehouseModules: this.warehouseModules
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadWarehouseModules();
      }
    });
  }

  disableModule(warehouseModule: WarehouseModule): void {
    if (!this.selectedWarehouse) return;
    
    if (warehouseModule.isRequired) {
      this.showMessage('Cannot disable required module', 'warning');
      return;
    }

    if (confirm(`Are you sure you want to disable ${warehouseModule.moduleName}?`)) {
      this.loading = true;
      this.moduleService.disableModule({
        warehouseId: this.selectedWarehouse.id,
        moduleType: warehouseModule.moduleType
      }).subscribe({
        next: () => {
          this.showMessage('Module disabled successfully', 'success');
          this.loadWarehouseModules();
        },
        error: (error) => {
          console.error('Error disabling module', error);
          this.showMessage(error.error?.error || 'Failed to disable module', 'error');
          this.loading = false;
        }
      });
    }
  }

  getStatusColor(module: WarehouseModule): string {
    if (!module.isEnabled) return 'warn';
    if (module.isRequired) return 'primary';
    return 'accent';
  }

  getStatusText(module: WarehouseModule): string {
    if (!module.isEnabled) return 'Disabled';
    if (module.isRequired) return 'Required';
    return 'Active';
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
