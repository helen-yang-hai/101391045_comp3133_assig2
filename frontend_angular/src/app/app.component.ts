import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormsModule, FormBuilder} from '@angular/forms';
import { Apollo } from 'apollo-angular'
import { SIGNUP, LOGIN, GET_ALL_EMPLOYEES, ADD_NEW_EMPLOYEE, GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE_BY_ID, DELETE_EMPLOYEE_BY_ID, GET_USER_BY_USERNAME } from './graphql/graphql.queries'
import {NgFor, NgIf} from '@angular/common'
import { Employee } from '../app/models/employee'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, RouterOutlet, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Employee Management App';

  employees: any[] = []
  employee: any
  error: any
  selectedEmployee?: Employee
  username: any
  password: any
  email: any
  userExist?: Boolean

  employeeForm = this.formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    salary: ['', [Validators.min(0.01), Validators.required]]
  })

  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    console.log("---- GQL Component() ----")
  }

  isEmployeesRoute(): boolean {
    return this.router.url === '/employees'
  }

  isViewEmployeeRoute(): boolean {
    const employeeId = this.route.snapshot.paramMap.get('_id');
    return this.router.url.startsWith('/view-employee/');
  }

  isUpdateEmployeeRoute(): boolean {
    const employeeId = this.route.snapshot.paramMap.get('_id');
    return this.router.url.startsWith('/update-employee/');
  }

  isAddEmployeeRoute(): boolean {
    return this.router.url === '/add-employee'
  }

  isLoginRoute(): boolean {
    return this.router.url === '/'
  }

  isSignupRoute(): boolean {
    return this.router.url === '/signup'
  }

  ngOnInit(): void {
    console.log("---- ngOnInit() -----")
    this.getAllEmployees()
  }

  getEmployeeById(id: string) {
    console.log("get employee by id : " + id)
    this.apollo.query({
      query: GET_EMPLOYEE_BY_ID,
      variables: {
        id: id
      }
    }).subscribe(({data, error}: any) => {
      this.employeeForm.setValue({
        first_name: data.getEmployeeById.first_name,
        last_name: data.getEmployeeById.last_name,
        email: data.getEmployeeById.email,
        gender: data.getEmployeeById.gender,
        salary: data.getEmployeeById.salary
      })
      this.error = error
    })
  }

  getAllEmployees() {
    console.log("getAllEmployees")
    this.apollo.watchQuery({
      query: GET_ALL_EMPLOYEES
    }).valueChanges.subscribe(({data, error}: any) => {
      if (data) {
        this.employees = data.getAllEmployees
      }
      this.error = error
      console.log("employee list: ", this.employees)
    })
  }

  addNewEmployee(){
    console.log("add new employee")
    this.apollo.mutate({
      mutation: ADD_NEW_EMPLOYEE,
      variables: {
        first_name: this.employeeForm.value.first_name, 
        last_name: this.employeeForm.value.last_name, 
        email: this.employeeForm.value.email, 
        gender: this.employeeForm.value.gender, 
        salary: this.employeeForm.value.salary
      },
      refetchQueries: [{
        query: GET_ALL_EMPLOYEES
      }]
    }).subscribe(({data}: any) => {
      console.log("mutation res: ", data)
      this.employeeForm.reset()
      this.router.navigate(['/employees'])
    }, (error) => {
      console.log("Error adding employee: ", error.message)
      this.error = error
    })
  }

  updateEmployeeById(id: string){
    console.log("update employee by id: " + id)
    console.log("First Name:", this.employeeForm.value.first_name);
    console.log("Last Name:", this.employeeForm.value.last_name);
    console.log("Email:", this.employeeForm.value.email);
    console.log("Gender:", this.employeeForm.value.gender);
    console.log("Salary:", this.employeeForm.value.salary);
    this.apollo.mutate({
      mutation: UPDATE_EMPLOYEE_BY_ID,
      variables: {
        id: id,
        first_name: this.employeeForm.value.first_name, 
        last_name: this.employeeForm.value.last_name, 
        email: this.employeeForm.value.email, 
        gender: this.employeeForm.value.gender, 
        salary: this.employeeForm.value.salary
      },
      refetchQueries: [{
        query: GET_ALL_EMPLOYEES
      }]
    }).subscribe(({data}: any) => {
      console.log("update res: ", data)
      //this.employees = data.employees
      this.employeeForm.reset()
      this.router.navigate(['/employees']);
    }, (error) => {
      this.error = error
    })
  }

  deleteEmployeeById(id: string){
    console.log("delete employee by id: " + id)
    this.apollo.mutate({
      mutation: DELETE_EMPLOYEE_BY_ID,
      variables:{
        id: id
      },
      refetchQueries: [{
        query: GET_ALL_EMPLOYEES
      }]
    }).subscribe(({data}: any) => {
      this.employees = data.deleteEmployeeById
    }, (error) => {
      this.error = error
    })
  }

  login(username: string, password: string){
    console.log("login")
    this.dataSave(username)
    this.apollo.query({
      query: LOGIN,
      variables:{
        username: username,
        password: password
      }
    }).subscribe(({data}: any) => {
      this.userForm.reset()
      this.router.navigate(['/employees']);
    }, (error) => {
      this.error = error
    })
  }

  signup(username: string, email: string, password: string) {
    console.log('signup')
    this.apollo.mutate({
      mutation: SIGNUP,
      variables:{
        username: username,
        email: email,
        password: password
      }
    }).subscribe(({data}: any) => {
      this.router.navigate(['/']);
    }, (error) => {
      this.error = error
    })
  }

  isUserExist(username: string, callback: ()=>void) {
    console.log('username: ', username)
    this.apollo.query({
      query: GET_USER_BY_USERNAME,
      variables: {
        username: this.getData()
      }
    }).subscribe(({data}: any) => {
      console.log("result: ", data.getUserByUsername)
      if (data.getUserByUsername) {
        this.userExist = true
        console.log("running here: ", this.userExist)
      }else{
        this.userExist = false
      }
      callback()
    }, (error) =>{
      this.error = error
    })
  }

  //select button on employee list page
  onSelectView(employee: Employee): void {
    this.selectedEmployee = employee
    console.log("selected employee: ", employee._id)
    this.router.navigate(['/view-employee/', this.selectedEmployee._id])
  }

  //update button on employee list page
  onSelectUpdate(employee: Employee): void {
    this.selectedEmployee = employee
    console.log("selected employee: ", employee._id)
    this.router.navigate(['/update-employee/', this.selectedEmployee._id])
  }

  //delete button on employee list page
  onSelectDelete(employee: Employee): void {
    this.selectedEmployee = employee
    console.log("selected employee: ", employee._id)
    this.deleteEmployeeById(employee._id)
  }

  dataSave(username: string){
    sessionStorage.setItem('username', username)
  }

  getData(){
    return sessionStorage.getItem('username')
  }

  logout(){
    sessionStorage.removeItem("username")
    this.router.navigate(['/'])
  }
}
