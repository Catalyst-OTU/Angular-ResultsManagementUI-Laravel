import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
  ValidatorFn,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/**
 * Custom validator functions for reactive form validation
 */
export class CustomValidators {
  /**
   * Validates that child controls in the form group are equal
   */
  static childrenEqual: ValidatorFn = (formGroup: FormGroup) => {
    const [firstControlName, ...otherControlNames] = Object.keys(
      formGroup.controls || {}
    );
    const isValid = otherControlNames.every(
      (controlName) =>
        formGroup.get(controlName).value ===
        formGroup.get(firstControlName).value
    );
    return isValid ? null : { childrenNotEqual: true };
  };
}

/**
 * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
 */
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control.parent.invalid && control.touched;
  }
}

/**
 * Collection of reusable RegExps
 */
export const regExps: { [key: string]: RegExp } = {
  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
};

/**
 * Collection of reusable error messages
 */
export const errorMessages: { [key: string]: string } = {
  fullName: 'Full name must be between 1 and 128 characters',
  email: 'Email must be a valid email address (username@domain)',
  gender: 'Please select a gender',
  student_id: 'Enter valid student id',
  staff_id: 'Enter valid staff id',
  contact: 'Contact must be 10 digits',
  date_of_birth: 'Choose valid date',
  confirmEmail: 'Email addresses must match',
  password:
    'Password must be between 7 and 15 characters, and contain at least one number and special character',
  confirmPassword: 'Passwords must match',
  course_select: 'Select a course',
  module_name: 'Select course module',
  usertype: 'Select a usertype',
  start_date: 'Enter start date',
  end_date: 'Enter end date',
  course_code: 'Enter course code',
  course_level: 'Enter course level',
  issue_date: 'Select issue date',
  course_name: 'Enter course name',
  instructor: 'Select course instructor',
  module_insert: 'Enter module name',
  grade: 'Enter a valid grade',
  fees: 'Select fee payment status',
  coordinator: 'Select course coordinator',
  course_batch: 'Select course batch',
};
