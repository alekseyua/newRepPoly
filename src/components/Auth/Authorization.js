import React, { useEffect, useState } from 'react';
import { GxRow, GxForm } from '@garpix/garpix-web-components-react';
import AuthorizationAndRegViews from '../../Views/AuthorizationAndRegViews';
import ModalContentViews from '../../Views/ModalContentViews';
import { Formik } from 'formik';
import Grid from '../../Views/Grid';
import Coll from '../../Views/Coll';
import api from '../../api';
import Input from '../../Views/Input';
import ErrorField from '../../Views/ErrorField';
import Button from '../../Views/Button';
import CheckBox from '../../Views/CheckBox';
import Text from '../Text';
import { withRouter } from 'react-router-dom';
import { signInSchemaByUsername } from '../../utils/schemesFormic';
import RestorePasswordSetPassword from './RestorePasswordSetPassword';
import ModalRestorePassword from './ModalRestorePassword';
import ModalNewPassword from './ModalNewPassword';
import ModalSubmitCode from './ModalSubmitCode';
import { secretWordEncoding, serializerUserDataDencrypt, serializerUserDataEncript } from '../../utils/encrypt';
import { useStoreon } from 'storeon/react';
import {checkLocalStorage} from '../../utils';



const apiUser = api.userApi;
const initialState = {
  step: 0,
  allSteps: 3,
};
const initialValues = {
  id: '',
  is_active: false,
  last_name: '',
  first_name: '',
  middle_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  submitCode: '',
  confirm_password: '',
};

const Authorization = ({ history, site_configuration, setModalStates }) => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState(initialState);
  const [values, setValues] = useState(null);
  const { page_type_reg, page_type_catalog } = site_configuration;
  const { dispatch } = useStoreon();

  const errorsMessenge = {
    longUsername: 'Слишком длинный никнейм',
    notValidPass: Text({ text: 'notValidPass' }),
    shortPass: Text({ text: 'shortPass' }),
    longPass: Text({ text: 'longPass' }),
    requiredField: Text({ text: 'requiredField' }),
    invalidAuthData: Text({ text: 'invalid.auth.data' }),
  };
  useEffect(()=>{
    setValues(initialValues);
  },[])
  const onSaveFormData = (data, callbacks = {}) => {
    setValues(data);
    setNextStep();
  };
  const setNextStep = () => {
    setState((prevState) => ({ ...prevState, step: prevState.step + 1 }));
  };
  const closeModal = () => {
    setState(initialState);
    setModalStates({
      content: null,
      show: false,
    });
  };
 
  const resetUserPassword = (params, setFieldError) =>{
  
    setValues( prev => {
      return { ...prev, ...params }      
    })
    if(state.step === 0){
      apiUser
        .resendUserKey(params)
        .then(res=>{
            if (res.data.status === 'Send') setNextStep();
        })
        .catch(err=>{          
            console.log(`ERROR `,err)
            console.log('err:', err.data)
        }
      )
    }else if(state.step === 2){
      let param = {
        key: sessionStorage.getItem('submit_code'),
        password: sessionStorage.getItem('password'),
        email: sessionStorage.getItem('email'),
      }
      console.log('param: reset password', param)
      apiUser
        .resetUserPassword(param)
        .then(res=>{
          openModalFinallyRestorePassword(true);
        })
        .catch(err=>{          
          console.log(`ERROR `,err.response.data)
          if (!!err.response){
            if(err.response.data.status === "Неправильный код"){
              // ???? getNewSubmitCode(param)                        
            }
            setFieldError({email : err.response.data?.status});
          }
          openModalFinallyRestorePassword(false);
        }
        ) 
    }
    return;
  }

  const openModalFinallyRestorePassword = (data) => {
    return setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={() => closeModal(data)} />
          <ModalContentViews.ContentBlock>
            <ModalContentViews.CenterPosition>
              <ModalContentViews.SuccessOrError
                closeModal={() => closeModal(data)}
                success={data}
                content={data ? 'Ваш пароль успешно изменен' : 'Ошибка при смене пароля'}
              />
            </ModalContentViews.CenterPosition>
          </ModalContentViews.ContentBlock>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-success_error',
    });
  };
// debugger

  const openModalRestorePassword = () => {
    setModalStates({
      content: (
        <ModalContentViews.ModalWrapper>
          <ModalContentViews.CloseBtn closeModal={closeModal} />
          <ModalContentViews.CenterPosition>
            <ModalContentViews.ContentBlock>
              {
                {
                  0: (
                    <ModalRestorePassword 
                      setNextStep={setNextStep} 
                      initialValues={values} 
                      resetUserPassword={resetUserPassword}                      
                    />
                  ),
                  2: (
                    <ModalNewPassword
                      onSaveFormData={onSaveFormData}
                      initialValues={values}
                      openModalFinallyRestorePassword={openModalFinallyRestorePassword}
                      resetUserPassword={resetUserPassword}
                      setValues={setValues}
                    />
                  ),
                  1: <ModalSubmitCode 
                        setNextStep={setNextStep} 
                        initialValues={values}
                        setValues={setValues}                 
                        resetUserPassword={resetUserPassword}
                      />,
                }[state.step]
              }

            </ModalContentViews.ContentBlock>
          </ModalContentViews.CenterPosition>
        </ModalContentViews.ModalWrapper>
      ),
      show: true,
      addClass: 'modal-reset-password',
    });
  };

  
  const onSubmit = (data, { setFieldError }) => {
    apiUser
      .loginByUsername(
        {
          username: data.username,
          password: data.password,
        },
        data.remember,
      )
      .then((res) => {
        window.location.href = page_type_catalog;
      })
      .catch((err) => {
        if (err.response) {
          setFieldError('serverError', errorsMessenge.invalidAuthData);
        }
      });
  };
  useEffect(() => {
    if (state.step === 0) return;
    openModalRestorePassword();
  }, [state.step]);


  const initialValuesUserData = { 
    username: checkLocalStorage(secretWordEncoding('username'))? serializerUserDataDencrypt(localStorage.getItem(secretWordEncoding('username'))) : '', 
    password: checkLocalStorage(secretWordEncoding('password'))? serializerUserDataDencrypt(localStorage.getItem(secretWordEncoding('password'))) : '',  
    remember: checkLocalStorage(secretWordEncoding('remember'))? localStorage.getItem(secretWordEncoding('remember')) : false
  };
  return (
    <Grid>
      <GxRow>
        <Coll sizeLg={6} sizeMd={12} sizeSm={12} sizeXl={6} sizeXs={12}>
          <AuthorizationAndRegViews.LeftSide />
        </Coll>
        <Coll sizeLg={6} sizeMd={12} sizeSm={12} sizeXl={6} sizeXs={12}>
          <AuthorizationAndRegViews.RightSide>
            <AuthorizationAndRegViews.RegistrationBlock to={page_type_reg} />
            <AuthorizationAndRegViews.FormSingnIn>
              <Formik
                validationSchema={signInSchemaByUsername(errorsMessenge)}
                initialValues={initialValuesUserData}
                onSubmit={onSubmit}
              >
                {({ handleSubmit, handleChange, values, errors, setFieldValue, handleBlur, touched }) => {
                    if (values.remember){
                        localStorage.setItem(secretWordEncoding('username'), serializerUserDataEncript(values.username));                      
                        localStorage.setItem(secretWordEncoding('password'), serializerUserDataEncript(values.password));
                    }
                    
                    const onHandleChangeRemember = (e) => {
                      let checked = e.target.checked;
                      setFieldValue('remember', checked);
                      if (checked){
                        localStorage.setItem(secretWordEncoding('username'), serializerUserDataEncript(values.username));                      
                        localStorage.setItem(secretWordEncoding('password'), serializerUserDataEncript(values.password));
                        localStorage.setItem(secretWordEncoding('remember'), checked);
                      }else{
                        if (checkLocalStorage(secretWordEncoding('username'))){
                          localStorage.removeItem(secretWordEncoding('username'));
                        }                        
                        if  (checkLocalStorage(secretWordEncoding('password'))){
                          localStorage.removeItem(secretWordEncoding('password'));
                        }
                        if  (checkLocalStorage(secretWordEncoding('remember'))){
                          localStorage.removeItem(secretWordEncoding('remember')); 
                        }
                      }
                    }
                  return (
                    <GxForm noValidate onGx-submit={handleSubmit}>
                      <Input
                        value={values.username}
                        variant={'largeCustomLabel'}
                        className={'input-mt_20'}
                        name={'username'}
                        autocomplete={'off'}
                        onGx-input={handleChange}
                        data-cy={'authorization_username'}
                        label={Text({ text: 'username' })}
                        onBlur={handleBlur}
                        helpText={errors.username && touched.username ? <ErrorField message={errors.username} /> : null}
                      />
                      <Input
                        type={'password'}
                        className={'input-mt_20'}
                        value={values.password}
                        variant={'largeCustomLabel'}
                        autocomplete={'off'}
                        name={'password'}
                        label={Text({ text: 'password' })}
                        data-cy={'authorization_password'}
                        onGx-input={handleChange}
                        onBlur={handleBlur}
                        helpText={errors.password && touched.password ? <ErrorField message={errors.password} /> : null}
                      />
                      <AuthorizationAndRegViews.GroupBlock>
                        <CheckBox
                          checked={values.remember}
                          name={'remember'}
                          onGx-change={onHandleChangeRemember}
                          label={Text({ text: 'remember' })}
                          data-cy={'authorization_check_box_remember'}
                        />
                        <Button
                          variant={'looksLikeLink'}
                          type={'button'}
                          onClick={openModalRestorePassword}
                          data-cy={'authorization_forgot_password'}
                        >
                          <Text text={'forgotYourPassword'} />
                        </Button>
                      </AuthorizationAndRegViews.GroupBlock>
                      <AuthorizationAndRegViews.ErrorBlock helpText={errors.serverError} />
                      <Button
                        variant={'black_btn_full_width'}
                        type={'submit'}
                        data-cy={'authorization_button'}
                      >
                        <Text text={'toComeIn'} />
                      </Button>
                    </GxForm>
                  );
                }}
              </Formik>
            </AuthorizationAndRegViews.FormSingnIn>
          </AuthorizationAndRegViews.RightSide>
        </Coll>
      </GxRow>
    </Grid>
  );
};

export default React.memo(withRouter(Authorization));
