import React from 'react';

const Setting = ({ title, desc, asLabel, children }) => {
  const Tag = asLabel ? 'label' : 'div';
  return <Tag className="setting">
      <div className="u-mr">
          <div className="text-subtitle">{title}</div>
          {desc && <div className="text-caption">{desc}</div>}
      </div>
      {children}
  </Tag>;
}

export default Setting;
