import React, { useEffect, useState } from 'react';
import employeeService from '../services/employeeService';
import authService from '../services/authService';
import './Home.css';
import { Employee } from '../models/Employee';

const Home: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>({
    employeeId: 0,
    firstName: '',
    lastName: '',
    departmentId: null,
    roleId: null,
    email: '',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []); // Fetch data on component mount

  const fetchData = async () => {
    try {
      console.log("fetchdata");
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (error) {
      setErrorMessage('Failed to fetch employees');
    }
  };

  const handleDelete = async (employeeId: number) => {
    try {
      await employeeService.deleteEmployee(employeeId);
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.employeeId !== employeeId));
    } catch (error) {
      setErrorMessage('Failed to delete employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
    } else {
      // Reset form for adding a new employee
      setCurrentEmployee({
        employeeId: 0,
        firstName: '',
        lastName: '',
        departmentId: null,
        roleId: null,
        email: '',
        phone: '',
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEmployee) {
      try {
        if (currentEmployee.employeeId) {
          await employeeService.updateEmployee(currentEmployee.employeeId, currentEmployee);
        } else {
          await employeeService.insertEmployee(currentEmployee);
        }
        await fetchData(); // Refresh employee list
        handleEdit({ employeeId: 0, firstName: '', lastName: '', departmentId: null, roleId: null, email: '', phone: '' }); // Reset form after submission
      } catch (error) {
        setErrorMessage('Failed to save employee');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEmployee({ ...currentEmployee, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/login'; // Redirect to login page after logout
    } catch (error) {
      setErrorMessage('Failed to logout');
    }
  };

  return (
    <div className="home-container">
      <h2>{process.env.REACT_APP_TITLE}</h2>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleFormSubmit} className="employee-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={currentEmployee?.firstName || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={currentEmployee?.lastName || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="departmentId"
          placeholder="Department ID"
          value={currentEmployee?.departmentId || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="roleId"
          placeholder="Role ID"
          value={currentEmployee?.roleId || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={currentEmployee?.email || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={currentEmployee?.phone || ''}
          onChange={handleInputChange}
          className="form-input"
        />
        <button type="submit" className="form-button">
          {currentEmployee?.employeeId ? 'Update' : 'Add'}
        </button>
      </form>
      <table className="employee-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department ID</th>
            <th>Role ID</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map(employee => (
            <tr key={employee.employeeId}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.departmentId}</td>
              <td>{employee.roleId}</td>
              <td>{employee.phone}</td>
              <td>
                <button onClick={() => handleEdit(employee)} className="action-button">Edit</button>
                <button onClick={() => handleDelete(employee.employeeId!)} className="action-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
