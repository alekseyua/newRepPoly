import ModalContentViews from "../../../Views/ModalContentViews";

export const popupWarrning = store => {

    const closeModal = (path = null) => {
        // можно сделать переход в нужное место
        store.dispatch('modal/update', {
            show: false,
            content: null,
            addClass: false, 
        });
        
        return store.dispatch('warrningGoToPath', path);
    };

    store.on('@init', () => ({warrning : '' }));
    store.on('warrningGoToPath',({warrningGoToPath},obj)=>{
        return {warrningGoToPath: obj}
    });
    store.on('warrning/set', ({warrning}, obj) => {
        return (
            store.dispatch('modal/update', {
            content: (
                <ModalContentViews.ModalWrapper>
                    <ModalContentViews.CloseBtn closeModal={() => closeModal(obj.path)} />
                        <ModalContentViews.ContentBlock>
                            <ModalContentViews.CenterPosition>
                            <ModalContentViews.SuccessOrError
                                closeModal={() => closeModal(obj.path)}
                                success={obj.success}
                                content={ !!obj ? (
                                    !!obj.success?
                                        obj.success
                                        :!!obj.fail?
                                            obj.fail
                                            :'Ошибка!!!'
                                    ) : 'Ошибка!!!'}
                            />
                        </ModalContentViews.CenterPosition>
                    </ModalContentViews.ContentBlock>
                </ModalContentViews.ModalWrapper>
            ),
            show: true,
            addClass: 'modal-success_error',        
            })
    )
    });

    store.on('@init', () => ({requestErr : null }));
    store.on('requestErr', ({requestErr}, obj) =>  {
        console.log('requestErr obj:', obj)
        return {requestErr: obj}
    })
}


