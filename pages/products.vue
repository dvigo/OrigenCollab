<template lang="pug">
  v-app
    v-row
      Product(v-for="product in products" v-bind:product="product")
</template>

<script>
import Product from '~/components/Product/index.vue'

export default {
  data () {
    return {
      products: Object
    }
  },
  components: {
    Product
  },
  async fetch() {
    await this.$axios.$get('/product').then( (res) => this.products = res.product);
  }
}
</script>
