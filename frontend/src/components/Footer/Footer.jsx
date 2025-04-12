import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5" id="footer">
      <div className="container">
        <div className="row justify-content-between align-items-start">
          {/* Company Info Section */}
          <div className="col-lg-5 col-md-6 mb-4">
            <h5 className="footer-logo mb-4 text-light" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              Fast Foods
            </h5>
            <p className="text-light" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
              Experience the best of gourmet meals, delivered fresh to your door. At Armk Foods, we blend quality ingredients with a passion for delicious food, ensuring a delightful experience with every meal.
            </p>
            <div className="d-flex mt-3">
              <a href="#!" className="me-3" aria-label="Facebook" style={{ transition: 'transform 0.3s' }}>
                <img
                  src={assets.facebook_icon}
                  alt="Facebook"
                  className="img-fluid"
                  style={{ width: '35px', filter: 'invert(1)', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </a>
              <a href="#!" className="me-3" aria-label="Twitter" style={{ transition: 'transform 0.3s' }}>
                <img
                  src={assets.twitter_icon}
                  alt="Twitter"
                  className="img-fluid"
                  style={{ width: '35px', filter: 'invert(1)', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </a>
              <a href="#!" aria-label="LinkedIn" style={{ transition: 'transform 0.3s' }}>
                <img
                  src={assets.linkedin_icon}
                  alt="LinkedIn"
                  className="img-fluid"
                  style={{ width: '35px', filter: 'invert(1)', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-lg-5 col-md-6 mb-4">
            <h5 className="text-uppercase mb-4 text-light" style={{ letterSpacing: '2px', fontWeight: 'bold' }}>
              Get in Touch
            </h5>
            <ul className="list-unstyled text-light" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
              <li className="mb-2">
                <i className="fas fa-phone-alt me-2 text-light"></i>
                <span className="text-light">+91 - 2233244555</span>
              </li>
              <li>
                <i className="fas fa-envelope me-2 text-light"></i>
                <span className="text-light">fastfoods@gmail.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <a href="#top" className="btn btn-light btn-sm" style={{ borderRadius: '20px', fontWeight: 'bold' }}>
                Back to Top
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr className="bg-light" />

      <div className="text-center">
        <p className="mb-0 text-light" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
          &copy; 2024 ff.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
