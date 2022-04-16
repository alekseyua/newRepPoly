import React from 'react';
import { GxIcon } from '@garpix/garpix-web-components-react';
import { arrowTop } from '../../images';
import { Link } from 'react-router-dom';

const ButtonScroll = ({}) => {
  const goTop = (e) =>{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  return (
    <div className="topbtn__wrap">
      <Link to="#" onClick={goTop} className="topbtn__button">
        <GxIcon src={arrowTop} className={'scroll-icon'} />
      </Link>
    </div>
  );
};
export default React.memo(ButtonScroll);
