<template lang="pug">
  v-app
    v-row
      v-spacer
      v-col(cols="12" xs="9" md="8" lg="6")
        Cart
      v-spacer
</template>

<script>
import Cart from '~/components/Cart/index.vue'

export default {
  data () {
    return {
      products: Object
    }
  },
  components: {
    Cart
  },
}
</script>
