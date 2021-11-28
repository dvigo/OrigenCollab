<template lang="pug">
  v-flex(class='text-xs-center')
    v-container
      v-row
        v-col
          h2.text-center Cistella
          v-select#cart-select(:items="available_carts" item-text="name" item-value="_id" v-on:change="changeSelect()")
        v-spacer
        v-col
          v-card-actions
            v-icon(v-on:click="toggleTest()") mdi-plus
            v-icon(v-on:click="toggleMembers()") mdi-folder-account
      v-row#newCart(style="display:none;")
        v-col
          v-text-field#new-cart-name New Cart Name
        v-col
          v-btn(v-on:click="createNewCart()") Create

      v-row#addUserCart(style="display:none;")
        v-col
          v-text-field#new-cart-members Insert members separated per commas
        v-col
          v-btn(v-on:click="newCartMembers()") Share
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
            available_carts: [],
            cart: undefined,
            rooms: [],
            totalPrice: 0,
            selectDefault: {
                name: this.user?this.user.current_cart.name:'',
                _id: this.user?this.user.current_cart._id:'',
                }
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
    async fetch() {
        await this.$axios.$get('/cart').then( (res) => this.available_carts = res.carts);
    },
    methods: {
        changeSelect(event) {
            var value = document.getElementById('available_carts').value()
            console.log(this.rooms)
            //this.rooms.filter( ( r ) => {
            //    return category.name === 'Sneakers';
            //})[ 0 ].products;

        },
        async createNewCart() {
            var name = document.getElementById('new-cart-name')
            self = this
            await this.$axios.$post('/cart', {'name': name?name.value:'New cart'}).then((res) => {
                this.user.current_cart = res['carts'][0]
                self.$fetch;
                this.$toast.success('Cart afegit correctament')
            })
        },
        async newCartMembers() {
            var name = document.getElementById('new-cart-members')
            self = this
            await this.$axios.$patch('/cart/' + this.user.current_cart._id, {'users': this.user.email + ',' + name.value}).then((res) => {
                this.$toast.success('Members afegits correctament')
            })
        },
        toggleTest() {
            const div = document.getElementById('newCart')
            if (div.style.display == 'none') {
                div.style.display = ''
            } else {
                div.style.display = 'none'
            }
        },
        toggleMembers() {
            const div = document.getElementById('addUserCart')
            if (div.style.display == 'none') {
                div.style.display = ''
            } else {
                div.style.display = 'none'
            }
        },
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
                this.user.current_cart._id, ydoc)

            provider.awareness.setLocalStateField('user', {
                    name: this.user ? this.user.first_name + ' ' + this.user.last_name:'User ' + this.getRandomColor(),
                    color: this.user.current_cart.color?this.user.current_cart.color:this.getRandomColor()
            })
            provider.awareness.on('change', () => {
                const strings = new Set()
                provider.awareness.getStates().forEach(state => {
                    if (state.user) {
                        strings.add(`<span class="white--text text-h5 avatar">${state.user.name[0]}</span>`)
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
            this.$toast.success('Producte afegit correctament')

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
        },
        close() {
          $nuxt.$emit('close-cart');
        }
    }
}

</script>
