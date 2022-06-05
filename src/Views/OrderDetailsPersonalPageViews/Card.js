import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  productCard1,
  change,
  bayicon,
  shoppingBag,
  errorCanceled,
  paperclip,
  send,
} from '../../images';
import { GxButton, GxForm, GxIcon, GxInput } from '@garpix/garpix-web-components-react';
import Text from '../../components/Text';
import style from './styles/index.module.scss';
import { useStoreon } from 'storeon/react';
import ImageUpload from '../../components/ImageUpload';
import api from '../../api';
import ModalContentViews from '../../Views/ModalContentViews';
import { Formik } from 'formik';
import OrderDetailsPersonalPageViews from '../OrderDetailsPersonalPageViews/';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { getCookie } from '../../utils';

const Card = ({
  title,
  size,
  color,
  change_agreement,
  order,
  prices,
  image,
  brand,
  status,
  deleteElementOrder,
  id,
  setModalStates,
  url,
}) => {
  const orderApi = api.orderApi;
  const fileInputRef = React.useRef(null);
  const { currenssies } = useStoreon('currenssies');
  const { chatOrdersMessage } = useStoreon('chatOrdersMessage');
  const [correspondenceState, setcorrespondenceState] = useState([]);
  const [amountFile, setAmountFile] = useState(null);
  const [upDownBtn, setUpDownBtn] = useState(true);
  const [valuesState, setvaluesState] = useState({
    text_field: '',
    file_list: [],
  });
  const ws = useRef(null);
  const [isState, setIsState] = useState(false);
  const [data, setData] = useState([]);
  const [arrIsnew, setArrIsnew] = useState([]);
  


  const getIconFromStatus = (id) => {
    const statusIcons = {
      collection: shoppingBag,
      redeemed: bayicon,
      replacement: change,
      canceled: errorCanceled,
      default: '#',
    };

    if (statusIcons.hasOwnProperty(id)) {
      return statusIcons[id];
    } else {
      return statusIcons.default;
    }
  };


  useEffect(()=>{
    const dataChatItem = chatOrdersMessage.filter(item=> item.item_id === id)
    if(dataChatItem[0] !== undefined){
      setcorrespondenceState(dataChatItem[0].chat_order_items)
    }

  },[chatOrdersMessage])

  const closeModal = () => {
    setModalStates({
      content: null,
      show: false,
      addClass: null,
    });
  };
  const openModalImage = (image, url) => {
    setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.ViewsImage image={image} url={url} />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-review',
    });
  };

  const getChatData = () => {
    orderApi.getCorrespondence_order_item({ order_item_id: id }).then((res) => {
      // setcorrespondenceState(res);
    });
  };
  const sendCommentFromTextField = (order_id) => {
    const fd = new FormData();
    fd.set('order_item_id', order_id);
    fd.set('message', valuesState.text_field);
    fd.set('files', valuesState.file_list); 
    orderApi.postCorrespondence_order_item(fd).then((res) => {
      //getChatData();
      setAmountFile(null);
      setvaluesState({
        text_field: '',
        file_list: [],
      });
    });
  };

  
  useEffect(() => {
     //getChatData();       
  }, []);

  const clickOpenCommit = () => {
    setUpDownBtn(c=>!c)
  }

  
  return (
    <div className={style['cabinet_orders_details__card']}>
      <div className={style['cabinet_orders_details__wrapper-block']}>
        <div onClick={() => openModalImage(image, url)}>
          <img src={image} className={style['cabinet_orders_details__image_thumb']} />
        </div>
        <div className={style['cabinet_orders_details__base_info']}>
          <NavLink to={url}>
            <div className={style['cabinet_orders_details__base_info__brand']}>{brand}</div>
            <div className={style['cabinet_orders_details__base_info__title']}>{title}</div>
          </NavLink>
            <div className={style['cabinet_orders_details__base_info__wrapper']}>
            <div className={style['cabinet_orders_details__base_info__col']}>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                <Text text={'size'} />
                :&nbsp;
                <span className={style['cabinet_orders_details__base_info__desc-black']}>
                  {size}
                </span>
              </div>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                <Text text={'color'} />
                :&nbsp;
                <span className={style['cabinet_orders_details__base_info__desc-black']}>
                  {color}
                </span>
              </div>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                Замена:&nbsp;
                <span className={style['cabinet_orders_details__base_info__desc-black']}>
                  {change_agreement ? 'разрешена' : 'не разрешена'}
                </span>
              </div>
            </div>
            <div className={style['cabinet_orders_details__base_info__col']}>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                Кол-во:&nbsp;
                <span className={style['cabinet_orders_details__base_info__desc-black']}>
                  1 шт.
                </span>
              </div>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                <div>
                  <b>Цена:&nbsp;</b>
                </div>
                <span className={style['cabinet_orders_details__base_info__desc-red']}>
                  {prices.price} {currenssies}&nbsp;
                </span>
              </div>
              <div className={style['cabinet_orders_details__base_info__desc']}>
                <div className={style['cabinet_orders_details__base_info__desc--status-main']}>
                  {status.id !== 'payment_waiting' &&
                  status.id !== 'paid' &&
                  status.id !== 'packaging' &&
                  status.id !== 'sended' ? (
                    <GxIcon
                      slot="icon-left"
                      src={getIconFromStatus(status.id)}
                      className={style['cabinet_orders_details__base_info__icon']}
                    />
                  ) : status.id === 'payment_waiting' ? (
                    <span className={style['cabinet_orders_icon-payment']}>💳</span>
                  ) : status.id === 'paid' ? (
                    <span className={style['cabinet_orders_icon-paid']}>✔️</span>
                  ) :status.id === 'ordered'?(
                    <span className={style['cabinet_orders_icon-paid']}>✔️</span>
                  ) :status.id === 'packaging' ? (
                    <span className={style['cabinet_orders_icon-packaging']}>🛍</span>
                  ) : status.id === 'sended' ? (
                    <span className={style['cabinet_orders_icon-sended']}>🛫</span>
                  ) : null}
                  <span className={style['cabinet_orders_details__base_info__desc--status']}>
                    {status.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={style['btn__order-item--block-canceled']}>
            {status.id === 'payment_waiting' ||
            status.id === 'collection' ||
            status.id === 'paid' ? (
              <button
                variant="default"
                className={style['btn__order-item--canceled']}
                key={id}
                onClick={() => deleteElementOrder(id, order)}
              >
                отменить
              </button>
            ) : null}
            {/* 🗑️ отменить */}
          </div>
        </div>
      </div>

      <ImageUpload>
        {({
          preview,
          onSelectFile,
          onSelectFiles,
          selectedFile,
          isDragActive,
          getRootProps,
          serializeFileList,
        }) => {
          if (!Array.isArray(preview) && preview) {
            preview = [preview];
          }
          return (
            <div className = {classNames({
                [style['ordering_comment']]:true,
                [style['active']]: upDownBtn
              })}
            >
              <div
              
              className = {classNames({
                  [style['ordering_comment__field']]:true,
                  [style['active']]: upDownBtn
              })} 
                >
                <div
                  className={style['ordering_comment__field-comment']}
                >
                  {correspondenceState.map((el, i) => {
                    if (el.is_me) {
                      return (
                        <OrderDetailsPersonalPageViews.ChatFieldUser
                          openModalImage={openModalImage}
                          // openModalVideo={openModalVideo}
                          key={i}
                          {...el}
                        />
                      );
                    } else {
                      return (
                        <OrderDetailsPersonalPageViews.ChatFieldAdmin
                          openModalImage={openModalImage}
                          // openModalVideo={openModalVideo}
                          key={i}
                          {...el}
                        />
                      );
                    }
                  })}
                </div>
                <div className={style['ordering_comment__field-files']}>
                </div>

               
              </div>
              {!!correspondenceState.length? <div onClick={clickOpenCommit} className={style['ordering_comment__up-down']}></div>:null}
              <div className={style['ordering_comment__send']}>
                <GxInput
                  onGx-change={(e) =>
                    setvaluesState({ text_field: e.target.value, file_list: valuesState.file_list })
                  }
                  placeholder={'Оставить комментарий к товару'}
                  className={style['ordering_comment__input']}
                  value={valuesState.text_field}
                ></GxInput>
                <div className={style['ordering_comment__buttons']}>
                  <GxButton
                    variant="text"
                    id={id}
                    size="sm"
                    circle
                    onClick={(e) => {
                      if (e.target.childNodes.length) {
                        e.target.childNodes[0].click();
                      }
                    }}
                  >
                    <input
                      // multiple
                      ref={fileInputRef}
                      className={'hidden'}
                      id="image"
                      type="file"
                      accept=".png, .jpg, .jpeg, .mp4"
                      name={'image'}
                      onChange={(event) => {
                        const files = event.currentTarget.files;
                        setAmountFile(event.currentTarget.files.length);
                        setvaluesState({ text_field: valuesState.text_field, file_list: files[0] });
                      }}
                    />
                    <GxIcon src={paperclip} />
                    {amountFile ? (
                      <gx-badge type="warning" pill>
                        {amountFile}
                      </gx-badge>
                    ) : null}
                  </GxButton>
                  <GxButton
                    onClick={() => sendCommentFromTextField(id)}
                    variant="text"
                    size="sm"
                    circle
                  >
                    <GxIcon src={send} />
                  </GxButton>
                </div>
              </div>
            </div>
          );
        }}
      </ImageUpload>
    </div>
  );
};

export default React.memo(Card);
