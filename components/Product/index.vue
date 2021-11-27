<template lang="pug">
  v-col(sm="6" md="4" lg="3" cols="12")
    v-card.productCard(style="margin:10px")
      v-img(:src="product.photo_url")
      v-card-title {{product.name}}
      v-card-text {{ product.description}}
      v-card-action
        v-icon mdi-plus
</template>

<script> 
export default {
  props: {
      product: {
          type: Object
      }
  }
}
</script>
