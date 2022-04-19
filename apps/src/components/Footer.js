import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";

function Footer() {
  return (
    <div className="footer">
      <footer className="w-100 py-4 flex-shrink-0 bg-warning">
        <div className="container py-4">
          <div className="row gy-4 gx-5">
            <div className="col-lg-6 col-md-6">
              <h5 className="h1 text-dark">DEC-COV APPS</h5>
              <p className="small text-muted">
                Tugas Akhir S1 Teknik Komputer Telkom University, IMPLEMENTATION
                OF BLOCKCHAIN AND SMART CONTRACT AS COVID-19 TEST AND VACCINE
                CERTIFICATE STORAGE SYSTEM
              </p>
              <p className="small text-muted mb-0">
                &copy; Copyrights All Rights Reserved 2022 by dendiaryar.
              </p>
            </div>
            <div className="col-lg-6 col-md-6">
              <h5 className="h1 text-dark">Quick links</h5>
              <ul className="list-unstyled text-muted">
                <li className="small text-muted">
                  <a href="https://github.com/dendiaryar" className="link-dark">
                    Github
                  </a>
                </li>
                <li className="small text-muted">
                  <a
                    href="https://linkedin.com/in/dendiaryar"
                    className="link-dark"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
