<template>
  <v-app>
    <v-app-bar app class="primary">
      <v-toolbar-title class="headline text-uppercase">
        <span style="color:white">Kouvee</span>
        <span class="font-weight-light" style="color:white">         Pet Shop</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn style="color:white" text href="#home">HOME</v-btn>
        <v-btn style="color:white" text href="#product">PRODUCT</v-btn>
        <v-btn style="color:white" text href="#service">SERVICES</v-btn>
        <v-btn style="color:white" text href="#aboutus">ABOUT US</v-btn>
        <v-btn style="color:white" text href="#contactus">CONTACT US</v-btn>
        <v-btn style="color:white" text ink @click="$router.push('/login')">LOGIN</v-btn>
      </v-toolbar-items>  
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>


export default {
  
};
</script>
