import api from "../../../api";
import { ROLE } from "../../../const";
import ModalContentViews from "../../../Views/ModalContentViews";
import AsyncContentModal from "../../../components/ProductDetails/SectionProdPage";
const apiContent = api.contentApi;

export const getProductDetailsModal = store => {
    const closeModal = () => {
      store.dispatch('modal/update',{
        show: false,
        content: null,
        addClass: false, 
      })
    }
    
    store.on('getProductDetailsModal', async ({getProductDetailsModal}, obj)=>{
     const res = await apiContent.getProduct(obj.id)

          console.log('obj product detail', res)
        return (
                store.dispatch('modal/update', {
                content: (
                         <ModalContentViews.ModalWrapper customClassName={''}>
                         <ModalContentViews.CloseBtn closeModal={closeModal} />
                         <ModalContentViews.ContentBlock>
                           <AsyncContentModal
                            modalView
                            url={obj.url}
                            productId={res.id}
                            profileId={0}
                            adding_type={'item'}
                            breadcrumbs={[]}
                            reviews_statistic={{}}
                            reviewsCount={res.review.all_count}
                            title={res.title}
                            brand={ obj.role !== ROLE.RETAIL && obj.role !== ROLE.UNREGISTRED ? res.brand : ''}
                            prices={res.prices}
                            recommended_price={0}
                            colors={res.colors} 
                            sizes={res.sizes}
                            review={res.review}
                            is_new={res.is_new}
                            in_stock_count={res.in_stock_count}
                            is_bestseller={res.is_bestseller}
                            is_in_stock={res.is_in_stock}
                            role_configuration={{}}
                            is_closeout={res.is_closeout}
                            is_liked={res.is_liked}
                            media={res.media}
                            in_cart_count={res.in_cart_count}
                            site_configuration={{}}
                            is_collection={res.is_collection}
                            product_rc={res.product_rc}
                            article={res.article}
                            product_rcAmount={res.minimum_rc}
                            product_sku={res.product_sku}
                           />
                         </ModalContentViews.ContentBlock>
                         </ModalContentViews.ModalWrapper>
                  ),
                  show: true,
                  addClass: 'modal-min_wrap',
                }
                )
         )
    }
    )
}