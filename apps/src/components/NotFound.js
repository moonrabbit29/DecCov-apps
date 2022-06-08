import React, { Component } from "react";
import MetaTags from 'react-meta-tags';

// UI
import 'bootstrap/dist/css/bootstrap.min.css';

class NotFound extends Component {
    render () {
      return (
        <section id="Destruct" className="p-5">
          <MetaTags>
            <title>Not Found</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta id="meta-description" name="description" content="Ethereum x IPFS DApp." />
            <meta id="og-title" property="og:title" content="DecCov-App" />
          </MetaTags>
  
          <div className="container">
            <div className="justify-content-between">
              <div>
                <img src="/dissapointed.png" className="mx-auto d-block" alt="" width="20%" height="20%" />
              </div>
  
              <div className="px-3 d-flex align-items-center justify-content-center">
                <div>
                    <h1 className="text-center">404 - Not Found</h1><br />
                </div>
                
              </div>
              
            </div>
          </div>
          
        </section>
      );
    }
  }

export default NotFound;