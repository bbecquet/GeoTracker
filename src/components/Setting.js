import React from 'react';
import classnames from 'classnames';

const Setting = ({ title, desc, asLabel, children, className }) => {
  const Tag = asLabel ? 'label' : 'div';
  return <Tag className={classnames('setting', className)}>
      <div className="u-mr">
          <div className="text-subtitle">{title}</div>
          {desc && <div className="text-caption">{desc}</div>}
      </div>
      {children}
  </Tag>;
}

export default Setting;
