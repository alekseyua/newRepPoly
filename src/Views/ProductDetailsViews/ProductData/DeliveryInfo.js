import React from 'react';
import { GxIcon } from '@garpix/garpix-web-components-react';
import { deliveryIcon } from '../../../images';
import Text from '../../../components/Text';
import style from '../styles/index.module.scss';
import { ROLE } from '../../../const';
import { Link } from 'react-router-dom';

const DeliveryInfo = ({ description = '', role }) => {
  
  return (
    <div className={style['prodpage__delivery-info']}> 
      <Link className={style['prodpage__delivery-info-title']}
        to={'/information/delivery'}
      >
        <GxIcon src={deliveryIcon} className={style['prodpage__delivery-info-icon']}></GxIcon>
        <span>
          {role === ROLE.RETAIL ? <Text text="options.free.delivery" /> : <Text text="deliveryOptions" />}
        </span>
      </Link>
      <div className={style['prodpage__delivery-info-description']}>
        <div dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>
    </div>
  );
};

export default React.memo(DeliveryInfo);
