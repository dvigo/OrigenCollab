<template lang="pug">
  v-col(sm="6" md="4" lg="3" cols="12")
    v-card.productCard(style="margin:10px")
      v-img(:src="product.photo_url")
      v-card-title {{ product.name}}
      v-card-text {{ product.description}}
      v-card-subtitle {{ product.price }}€
      v-card-actions
        v-icon(v-on:click="updateCart(product)") mdi-plus
</template>

<script>

export default {
    components: {
    },
    data () {
        return {
            user: this.$auth.user,
            cart: [],
        }
    },
    props: {
        product: {
            type: Object
        }
    },
    created() {
    },
    mounted() {
    },
    methods: {
        updateCart(product, quantity) {
            $nuxt.$emit('update-cart', product, quantity)
        },
    }
}
</script>
