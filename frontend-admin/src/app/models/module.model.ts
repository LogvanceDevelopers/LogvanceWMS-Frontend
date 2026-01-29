export interface ModuleDefinition {
  id: string;
  moduleType: string;
  code: string;
  name: string;
  description?: string;
  isRequired: boolean;
  isSystemEnabled: boolean;
  serviceEndpoint?: string;
  eventTopic?: string;
  defaultExecutionOrder: number;
  defaultSettings?: string;
}

export interface WarehouseModule {
  id: string;
  warehouseId: string;
  moduleType: string;
  moduleCode: string;
  moduleName: string;
  isEnabled: boolean;
  isRequired: boolean;
  executionOrder: number;
  canSkip: boolean;
  skipConditions?: string;
  customSettings?: string;
  activatedAt?: Date;
}

export interface EnableModuleRequest {
  warehouseId: string;
  moduleDefinitionId: string;
  executionOrder: number;
  isRequired: boolean;
  canSkip: boolean;
  skipConditions?: string;
  customSettings?: string;
}

export interface DisableModuleRequest {
  warehouseId: string;
  moduleType: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
}
