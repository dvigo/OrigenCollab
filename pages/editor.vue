<template>
  <div>
        <meta charset="utf-8"/>
        <title>Yjs Quill Example</title>
        <p></p>
        <v-row justify="center" align="center">
            <v-col cols="8" sm="8" md="6">
                <div>
                    <div v-for="product in this.products" class="product-list">
                        {{ product.name }}
                        {{ product.description}}
                        {{ product.price}}€
                        <input :id="'add-product-quantity-' + product.id" class="product-quantity" value="1"></input>
                        <button class="add-to-cart" v-on:click="updateCart(product)">Add to cart</button>
                    </div>

                </div>
            </v-col>
            <v-col cols="4" sm="4" md="3">
                <div id="cart">
                    </hr>
                    Cart products:
                    <div v-for="p in cart" id="cart-products">
                    {{p[1]['quantity']}} x {{ p[1]['product'].name }} <button v-on:click="deleteProductCart(p[1]['product'].id)" style="color:red">Delete</button>
                    </div>
                    </hr>
                    Total:
                    <div id="cart-total">{{this.totalPrice}}€</div>
                    </hr>
                    Cart users:
                    <ul id="cart-users">
                    </ul>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
@import '~/static/css/cart.css';
</style>
<script>
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export default {
    components: {
    },
    data () {
        return {
            user: this.$auth.user,
            products: [
                {id: 1, name: 'Product 1', price: 4, description: 'test'},
                {id: 2, name: 'Product 2', price: 10, description: 'teskto'},
                {id: 3, name: 'Product 3', price: 4, description: 'testetset'}
            ],
            cart: [],
        }
    },
    mounted() {
        this.loadYji();
    },
    computed: {
        cartAll() {
            if (this.cart && this.cart.length != 0) {
                return Array.from(this.cart.values())
            }
            return []
        },
        totalPrice() {
            var price = 0;
            Array.from(this.cart.values()).forEach(function(value, i) {
                price += value.product.price * value.quantity
            })
            return price
        },
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
        async getProduct(productId) {
            var product_filtered = this.products.filter(p => p.id === productId)
            if (product_filtered.length <= 0) {
                // Fetch from api
                return {id: 2, name: 'Product 2', price: 10, description: 'teskto'}
            }
            return product_filtered[0]
        },
        async loadYji() {
            const ydoc = new Y.Doc()
            this.cart = ydoc.getMap('cart')
            this.cart.observe(event => {
                this.$forceUpdate();

            })

            const provider = new WebsocketProvider('ws://localhost:1234',
                this.findGetParameter('room') ||  'no-room', ydoc)

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

        },
        async updateCart(product, quantity) {
            this.$forceUpdate();
            if (!quantity) {
                quantity = document.getElementById('add-product-quantity-' + product.id).value || 1
            }
            quantity = parseInt(quantity)
            const existing_product = this.cart.get(product.id.toString())
            if (existing_product) {
                this.cart.set(product.id.toString(), {
                            product: product,
                            quantity: existing_product.quantity + quantity,
                            })
            } else {
                this.cart.set(product.id.toString(), {
                            product: product,
                            quantity: quantity,
                            })
            }
        },
        deleteProductCart(productId) {
            console.log(productId)
            this.cart.delete(productId)
        },
    }
}

</script>
