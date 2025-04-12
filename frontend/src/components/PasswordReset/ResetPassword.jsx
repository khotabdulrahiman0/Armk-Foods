import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Include the new CSS file

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/reset-password', { token, newPassword });
            if (response.data.success) {
                toast.success('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/'); // Adjust this route to your actual login popup route
                }, 1500); // Redirect after 1.5 seconds
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error resetting password. Please try again.');
        }
    };

    return (
        <div className="reset-password-container">
            <h2 className="text-center mb-4">Reset Password</h2>
            <div className="reset-password-card">
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your reset token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Reset Password
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="small text-muted">
                        Remembered your password? <a href="/login" className="text-primary">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
