import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userList: UserModel[] = [];
  editMode: boolean = false;
  userForm!: FormGroup;
  cityList: string[] = ['Pune', 'Mumbai', 'Surat', 'Nashik', 'Satara'];
  departmentList: string[] = ['IT', 'HR', 'Accounts', 'Sales', 'Management'];

  constructor(
    private _userService: UserService,
    private _toastrService: ToastrService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getUserList();
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.fb.group({
      department: ['', Validators.required],
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^0?[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      doj: ['', Validators.required],
      city: ['', Validators.required],
      status: [false],
    });
  }

  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const user = this.userForm.value;
    if (this.editMode) {
      this._userService.updateUser(user).subscribe((res) => {
        this.getUserList();
        this.editMode = false;
        this.userForm.reset();
        this._toastrService.success('User Updated Successfully', 'Success');
      });
    } else {
      this._userService.addUser(user).subscribe((res) => {
        this.getUserList();
        this.userForm.reset();
        this._toastrService.success('User Added Successfully', 'Success');
      });
    }
  }

  onEdit(userdata: UserModel) {
    this.userForm.patchValue(userdata);
    this.editMode = true;
  }

  onDelete(id: any) {
    const isConfirm = confirm('Are you sure want to delete this user?');
    if (isConfirm) {
      this._userService.deleteUser(id).subscribe((res) => {
        this._toastrService.error('User deleted successfully', 'Deleted');
        this.getUserList();
      });
    }
  }

  onResetForm() {
    this.userForm.reset();
    this.editMode = false;
    this.getUserList();
  }
}
