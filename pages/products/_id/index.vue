<template lang="pug">
  v-app
    v-row(justify="center" align="center")
      v-col(sm="10" md="8" lg="6" cols="12")
        v-card.productCard(style="margin:10px")
            v-img(:src="products.photo_url")
            v-card-title.text-h4 {{products.name}}
            v-card-text {{ products.description}}
            v-card-text.text-h4.text-right {{ products.price}} €
            v-card-action
                v-icon mdi-plus
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
    await this.$axios.$get('/product/'+this.$route.params.id).then( (res) => this.products = res.product);
  }
}
</script>
