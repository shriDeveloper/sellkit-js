
const shopify_shop;
if(Shopify && Shopify.shop) shopify_shop =  Shopify.shop;

/* doing the obvious shopify stuff  here */
let order_items = [];
try{ order_items = Array.from(document.querySelectorAll('[data-order-summary-section="line-items"] [data-variant-id]')).map((product) => ({ order_item : {
        'product_id': product.getAttribute('data-product-id'),
        'variant_id': product.getAttribute('data-variant-id')
}}));}catch(err){
    order_items = [];
}

/* when we have checkout just skip the above one */
if (Shopify.checkout && !order_items.length) {
    order_items = Shopify.checkout.line_items.map((product) => ({ order_item : {
        'product_id': product.product_id,
        'variant_id': product.variant_id
    }}));    
}
/* ends here */

//finally API call here
const API_URL=`http://localhost:8000/api/v1/sellkit/offer?shop=${shop}`
fetch(API_URL)
.then( (data) => {
    if(data.status == 'success'){
        /* check if the download is eligible here */
        const products = data.products;
        order_items.forEach( (order_item) =>{
            if(isDownloadEligible(order_item.product_id , order_item.variant_id , products)){
                /* display the list of digital downloads */
                Shopify.Checkout.OrderStatus.addContentBox('title here','body here');
                /* ends here */
            }
        });
        /* ends here */
    }    
})

function isDownloadEligible(product_id , variant_id , products){
    const is_found_case_one = products.find((product) => (product.product_id == product_id && !product.variants.length))
    const is_found_case_two = products.find((product) => (product.product_id == product_id && product.variants.find((variant) => (variant.id == variant_id) )));
    return !(is_found_case_one == undefined && is_found_case_two == undefined );
}
