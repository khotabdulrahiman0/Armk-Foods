import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './PasswordResetRequest.css'; // Ensure to include the new CSS file

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:4000/api/user/password-reset-request', { email });
            if (response.data.success) {
                toast.success('Password reset email sent! Check your inbox.');
                setTimeout(() => navigate('/reset-password'), 3000); // Redirect after a short delay
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error sending password reset email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-reset-request-container">
            <h2 className="text-center mb-4">Request Password Reset</h2>
            <div className="password-reset-card">
                <form onSubmit={handleSubmit} className="password-reset-form">
                    <div className="mb-4">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Send Reset Email'
                        )}
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

export default PasswordResetRequest;
