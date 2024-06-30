import  {Employee}  from '../models/Employee';
import authService from './authService';

//const API_URL = 'https://your-api-url/api/employees'; // Replace with your API URL
const API_URL = process.env.REACT_APP_API_URL+"/employees"; // Replace with your API URL

const getEmployees = async (): Promise<Employee[]> => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return await response.json();
};

const insertEmployee = async (employee: Employee): Promise<Employee> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error('Failed to insert employee');
  }
  return await response.json();
};

const updateEmployee = async (employeeId: number, employee: Employee): Promise<Employee> => {
  const response = await fetch(`${API_URL}/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authService.getToken()}`
    },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    throw new Error('Failed to update employee');
  }
  return await response.json();
};

const deleteEmployee = async (employeeId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${employeeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authService.getToken()}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
  return await response.json();
};

export default {
  getEmployees,
  insertEmployee,
  updateEmployee,
  deleteEmployee,
};
