import { GxForm } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import Button from '../../Views/Button';
import Input from '../../Views/Input';
import Text from '../Text';

const ModalSubmitCode = ({ initialValues, setNextStep}) => {
  const [stateKey, setStateKey] = useState();
  const apiUser = api.userApi;

  const handleSubmit = (params, { setFieldError }) => {     
    console.log('work click',params)
    const param = {
      key: +params.submit_code,
      type: "auth"
    }
    apiUser
      .checkKey(param)
      .then(res=>window.location.href = '/')
      .catch(err=>{          
        console.log(`ERROR `,err.response.data.error_auth[0])
        if (!!err.response){
          setFieldError({submitCode : err.response.data.error_auth[0]});
        }
      }
      )
  };
 
  const getNewSubmitCode = () => {
    apiUser
      .resendUserKey()
      .then(res=>{
        console.log('response key', res)
      })
      .catch(err=>{          
        console.log(`ERROR `,err.response.data)
      }
      )
  };

  return (
    <>
      <AuthorizationAndRegViews.ModalRestorePasswordTitle title={'Введите код'} mb={'10px'} />
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => {
          console.log({errors})
          return (
            <GxForm noValidate onGx-submit={handleSubmit} className="form-horizontal">
              <AuthorizationAndRegViews.ModalRestorePasswordDesc mb={'35px'}>
                Мы отправили код подтверждения на ваш e-mail
              </AuthorizationAndRegViews.ModalRestorePasswordDesc>
              <Input
                type={'text'}
                className={''}
                value={values.submitCode}
                variant={'largeCustomLabel'}
                autocomplete={'off'}
                name={'submit_code'}
                placeholder={'Введите код'}
                label={''}
                onGx-input={handleChange}
                helpText={errors.submitCode ? <ErrorField message={errors.submitCode} /> : null}
              />
              <br/>
              <Button variant={'black_btn_full_width'} type={'submit'}>
                отправить код
              </Button>
              <AuthorizationAndRegViews.ModalSubmitCodeView getNewSubmitCode={getNewSubmitCode}/>
            </GxForm>
          );
        }}
      </Formik>
    </>
  );
};

export default React.memo(ModalSubmitCode);
