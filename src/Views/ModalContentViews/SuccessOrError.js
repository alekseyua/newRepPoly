import React from 'react';
import style from './styles/index.module.scss';
import { errorAlertIcon, successAlertIcon } from '../../images';
import { GxIcon, GxButton } from '@garpix/garpix-web-components-react';
import {useHistory} from 'react-router-dom';
const SuccessOrError = ({ success, closeModal, content = null, funcGoTo = null}) => {
const history = useHistory()
  if (content === null) {
    !!success ? (content = 'Ваш отзыв принят на модерацию') : (content = 'Ваш отзыв не отправлен');
  }
  const handerGoto = () =>{
    if (funcGoTo !== null) {
        closeModal()
      return history.push(funcGoTo)
    }
    closeModal()
  }

  return ( 
    <div className={style['wrapper-info']}>
      <div className={style['wrapper-info__messenge']}>
        <GxIcon className={style['wrapper-info__messenge--icon']} src={!!success ? successAlertIcon : errorAlertIcon} />
        <span>{content}</span>
      </div>
      <GxButton onClick={handerGoto} className={style['productreviews__form-submit-btnlage']} data-cy={`close_modal_review`}>
        хорошо
      </GxButton>
    </div>
  );
};

export default React.memo(SuccessOrError);
