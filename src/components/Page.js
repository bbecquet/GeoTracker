import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import "./Page.css";

const TopBarAction = ({ action: { icon, text, navTo, onClick } }) => {
  if (navTo) {
    return (
      <Link to={navTo}>
        <img src={icon} alt="" />
        {text}
      </Link>
    );
  }
  return (
    <button onClick={onClick}>
      <img src={icon} alt="" />
      {text}
    </button>
  );
};

TopBarAction.propTypes = {
  action: PropTypes.object.isRequired,
};

const Page = ({ title, backPath, actions = [], children }) => (
  <div>
    <header className="pageHeader">
      <div className="pageHeader-left">
        {backPath ? <Link to={backPath}>❮</Link> : <img src={logo} alt="" />}
      </div>
      <h1>{title}</h1>
      <div className="pageHeader-right">
        {actions.map((action, i) => (
          <TopBarAction action={action} key={i} />
        ))}
      </div>
    </header>
    <main>{children}</main>
  </div>
);

Page.propTypes = {
  title: PropTypes.string.isRequired,
  backPath: PropTypes.string,
  actions: PropTypes.array,
  children: PropTypes.node.isRequired,
};

export default Page;
