import { FormGroup } from '@angular/forms';

export type ErrorTextFunction = (reference: string) => string;

export function errorText(formGroup: FormGroup) {
  return (reference: string) => {
    if (formGroup?.get(reference)?.hasError('required')) {
      return 'Campo requerido';
    }

    if (formGroup?.get(reference)?.hasError('min')) {
        return 'El número debe ser mayor a cero';
    }

    return 'Error';
  };
}
