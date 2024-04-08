import { Routes } from '@angular/router';
import { app } from '../../server';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path: 'employees', component: AppComponent}, //view employee list
    {path: 'add-employee', component: AppComponent}, //add new employee
    {path: 'view-employee/:_id', component: AppComponent}, //view selected employee detail
    {path: 'update-employee/:_id', component: AppComponent}, //update selected employee detail
    {path: 'login', component: AppComponent}, //login
    {path: 'signup', component: AppComponent} //signup
];
