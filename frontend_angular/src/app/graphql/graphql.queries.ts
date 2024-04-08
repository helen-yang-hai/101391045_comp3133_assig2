import {gql} from 'apollo-angular'

const SIGNUP = gql `
    mutation signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
            _id
            username
            email
            password
        }
    }
`

const LOGIN = gql `
    query Login($username: String!, $password: String!) {
        login(username: $username, password: $password){
            _id
            email
            username
            password
        }
    }
`

const GET_ALL_EMPLOYEES = gql `
    query GetAllEmployees {
        getAllEmployees {
            _id
            email
            first_name
            gender
            last_name
            salary
        }
    }
`

const ADD_NEW_EMPLOYEE = gql `
    mutation AddNewEmployee($first_name: String!, $last_name: String!, $email: String!, $gender: String!, $salary: Float!) {
        addNewEmployee(first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, salary: $salary) {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`

const GET_EMPLOYEE_BY_ID = gql `
    query GetEmployeeById($id: ID!) {
        getEmployeeById(_id: $id) {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`

const UPDATE_EMPLOYEE_BY_ID = gql `
    mutation UpdateEmployeeById($id: ID!, $first_name: String!, $last_name: String!, $email: String!, $gender: String!, $salary: Float!) {
        updateEmployeeById(_id: $id, first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, salary: $salary) {
            _id
            first_name
            last_name
            email
            gender
            salary
        }
    }
`

const DELETE_EMPLOYEE_BY_ID = gql `
    mutation DeleteEmployeeById($id: ID!) {
        deleteEmployeeById(_id: $id) {
            _id
            email
            first_name
            gender
            last_name
            salary
        }
    }
`

const GET_USER_BY_USERNAME = gql`
    query GetUserByUsername($username: String!) {
        getUserByUsername(username: $username)
    }
`

export{ SIGNUP, LOGIN, GET_ALL_EMPLOYEES, ADD_NEW_EMPLOYEE, GET_EMPLOYEE_BY_ID, UPDATE_EMPLOYEE_BY_ID, DELETE_EMPLOYEE_BY_ID, GET_USER_BY_USERNAME }