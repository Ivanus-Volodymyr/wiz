import React, { useState } from 'react';
import Icon, { IconName, iconNames } from '../../components/common/Icon';

const IconsArticle = () => {
  const [currentIcon, setCurrentIcon] = useState<IconName>('undo');

  return (
    <>
      {iconNames.map((iconName) => (
        <Icon
          key={iconName}
          name={iconName}
          className={`inline-block text-main-primary cursor-pointer m-2 ${
            currentIcon === iconName ? 'bg-accent-yellow' : ''
          }`}
          onClick={() => setCurrentIcon(iconName)}
        />
      ))}

      <div className="mt-4">{`<Icon name="${currentIcon}" size={16} className="text-main-primary" />`}</div>
    </>
  );
};

export default IconsArticle;
