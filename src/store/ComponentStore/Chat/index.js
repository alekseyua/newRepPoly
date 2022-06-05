
export const chatMessage = store => {
    let messageArr = []
    store.on('@init', ()=>({chatOrdersMessage: []}))
    store.on('chatOrdersMessage/set', ({chatOrdersMessage},obj)=>{
        if(obj.order_items_chat !== undefined){
            messageArr = obj.order_items_chat;
        }else if(obj.order_item_message !== undefined){

            let newObj = obj.order_item_message;
                console.log('newObj:', newObj)
                
            messageArr = messageArr.map(item=>{
                        if(item.item_id === newObj.order_item_id){
                           item = { 
                                    chat_order_items: item.chat_order_items.concat(newObj).reverse(),
                                    item_id: item.item_id
                                }
                        }
                        return item
                    })
        }
        return {chatOrdersMessage : messageArr}
    })
}