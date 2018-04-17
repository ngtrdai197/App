import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from './register.service';
import { element } from 'protractor';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  checked: any = false;
  public registerForm: FormGroup;
  public isSubmitting = false;
  public formErrors = {
    email: '',
    userName: '',
    passWord: '',
    passWordConfirm: '',
  };
  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.checked);
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      userName: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(24),
      ]],
      passWord: ['', [
        Validators.required, Validators.minLength(8), Validators.maxLength(16),
      ]],
      passWordConfirm: ['', [
        Validators.required, Validators.minLength(8), Validators.maxLength(16), this.matchPassWord,
      ]]
    });
    this.registerForm.valueChanges.subscribe(() => {
      this.formValidate();
    });
  }

  private formValidate() {
    Object.keys(this.formErrors).map(field => {
      const formControl = this.registerForm.get(field);
      if (formControl && formControl.dirty && formControl.invalid) {
        this.formErrors[field] = 'Thông tin nhập vào không hợp lệ';
      } else {
        this.formErrors[field] = '';
      }
    });
  }

  matchPassWord(c: AbstractControl): any {
    if (!c.parent || !c) { return; }
    const pwd = c.parent.get('passWord');
    const cpwd = c.parent.get('passWordConfirm');
    if (!pwd || !cpwd) { return; }
    if (pwd.value !== cpwd.value) {
      return { invalid: true };
    }
  }

  checkedBox() {
    if (this.checked === false) {
      this.checked = true;
    } else if (this.checked === true) {
      this.checked = false;
    }
  }

}
