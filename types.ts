
export enum ShapeType {
  SQUARE = 'Square',
  RECTANGLE = 'Rectangle',
  CIRCLE = 'Circle',
  TRIANGLE = 'Triangle',
  PARALLELOGRAM = 'Parallelogram'
}

export interface CalculationResult {
  id: string;
  shape: ShapeType;
  inputs: Record<string, number>;
  area: number;
  perimeter: number;
  timestamp: number;
}

export interface ShapeConfig {
  type: ShapeType;
  icon: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
  }[];
}
