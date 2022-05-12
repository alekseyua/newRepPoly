import { GxForm } from '@garpix/garpix-web-components-react';
import { Formik } from 'formik';
import React from 'react';
import api from '../../api';
import { confirmEmail } from '../../utils/schemesFormic';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import Button from '../../Views/Button';
import ErrorField from '../../Views/ErrorField';
import Input from '../../Views/Input';
import Text from '../Text';


const ModalRestorePassword = ({ initialValues, resetUserPassword,setNextStep }) => {
  const errorsMessenge = {
    requiredField: Text({ text: 'requiredField' }),
    email: Text({ text: 'notValidEmail' }),
  };
  const handleSubmit = (params, { setFieldError }) => {
    const param = {
      ...initialValues,
      email: params.email,
    }
    sessionStorage.setItem('email',params.email)

    resetUserPassword(param, setFieldError);       
  };
  return (
    <>
      <AuthorizationAndRegViews.ModalRestorePasswordTitle title={'Сброс пароля'} mb={'30px'} />
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={confirmEmail(errorsMessenge)}
      >
        {({ handleSubmit, handleChange, handleBlur, values, touched, isSubmitting, errors }) => {
          return (
            <GxForm noValidate onGx-submit={handleSubmit} className="form-horizontal">
              <Input
                type={'email'}
                className={'input-mt_20'}
                value={values.email}
                variant={'largeCustomLabel'}
                autocomplete={'off'}
                name={'email'}
                label={'Введите Ваш E-mail, указанный при регистрации'}
                onGx-input={handleChange}
                onBlur={handleBlur}
                helpText={
                  !!errors.email ? <ErrorField message={errors.email} /> : null
                }
              />
                <AuthorizationAndRegViews.ErrorBlock helpText={errors.serverError} />

              <Button
                variant={'black_btn_full_width'}
                type={'submit'}
                disabled={!values.email || errors.email}
              >
                Отправить код
              </Button>
            </GxForm>
          );
        }}
      </Formik>
    </>
  );
};

export default React.memo(ModalRestorePassword);
