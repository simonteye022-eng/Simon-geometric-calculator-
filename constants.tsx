
import { ShapeType, ShapeConfig } from './types';

export const SHAPE_CONFIGS: Record<ShapeType, ShapeConfig> = {
  [ShapeType.SQUARE]: {
    type: ShapeType.SQUARE,
    icon: 'fa-square',
    fields: [
      { key: 'side', label: 'Side Length', placeholder: 'Enter side length' }
    ]
  },
  [ShapeType.RECTANGLE]: {
    type: ShapeType.RECTANGLE,
    icon: 'fa-rectangle-wide',
    fields: [
      { key: 'length', label: 'Length', placeholder: 'Enter length' },
      { key: 'width', label: 'Width', placeholder: 'Enter width' }
    ]
  },
  [ShapeType.CIRCLE]: {
    type: ShapeType.CIRCLE,
    icon: 'fa-circle',
    fields: [
      { key: 'radius', label: 'Radius', placeholder: 'Enter radius' }
    ]
  },
  [ShapeType.TRIANGLE]: {
    type: ShapeType.TRIANGLE,
    icon: 'fa-triangle',
    fields: [
      { key: 'base', label: 'Base', placeholder: 'Enter base' },
      { key: 'height', label: 'Height', placeholder: 'Enter height' },
      { key: 'sideA', label: 'Side A', placeholder: 'Enter side A' },
      { key: 'sideB', label: 'Side B', placeholder: 'Enter side B' },
      { key: 'sideC', label: 'Side C', placeholder: 'Enter side C' }
    ]
  },
  [ShapeType.PARALLELOGRAM]: {
    type: ShapeType.PARALLELOGRAM,
    icon: 'fa-shapes',
    fields: [
      { key: 'base', label: 'Base', placeholder: 'Enter base' },
      { key: 'height', label: 'Height', placeholder: 'Enter height' },
      { key: 'side', label: 'Slanted Side', placeholder: 'Enter side length' }
    ]
  }
};
