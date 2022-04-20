import React from 'react';
import TradingPlatformLayout from '../../Views/TradingPlatformLayout';

const TradingPlatform = ({ first_screen = {}, page_type_catalog, front_admin }) => {
  return <TradingPlatformLayout 
          first_screen={first_screen} 
          page_type_catalog={page_type_catalog}
          front_admin={front_admin} 
        />;
};

export default React.memo(TradingPlatform);
