<template lang="pug">
  v-app
    v-row(justify="center" align="center")
      v-col(cols=12 sm=12)
        Carousel(v-bind:images="images")
    v-row
      Product(v-for="product in products" v-bind:product="product")
  </v-row>
</template>

<script>
import Carousel from '~/components/Carousel/index.vue'
import Product from '~/components/Product/index.vue'

  export default {
    data: () => ({
      model: 0,
      images: [
        'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'https://images-ext-2.discordapp.net/external/NbU-dnGO_XCNjmfWyLFtLF_q1k9DarWh5k37qnQw_bc/%3Fauto%3Dcompress%26cs%3Dtinysrgb%26dpr%3D2%26h%3D650%26w%3D940/https/images.pexels.com/photos/950835/pexels-photo-950835.jpeg?width=617&height=409',
      ],
      products: Object,
    }),
    components: {
      Carousel,
      Product
    },
    async fetch() {
      await this.$axios.$get('/product').then( (res) => this.products = res.product.slice(0, 4));
    }
  }
</script>