<template lang="pug">
  v-flex(class='text-xs-center')
    v-container
      v-row(justify="center" align="center")
        v-col
          h2.text-center Checkout
        v-spacer

      v-row.products
        v-col
            v-simple-table
              thead
                tr
                  th Name
                  th Description
                  th Quantity
                  th Price per unit
                  th Total Price
              tbody
                tr(v-for="p in cart")
                  td {{ p.name }}
                  td {{ p.description }}
                  td {{ p.quantity }}
                  td {{ p.price }}
                  td {{ p.price * p.quantity }}
                tr

    v-row
      v-col
          v-card(height="100%")
            v-card-text
              div(class="font-weight-bold ml-8 mb-2") Totals
                br
                br
                h3 Before Taxes {{ totalAmounts['beforeTaxes']}}€
                br
                h3 Taxes 21%
                br
                h3 Total Taxes {{ totalAmounts['totalTaxes']}}€
                br
                h3 After Taxes {{ totalAmounts['afterTaxes']}}€
      v-col
          v-card
            v-card-text
              div(class="font-weight-bold ml-8 mb-2") Users split
            v-timeline(align-top dense)
              v-timeline-item(v-for="user in users" :color="'red'" :key="user.email" small)
                div
                  div(class="font-weight-normal")
                    strong {{ user.email}}
                  div(style="color:red; font-face:bold") {{totalAmounts['percentage']}}% - {{totalAmounts['totalXUser']}}€

    v-row
      v-col
        v-btn(v-on:click="nextStep()") Checkout
</template>

<script>

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
export default {
  data () {
    return {
        cart: [],
        cart_id: "",
        users: []
    }
  },
  components: {
  },

    mounted() {
        this.loadItems()
    },
    computed: {
        totalAmounts() {
            var bt = 0
            this.cart.forEach(function(item) {
                bt += item.quantity * item.price
            })
            return {
                beforeTaxes: bt,
                totalTaxes: Math.round((bt * 100) / 21),
                afterTaxes: Math.round(bt + (bt * 100) / 21),
                percentage: 100 / this.users.length,
                totalXUser: Math.round(bt + (bt * 100) / 21) / this.users.length
                }
        }
    },
  methods: {
        loadItems() {
            const test = $nuxt.$route.path.split('/checkout/')[1].replace('#slash#', '/')
            console.log([test])
            var users = test.split('~~users=')[1].split('~~cart=')[0]
            this.cart_id = test.split('~~users=')[1].split('~~cart=')[1]
            const items = test.split('~~users=')[0]
            self = this
            users.split(',').forEach(function(u) {
                self.users.push({email: u})
            });
            items.split('&|&').forEach(function(item) {
                const values = decodeURI(item).split(',')
                self.cart.push({name: values[0], quantity: values[1], price: values[2], description: values[3]})
            });
        },
        async nextStep () {
            await this.$axios.$patch('/cart/' + this.cart_id, {'active': false})
            this.$router.push('/');
        },
  },
}
</script>
