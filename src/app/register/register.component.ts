import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from './register.service';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from '../provider/toastr.service';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { User } from '../interface/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  checked: any = false;
  public registerForm: FormGroup;
  public isSubmitting = false;
  user: '';
  email: '';
  pass: '';
  passConfirm: '';
  public formErrors = {
    email: '',
    userName: '',
    passWord: '',
    passWordConfirm: '',
  };
  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private toastrService: ToastrService,
    private userFBService: UserFireBaseService
  ) { }

  ngOnInit() {
    this.buildForm();
    console.log(this.checked);
  }

  creatAccount() {
    if (this.registerForm.get('userName').invalid && this.registerForm.get('userName').touched) {
      this.toastrService.Error('User name nhập vào có độ dài từ 8 - 24 kí tự');
    } else if (this.registerForm.get('email').invalid && this.registerForm.get('email').touched) {
      this.toastrService.Error('Email nhập vào không hợp lệ. Và cần phải có kí tự @');
    } else if (this.registerForm.get('passWord').invalid && this.registerForm.get('passWord').touched) {
      this.toastrService.Error('Mật khẩu nhập vào có độ dài từ 8 - 16 kí tự');
    } else if (this.registerForm.get('passWordConfirm').invalid && this.registerForm.get('passWordConfirm').touched) {
      this.toastrService.Error('Mật khẩu nhập lại không trùng khớp với mật khẩu cũ');
    } else {
      if (this.checked === false) {
        this.toastrService.Error('Check vào đồng ý với điều khoản của chúng tôi !');
      } else {
        const user: User = {
          userName: this.user,
          email: this.email,
          passWord: this.pass,
        };
        this.userFBService.addUser(user);
        this.toastrService.Success('Đăng kí thành công !');
        this.user = '';
        this.pass = '';
        this.email = '';
        this.passConfirm = '';
      }
    }
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
