import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPopup.css'; // Ensure you have this for custom styles
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        otp: ""
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [transition, setTransition] = useState(false);
    const [otpSent, setOtpSent] = useState(false); // New state to track OTP sent
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Disable scrolling
        document.body.classList.add('no-scroll');

        // Trigger the background color change when the component mounts
        setTransition(true);

        // Cleanup function to remove class on unmount
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (e) => {
        e.preventDefault();
        const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";

        if (currState === "Sign Up" && !termsAccepted) {
            toast.error("You must agree to the terms and privacy policy.");
            return;
        }

        try {
            if (currState === "Sign Up") {
                const response = await axios.post(`${url}${endpoint}`, {
                    name: data.name,
                    email: data.email,
                    password: data.password
                });
                console.log(response.data);
                if (response.data.success) {
                    toast.success("OTP sent to your email for verification");
                    setOtpSent(true);
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await axios.post(`${url}${endpoint}`, {
                    email: data.email,
                    password: data.password
                });
                console.log(response.data);
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    loadCartData(response.data.token);
                    setShowLogin(false);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/user/verify-otp`, {
                email: data.email,
                otp: data.otp
            });
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                loadCartData(response.data.token);
                setShowLogin(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred during OTP verification. Please try again.");
        }
    };

    return (
        <div className="login-popup-overlay">
            <div className={`login-popup container p-4 rounded shadow-lg ${transition ? 'bg-transition' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">{currState}</h2>
                    <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
                </div>
                <form onSubmit={otpSent ? verifyOtp : onLogin}>
                    {currState === "Sign Up" && 
                        <div className="mb-3">
                            <input
                                name="name"
                                onChange={onChangeHandler}
                                value={data.name}
                                type="text"
                                className="form-control"
                                placeholder="Your name"
                                required
                            />
                        </div>
                    }
                    <div className="mb-3">
                        <input
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            className="form-control"
                            placeholder="Your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                        />
                    </div>
                    {otpSent && (
                        <div className="mb-3">
                            <input
                                name="otp"
                                onChange={onChangeHandler}
                                value={data.otp}
                                type="text"
                                className="form-control"
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        {otpSent ? "Verify OTP" : (currState === "Login" ? "Login" : "Create account")}
                    </button>
                    
                    {currState === "Sign Up" && 
                        <div className="form-check mb-3">
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                                id="terms" 
                                checked={termsAccepted}
                                onChange={() => setTermsAccepted(!termsAccepted)}
                                required
                            />
                            <label className="form-check-label ms-2" htmlFor="terms">
                                By continuing, I agree to the <a href="/terms" className="text-primary">terms of use</a> & <a href="/privacy" className="text-primary">privacy policy</a>.
                            </label>
                        </div>
                    }
                    
                    <div className="text-center">
                        {currState === "Login"
                            ? <p className="mb-0">Don't have an account? <a href="#" onClick={() => setCurrState('Sign Up')} className="text-primary">Sign up here</a></p>
                            : <p className="mb-0">Already have an account? <a href="#" onClick={() => setCurrState('Login')} className="text-primary">Login here</a></p>
                        }
                        {currState === "Login" && (
                            <p className="mb-0">
                                Forgot your password? 
                                <Link to="/password-reset-request" className="text-primary" onClick={() => setShowLogin(false)}>Reset it here</Link>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPopup;
