import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleService } from '../../services/module.service';
import {
  ModuleDefinition,
  WarehouseModule,
  Warehouse
} from '../../models/module.model';

export interface ModuleConfigData {
  warehouse: Warehouse;
  moduleDefinition: ModuleDefinition;
  warehouseModules: WarehouseModule[];
}

@Component({
  selector: 'app-module-config',
  standalone: false,
  templateUrl: './module-config.component.html',
  styleUrls: ['./module-config.component.scss']
})
export class ModuleConfigComponent implements OnInit {
  configForm!: FormGroup;
  loading = false;
  isEditMode = false;
  existingModule?: WarehouseModule;

  constructor(
    private fb: FormBuilder,
    private moduleService: ModuleService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModuleConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleConfigData
  ) {}

  ngOnInit(): void {
    // Check if module is already configured
    this.existingModule = this.data.warehouseModules.find(
      m => m.moduleCode === this.data.moduleDefinition.code
    );
    this.isEditMode = !!this.existingModule;

    // Calculate next execution order
    const maxOrder = this.data.warehouseModules.length > 0
      ? Math.max(...this.data.warehouseModules.map(m => m.executionOrder))
      : 0;
    const nextOrder = this.existingModule?.executionOrder || (maxOrder + 10);

    // Initialize form
    this.configForm = this.fb.group({
      executionOrder: [nextOrder, [Validators.required, Validators.min(1)]],
      isRequired: [this.existingModule?.isRequired || this.data.moduleDefinition.isRequired],
      canSkip: [this.existingModule?.canSkip !== undefined ? this.existingModule.canSkip : !this.data.moduleDefinition.isRequired],
      skipConditions: [this.existingModule?.skipConditions || ''],
      customSettings: [this.existingModule?.customSettings || this.data.moduleDefinition.defaultSettings || '']
    });
  }

  get title(): string {
    return this.isEditMode 
      ? `Configure ${this.data.moduleDefinition.name}`
      : `Enable ${this.data.moduleDefinition.name}`;
  }

  onSubmit(): void {
    if (this.configForm.invalid) {
      return;
    }

    this.loading = true;
    const formValue = this.configForm.value;

    this.moduleService.enableModule({
      warehouseId: this.data.warehouse.id,
      moduleDefinitionId: this.data.moduleDefinition.id,
      executionOrder: formValue.executionOrder,
      isRequired: formValue.isRequired,
      canSkip: formValue.canSkip,
      skipConditions: formValue.skipConditions || undefined,
      customSettings: formValue.customSettings || undefined
    }).subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode ? 'Module updated successfully' : 'Module enabled successfully',
          'Close',
          { duration: 3000, panelClass: ['snackbar-success'] }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error enabling/updating module', error);
        this.snackBar.open(
          error.error?.error || 'Failed to save module configuration',
          'Close',
          { duration: 5000, panelClass: ['snackbar-error'] }
        );
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  isJsonValid(jsonString: string): boolean {
    if (!jsonString || jsonString.trim() === '') return true;
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }
}
