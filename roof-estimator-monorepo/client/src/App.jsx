import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Estimator from './pages/Estimator';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import './styles.css';
export default function App(){return <BrowserRouter><Routes><Route path="/" element={<Estimator/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<Admin/>}/></Routes></BrowserRouter>}
