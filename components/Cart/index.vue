<template lang="pug">
  v-flex(class='text-xs-center')
    v-container
      v-row(justify="center" align="center")
        v-col
          h2.text-center Cart
          v-select#cart-select(v-if="this.user && this.user.current_cart" :items="available_carts" item-text="name" item-value="_id" v-on:change="changeSelect()" v-model="selectDefault")
        v-spacer
        v-col
          v-card-actions
            v-icon(v-on:click="toggleTest()") mdi-plus
            v-icon(v-on:click="toggleMembers()") mdi-folder-account
      v-row#newCart(style="display:none;" justify="center" align="center")
        v-col
          v-text-field#new-cart-name(name="new") New Cart Name
        v-col
          v-btn(v-on:click="createNewCart()") Create

      v-row#addUserCart(style="display:none;")
        v-col
          v-text-field#new-cart-members(name="members") Insert members separated per commas
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
      v-row.cart_total(v-if="this.user && this.user.current_cart")
        div#card-total {{totalPrice}}€
      v-row.cart_action(v-if="this.user && this.user.current_cart")
        v-col
          v-btn(v-on:click="checkoutCart") Checkout
        v-col
          v-btn(v-on:click="close()") Keep Buying
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
            totalPrice: 0,
            selectDefault: {
                name: this.user && this.user.current_cart?this.user.current_cart.name:'',
                _id: this.user && this.user.current_cart?this.user.current_cart._id:'',
                },
            provider: undefined,
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
        await this.$axios.$get('/cart').then( (res) => {
                this.available_carts = res['carts']
                if (res['carts'].length == 1) {
                    this.$store.commit('changeCurrentCart', res['carts'][0])
                }
                });
    },
    methods: {
        checkoutCart() {
            var edit_str = ""
            this.cart.forEach(function(item) {
                 edit_str += item.product.name + "," + parseInt(item.quantity) + "," + parseInt(item.product.price) + "," + item.product.description + "&|&"
            });

            var cart = this.available_carts.filter((r) => {
                    return r._id == this.user.current_cart
            })
            edit_str += '~~users=' + cart[0].users.join(',')
            edit_str += '~~cart=' + this.user.current_cart
            this.$router.push('/checkout/' + edit_str);
            this.close()
        },
        changeSelect(event) {
            var cart = this.available_carts.filter((r) => {
                    return r._id == this.selectDefault
            })
            this.$store.commit('changeCurrentCart', cart[0])
            this.$axios.$patch('/user/' + this.user.email, {'current_cart': this.selectDefault})
            if (this.provider) {
                this.provider.disconnect()
            }
            this.loadYji();

        },
        async createNewCart() {
            var name = document.getElementById('new-cart-name')
            self = this
            await this.$axios.$post('/cart', {'name': name?name.value:'New cart'}).then((res) => {
                this.$axios.$patch('/user/' + this.user.email, {'current_cart': res['carts']._id})
                this.$store.commit('changeCurrentCart', res['carts'])
                this.selectDefault = {name: res['carts'].name, _id: res['carts']._id}
                this.available_carts.push({name: res['carts'].name, _id: res['carts']._id})
                if (this.provider) {
                    this.provider.disconnect()
                }
                this.loadYji();
                this.updateTotal()
                this.toggleTest()
                self.$fetch;
                this.$toast.success('Cart correcly added')
            })
        },
        async newCartMembers() {
            var name = document.getElementById('new-cart-members')
            self = this
            var users = [this.user.email]
            name.value.split(',').forEach(function(user) {
                    users.push(user)
            });
            await this.$axios.$patch('/cart/' + this.user.current_cart._id, {'users': users}).then((res) => {
                this.$toast.success('Members correctly added')
                this.toggleMembers()
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
            if (!this.user || !this.user.current_cart) {
                return
            }
            const ydoc = new Y.Doc()
            this.cart = ydoc.getMap('cart')
            this.cart.observe(event => {
                this.$forceUpdate();

            })
            if (this.provider) {
                this.provider.disconnect()
                this.provider = undefined
            }
            this.provider = new WebsocketProvider('ws://localhost:1234',
                this.user.current_cart._id, ydoc)

            this.provider.awareness.setLocalStateField('user', {
                    name: this.user ? this.user.first_name + ' ' + this.user.last_name:'User ' + this.getRandomColor(),
                    color: this.user.current_cart.color?this.user.current_cart.color:this.getRandomColor()
            })
            this.provider.awareness.on('change', () => {
                const strings = new Set()
                this.provider.awareness.getStates().forEach(state => {
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
            this.$toast.success('Product added correctly')

        },
        async deleteProductCart(productId) {
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
        },
    }
}

</script>
