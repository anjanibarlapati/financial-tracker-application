import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../components/Login';
import { Register } from '../components/Register';
import { Homepage } from '../components/Homepage';
import App from '../App';

describe('Main Application Routes', () => {

    it('renders App component at root route', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<Homepage />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId("register")).toBeInTheDocument();
    });

    it('renders Register component on /register route', () => {
        render(
            <MemoryRouter initialEntries={['/register']}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<Homepage />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId("register")).toBeInTheDocument();
    });

    it('renders Login component on /login route', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<Homepage />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId("login")).toBeInTheDocument();
    });

    it('renders Homepage component on /homepage route', () => {
        render(
            <MemoryRouter initialEntries={['/homepage']}>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<Homepage />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId("homepage")).toBeInTheDocument(); 
    });
});

