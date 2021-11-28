<template lang="pug">
  v-flex(class='text-xs-center')
    v-container
      v-row
        v-col
          h2.text-center Cistella
      v-row.products
        v-col
          div#cart-products(v-for="p in cart")
            v-banner
              v-card-title {{p[1]['product'].name }}
            v-card.cart_product
              button(v-on:click="deleteProductCart(p[1]['product']._id)" style="color:red") Delete
              v-card-title {{p[1]['quantity'] * p[1]['product'].price + '€'}}
              v-card-text {{p[1]['quantity'] + 'x' + p[1]['product'].price + '€'}}
      v-row.cart_total
        div#card-total {{totalPrice}}€
      v-row.cart_action
        v-col
          v-btn Tramitar pedido
        v-col
          v-btn Seguir comprando
      v-row
        ul#cart-users


</template>

<script>
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'


export default {
    name: "Cart",
    components: {
    },
    data () {
        return {
            user: this.$auth.user,
            cart: [],
            totalPrice: 0
        }
    },
    computed: {
    },
    mounted() {
        this.loadYji();
    },
    created() {
       this.$nuxt.$on('update-cart', (product, quantity) => {
           this.updateCart(product, quantity)
       })
    },
    methods: {
        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        findGetParameter(parameterName) {
            var result = null,
                tmp = [];
            location.search
                .substr(1)
                .split("&")
                .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
                });
            return result;
        },
        async loadYji() {
            const ydoc = new Y.Doc()
            this.cart = ydoc.getMap('cart')
            this.cart.observe(event => {
                this.$forceUpdate();

            })

            const provider = new WebsocketProvider('ws://localhost:1234',
                this.user.current_cart, ydoc)

            provider.awareness.setLocalStateField('user', {
                    name: this.user ? this.user.first_name + ' ' + this.user.last_name:'User ' + this.getRandomColor(),
                color: this.getRandomColor()
            })
            provider.awareness.on('change', () => {
                // Map each awareness state to a dom-string
                const strings = []
                provider.awareness.getStates().forEach(state => {
                    if (state.user) {
                        strings.push(`<li style="color:${state.user.color};">${state.user.name}</li>`)
                    }
                    document.querySelector('#cart-users').innerHTML = strings.join('')
                })
            })
            self = this
            ydoc.on('update', function(test, test2, test3, test4) {
                self.updateTotal()
            })

        },
        async updateCart(product, quantity) {
            if (!quantity) {
                var div = document.getElementById('add-product-quantity-' + product._id)
                quantity = div?div.value:1
            }
            quantity = parseInt(quantity)
            const existing_product = this.cart.get(product._id)
            if (existing_product) {
                this.cart.set(product._id, {
                            product: product,
                            quantity: existing_product.quantity + quantity,
                            })
            } else {
                this.cart.set(product._id, {
                            product: product,
                            quantity: quantity,
                            })
            }
        },
        async deleteProductCart(productId) {
            console.log(productId)
            this.cart.delete(productId)
        },
        updateTotal() {
            this.$emit('update-card', 'hi');
            var price = 0
            this.cart.forEach(function(p) {
                price += p.product.price * p.quantity
            });
            this.totalPrice = price
        }
    }
}

</script>
