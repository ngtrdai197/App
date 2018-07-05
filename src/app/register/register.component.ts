import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RegisterService } from './register.service';
import { element } from 'protractor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from '../provider/toastr.service';
import { UserFireBaseService } from '../provider/usersfirebase.service';
import { User } from '../interface/user';
import { AutheService } from '../provider/authe.service';
import { Router } from '@angular/router';
import { ThongTinUserService } from '../provider/thongtinuser.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  users: User[];
  usersDelete: User[];
  user: '';
  email: '';
  pass: '';
  passConfirm: '';
  public formErrors = {
    email: '',
    userName: '',
    passWord: '',
    passWordConfirm: '',
    checkbox: false,
  };
  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private toastrService: ToastrService,
    private userFBService: UserFireBaseService,
    private autheService: AutheService,
    private router: Router,
    private thongTinUser: ThongTinUserService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loadUser();
  }

  loadUser() {
    this.userFBService.getUsers().subscribe(userFB => {
      this.users = userFB;
    });

  }

  creatAccount() {
    let checkUser = true;
    this.users.forEach(user => {
      if (user.userName === this.user) {
        checkUser = false;
      }
    });
    if (checkUser = false) {
      this.toastrService.Error('Tài khoản bạn nhập bị trùng. Thử tài khoản khác.');
    } else {
      const user: User = {
        userName: this.user,
        email: this.email,
        passWords: this.pass,
      };
      this.userFBService.addUser(user);
      this.toastrService.Success('Đăng kí thành công !');
      this.router.navigate(['/login']);
      this.user = '';
      this.pass = '';
      this.email = '';
      this.passConfirm = '';
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
      ]],
      checkbox: [false, [
        Validators.requiredTrue,
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

}
