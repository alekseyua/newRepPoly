import { GxForm } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { useStoreon } from 'storeon/react';
import api from '../../api';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import Button from '../../Views/Button';
import Input from '../../Views/Input';
import Text from '../Text';

const ModalSubmitCode = ({ emailUser = null, resetUserPassword, initialValues, path = null, setNextStep = null,setValues = null, regist = false}  ) => {
  const { dispatch } = useStoreon();
  const handleSubmit = (params, { setFieldError }) => {   
    params = {
      ...params,
      path: path,
      type: 'auth',
      email: emailUser? emailUser : params.email
    }
    console.log('params: submit code', params)
    const param = {
      ...initialValues, 
      submit_code: params.submit_code,
      email: emailUser? emailUser : params.email
    }
      regist? 
        dispatch('checkKey',params) 
        : (
          setNextStep(),
          sessionStorage.setItem('submit_code',params.submit_code),          
          resetUserPassword(param)
          );
  };

  const postKeyFromMail = () => {
    dispatch('getNewSubmitCode', {email: initialValues.email, type: 'resend'});
  }
  return (
    <>
      <AuthorizationAndRegViews.ModalRestorePasswordTitle title={'Введите код'} mb={'10px'} />
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => {
          return (
            <GxForm noValidate onGx-submit={handleSubmit} className="form-horizontal">
              <AuthorizationAndRegViews.ModalRestorePasswordDesc mb={'35px'}>
                {/* добавить надписи для разных ролей */}
                Мы отправили код подтверждения на Ваш e-mail
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
              <AuthorizationAndRegViews.ModalSubmitCodeView postKeyFromMail={postKeyFromMail}/>
            </GxForm>
          );
        }}
      </Formik>
    </>
  );
};

export default React.memo(ModalSubmitCode);
