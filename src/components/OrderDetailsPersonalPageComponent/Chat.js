import React, { useCallback, useEffect, useState } from 'react';
import OrderDetailsPersonalPageViews from '../../Views/OrderDetailsPersonalPageViews';
import { GxForm } from '@garpix/garpix-web-components-react';
import ModalContentViews from '../../Views/ModalContentViews';
import { Formik } from 'formik';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import api from '../../api';


const orderApi = api.orderApi;
const socketWeb = api.socketApi;

const Chat = ({ order_id, setModalStates }) => {
  const [correspondenceState, setcorrespondenceState] = useState([]);
  const [valuesState, setvaluesState] = useState({
    text_field: '',
    file_list: [],
  });

const [ message, setMessage ] = useState({});


useEffect(()=>{
  const ws = new WebSocket(`ws://91.218.229.240:8001/ws/chat/${order_id}/`)
    ws.addEventListener('open', function (event) {
      ws.send(JSON.stringify({'order_id': order_id}))
      console.log('message send',event)
    })
    ws.addEventListener('message', function (data) {
      setcorrespondenceState(prev => [...prev, ...JSON.parse(data.data).order_chat])
    })
  },[])

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
    
    // const dataMessage = {
    //   'order_id': order_id,
    //   'message': values.text_field,
    //   'files': values.file_list,
    // }

    // console.log('dataMessage:', dataMessage)
    // ws.send(JSON.stringify(dataMessage))
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
              />
            </OrderDetailsPersonalPageViews.WrapperChat>
          </GxForm> 
        ); 
      }}
    </Formik>
  );
};

export default React.memo(Chat);
