import React, { useCallback, useEffect, useRef, useState } from 'react';
import OrderDetailsPersonalPageViews from '../../Views/OrderDetailsPersonalPageViews';
import { GxForm } from '@garpix/garpix-web-components-react';
import ModalContentViews from '../../Views/ModalContentViews';
import { Formik } from 'formik';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import api from '../../api';
import { getCookie } from '../../utils';
import { useStoreon } from 'storeon/react';


const orderApi = api.orderApi;
const socketWeb = api.socketApi;

const Chat = ({ order_id, setModalStates }) => {
  const { dispatch } = useStoreon();
  const [correspondenceState, setcorrespondenceState] = useState([]);
  const ws = useRef(null);
  const [isState, setIsState] = useState(false);

  const [valuesState, setvaluesState] = useState({
    text_field: '',
    file_list: [],
  });

  const getChatData = () => {
    orderApi
      .getCorrespondence({ order_id: order_id })
      .then((res) => {
        //setcorrespondenceState(res);
      });
  };

  const sendCommentFromTextField = (values, { resetForm }) => {
    const fd = new FormData();
    fd.set('order', order_id);
    fd.set('message', values.text_field);
    fd.set('files', values.file_list);
    orderApi
      .postCorrespondence(fd)
      .then((res) => {
        getChatData();
        resetForm({
          text_field: '',
          file_list: [],
        });
    });
  };

  const handleChange = (key, value) => {
    setvaluesState({
      ...valuesState,
      [key]: value,
    });
  };

  const closeModal = () => {
    setModalStates({
      content: null,
      show: false,
      addClass: null,
    });
  };

  const openModalImage = (image) => {
    setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.ViewsImage image={image} />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-review',
    });
  };
  const openModalVideo = (video, preview) => {
    setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.ViewsVideo video={video} preview={preview} />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-review',
    });
  };

  useEffect(() => {
    //getChatData();
  }, []);

  // *******************************************************************
  const urlChatItem = `wss://back.ftownpl.com:8443/ws/chat/${order_id}/?token=$${getCookie('ft_token')}`;

  useEffect(() => {
        const newWS = () => {
          ws.current = new WebSocket(urlChatItem); // создаем ws соединение
        }
        if(!!getCookie('ft_token')){
          newWS()
          ws.current.onopen = () =>{                  
            setIsState(!isState)
            gettingData();
          }
          ws.current.onclose = () => {
            setTimeout(newWS(),3000);
            setIsState(!isState)        
          }
        }
    return () => ws.current.close(); // кода меняется isState - соединение закрывается
  }, [ws]);

  const gettingData = useCallback(() => {
      if (!ws.current) return;    
      ws.current.onmessage = e => {                //подписка на получение данных по вебсокету
        const message = JSON.parse(e.data);
        if(message?.status !== false){
          let { order_chat, order_message, order_item_message } = message;
          dispatch('chatOrdersMessage/set',message)
          if(order_chat !== undefined){
             if(order_chat.length > 0){
              setcorrespondenceState(order_chat)
             }
          }else if(order_message !== undefined){
           setcorrespondenceState(prev=> ([...[message.order_message], ...prev]));
          }
        }
      };
      return ()=>{
        ws.current.close(); // кода меняется isState - соединение закрывается
      }
  }, [isState]);

  return (
    <Formik enableReinitialize onSubmit={sendCommentFromTextField} handleChange={handleChange} initialValues={valuesState}>
      {({ handleSubmit, values, handleChange, setFieldValue, setValues }) => {

        return (
          <GxForm noValidate onSubmit={handleSubmit}>
            <OrderDetailsPersonalPageViews.WrapperChat>
              <OrderDetailsPersonalPageViews.HeadChat setModalStates={setModalStates}/>
              <OrderDetailsPersonalPageViews.ChatFieldsWrapper>
                {correspondenceState.map((el, i) => {
                  if (el.is_me) {
                    return (
                      <OrderDetailsPersonalPageViews.ChatFieldUser
                        openModalImage={openModalImage}
                        openModalVideo={openModalVideo}
                        key={i}
                        {...el}
                      />
                    );
                  } else {
                    return (
                      <OrderDetailsPersonalPageViews.ChatFieldAdmin
                        openModalImage={openModalImage}
                        openModalVideo={openModalVideo}
                        key={i}
                        {...el}
                      />
                    );
                  }
                })}
              </OrderDetailsPersonalPageViews.ChatFieldsWrapper>
              <OrderDetailsPersonalPageViews.SendChatBlock
                values={values}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                setValues={setValues}
                handleSubmit={handleSubmit}
                sendCommentFromTextField={sendCommentFromTextField}
                isState={isState}                
              />
            </OrderDetailsPersonalPageViews.WrapperChat>
          </GxForm> 
        ); 
      }}
    </Formik>
  );
};

export default React.memo(Chat);
