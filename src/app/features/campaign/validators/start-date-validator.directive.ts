import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export const startDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const startDate = control.get('startDate');
  const endDate = control.get('endDate');

  let invalid: boolean = false;
  if (moment(startDate?.value).isAfter(moment(endDate?.value))){
    invalid = true;
  }

  return startDate && endDate && invalid ? { startLargerThanEnd: true } : null;
};
