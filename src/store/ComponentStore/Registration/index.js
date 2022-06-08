import api from "../../../api";
import ModalSubmitCode from "../../../components/Auth/ModalSubmitCode";
import { ROLE } from "../../../const";
import ModalContentViews from "../../../Views/ModalContentViews";

const apiUser = api.userApi;

export const registration = store => {
    const initialValues = {
        lastname: '',
        firstname: '',
        patronymic: '',
        username: '',
        iAgreeDataProcessing: true,
        email: '',
        phone: '',
        password: '',
        whereDidYouHearAboutService: '',
        otherWhereDidHearAbout: '',
        receiveNewsletters: false,
        companyName: '',
        inn: '',
        vk: '',
        instagram: '',
        other: '',
      };

    store.on('checkKey', ({checkKey}, obj) =>  {
        //'auth',
        //'resend'
        const param = {
            key: +obj.submit_code, 
            type: obj.type,
            email: obj.email,
        }
            return {
                checkKey: apiUser
                            .checkKey(param)
                            .then(res=>{

                                let param = {
                                    ...obj,
                                    data: true,
                                    content: 'Аутентификация прошла успешно',
                                }
                                store.dispatch('finallyRegistration/set', param);
                            }
                            )
                            .catch(err=>{          
                                console.log(`ERROR `,err.response)
                            }
                            )
            }
        }
    )

    const closeModal = (obj) => {
        const {path, success = false, userValues = null, role = null, content = null} = obj;
        const params = {
            path: path,
            data: success,
            userValues: userValues,
            role: role,
            content: content,
        }

        if (success) {
            apiUser
            .loginByUsername(
                {
                username: userValues.username,
                password: userValues.password,
                },
            )
            .then(res => {
                    let param = {
                        ...params,
                        data: true,
                    }
                    store.dispatch('keyRegistration/set', param)
            })
            .catch((err) => {
                if (err.response) {
                const data = err.response.data;
                let error = false;
                for (const key in data) {
                    const element = Array.isArray(data[key]) ? data[key][0] : data[key];
                    error = true;
                    let param = {
                        ...params,
                        content: 'Ошибка при регистрации',
                    }
                    store.dispatch('finallyRegistration/set',param)
                }
                }
            });
        }
       !!path && success === false && userValues === null && role ===null? window.location.href = path : (
        store.dispatch('modal/update',{
            show: false,
            content: null,
            addClass: false, 
          })
       )
    };

    store.on('getNewSubmitCode', ({getNewSubmitCode},obj) => {
        let path = obj.type === 'restore'? '/catalog' : '';
        const param = {
            email: obj.email,
            path: path,
            type: obj.type
        }   
        return{
            getNewSubmitCode: (
                 apiUser
                    .resendUserKey(param)
                    .then(res=>{
                        store.dispatch('keyRegistration/set', param)
                    })
                    .catch(err=>{          
                        console.log(`ERROR `,err.response.data)
                        let errMessage = {
                            success: '',
                            fail : 'Ошибка!!!',
                            };
                        store.dispatch('warrning/set', errMessage)
                    }
                ) 
            )
        }
      }
    )

    store.on('keyRegistration/set', ({keyRegistration}, obj)=>{
       const initValue = {
           ...initialValues,
           email: obj.email,
           path: obj.path,
           type: obj.type,
           ...obj.userValues,
        }
        return (
            store.dispatch('modal/update', {
            content: (
                <ModalContentViews.ModalWrapper>
                    <ModalContentViews.CloseBtn closeModal={()=>closeModal({path: obj.path})} />
                    <ModalContentViews.CenterPosition>
                        <ModalContentViews.ContentBlock>
                            <ModalSubmitCode initialValues={initValue} path={obj.path} regist={true} />
                        </ModalContentViews.ContentBlock>
                    </ModalContentViews.CenterPosition>
                </ModalContentViews.ModalWrapper>
            ),
            show: true,
            addClass: 'modal-success_error',        
            })
    )
    })

    store.on('finallyRegistration/set', ({finallyRegistration}, obj)=>{
      debugger
      store.dispatch('modal/update',{
        show: false,
        content: null,
        addClass: false, 
      })
        return (
            store.dispatch('modal/update', {
            content: (
                <ModalContentViews.ModalWrapper>
                <ModalContentViews.CloseBtn closeModal={() => closeModal(obj)} />
                    <ModalContentViews.ContentBlock>
                        <ModalContentViews.CenterPosition>
                            <ModalContentViews.SuccessOrError
                                closeModal={() => closeModal(obj)}
                                success={obj.data}
                                content={!!obj.content?
                                            <div>{obj.content}</div>
                                            : 'Ошибка !!!'}
                            />
                        </ModalContentViews.CenterPosition>
                    </ModalContentViews.ContentBlock>
                </ModalContentViews.ModalWrapper>
            ),
            show: true,
            addClass: 'modal-success_error',        
            })
    )
    })
}