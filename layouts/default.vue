<template lang="pug">
  v-app(dark)
    v-app-bar(:clipped-left="clipped" fixed app)
      v-btn(icon @click.stop="leftDrawer = !leftDrawer")
        v-icon mdi-menu
      NuxtLink.homeLink(to="/")
        v-toolbar-title(v-text="title")
      v-spacer
      v-menu(offset-y)
        template(v-slot:activator="{ on, attrs }")
          v-btn(v-bind="attrs" v-on="on")
            v-icon mdi-account
            v-text(v-if="isAuthenticated") {{ loggedInUser.first_name }} {{ loggedInUser.last_name }}
        v-list
          v-list-item(v-if="!isAuthenticated" href="/login")
            v-list-item-icon
              v-icon mdi-account
            v-list-item-content Acceder
          v-list-item(v-if="!isAuthenticated" href="register")
            v-list-item-icon
              v-icon mdi-account-plus
            v-list-item-content Register
          v-list-item(v-if="isAuthenticated" @click="logout")
            v-list-item-icon
              v-icon mdi-run-fast
            v-list-item-content Salir
      v-btn(v-if="isAuthenticated" icon @click.stop="rightDrawer = !rightDrawer")
        v-icon mdi-cart
    v-main
      v-container
        Nuxt
    v-navigation-drawer.cart(
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    )
      v-list
        v-list-item
          Cart
    v-navigation-drawer(
        v-model="leftDrawer"
        :left="left"
        temporary
        fixed
      )
        .text-h4.categoryText Categories
        v-row(v-for="category in categories"  v-bind:key="category._id" justify="center" align="center")
          NuxtLink.categoryLink(:to="'/categories/'+category.name")
            .text-h5 {{category.name}}
    v-footer(
      :absolute="!fixed"
      app)
      span &copy; {{ new Date().getFullYear() }}
</template>

<script>
import Cart from '~/components/Cart/index.vue'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      left: true,
      rightDrawer: false,
      leftDrawer: false,
      title: 'CollabShop',
      categories: Object,
    }
  },
  async fetch() {
    await this.$axios.$get('/category').then( (res) => this.categories = res.categories);
  },
  created() {
    this.$nuxt.$on('close-cart', () => {
        this.closeCart()
    })
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser'])
  },
  methods: {
    logout () {
      this.$auth.logout()
    },
    closeCart() {
      this.rightDrawer = !this.rightDrawer
    }
  },
  components: {
    Cart
  }
}
</script>
