import React from 'react';
import './Header.css';
import KubernetesLogo from '../assets/kubernetes-logo.svg';
import DevOpsLogo from '../assets/devops-logo.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <img src={DevOpsLogo} alt="DevOps" className="devops-logo" />
          <h1 className="title">Mamunur Rashid DevOps Skills Radar aws</h1>
          <img src={KubernetesLogo} alt="Kubernetes" className="k8s-logo" />
        </div>
        <p className="subtitle">Technology Assessment & Adoption Framework</p>
      </div>
    </header>
  );
};

export default Header;

