import { GxForm } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import React from 'react';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import Button from '../../Views/Button';
import Input from '../../Views/Input';

const ModalNewPassword = ({ initialValues, resetUserPassword,activeSpinner }) => {
  
  const handleSubmit = (params, { setFieldError }) => {
     const param = {
       ...initialValues,
       password: params.password,
     }
    sessionStorage.setItem('password',params.password)
    resetUserPassword(param,setFieldError);
  };

  return (
    <>
      <AuthorizationAndRegViews.ModalRestorePasswordTitle
        title={'Введите новый пароль'}
        mb={'30px'}
      />
      <Formik onSubmit={handleSubmit} initialValues={initialValues}>
        {({ handleSubmit, handleChange, values, touched, isSubmitting, errors }) => {
          return (
            <GxForm noValidate onGx-submit={handleSubmit} className="form-horizontal">
              <Input
                type={'password'}
                className={'input-mt_20'}
                value={values.password}
                variant={'largeCustomLabel'}
                autocomplete={'off'}
                name={'password'}
                label={'Новый пароль'}
                onGx-input={handleChange}
                helpText={errors.password && touched.password? <ErrorField message={errors.password} /> : null}
              />
              <Input
                type={'password'}
                className={'input-mt_20'}
                value={values.confirm_password}
                variant={'largeCustomLabel'}
                autocomplete={'off'}
                name={'confirm_password'}
                label={'Подтвердите новый пароль'}
                onGx-input={handleChange}
                helpText={
                  errors.confirm_password && touched.confirm_password? <ErrorField message={errors.confirm_password} /> : null
                }
              />
              <Button 
                variant={'black_btn_full_width'} 
                type={'submit'}
                className={activeSpinner}
              >
                Изменить пароль
              </Button>
            </GxForm>
          );
        }}
      </Formik>
    </>
  );
};

export default React.memo(ModalNewPassword);
