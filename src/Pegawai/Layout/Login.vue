<template>
  <v-img src="https://img4.goodfon.com/original/1920x1080/3/8f/material-design-material-design-colors-abstract-wallpaper--1.jpg" aspect-ratio="2">
    <v-container color="white">
      <v-row>
        <v-col>
          <v-layout align-center justify-center style="margin-top:170px">
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark color="red darken-4">
                  <v-toolbar-title>Employee Kouvee Pet Shop Only</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="username" label="Username" type="text" required></v-text-field>
                    <v-text-field id="password" v-model="password" label="Password" type="password" name="password"
                      required>
                    </v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" type='submit' @click='login()'>LOGIN</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
              {{ text }}
              <v-btn dark text @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </v-layout>
        </v-col>
      </v-row>
    </v-container>
    <v-footer padless :inset="footer.inset" app absolute>
      <v-card class="flex" flat tile>
        <v-card-text class="py-2 text-left">
          ©{{ new Date().getFullYear() }} — Created with <v-icon>mdi-heart</v-icon> by Kelompok 3 P3L
        </v-card-text>
      </v-card>
    </v-footer>
  </v-img>
</template>


<script>
  export default {
    data() {
      return {
        footer: {
          inset: false,
        },
        username: '',
        password: '',
        snackbar: false,
        color: null,
        text: '',
        data:[],
        test:0,
      }
    },
    beforeCreate: function () {
      if (this.$session.exists()) {
        this.$router.push('/pegawai/produk')
      }
    },
    methods: {
      login() {
        var url = this.$apiUrl + "/Auth";

        this.user = new FormData();
        this.user.append("username", this.username);
        this.user.append("password", this.password);

        this.$http.post(url, this.user).then(response => {
          console.log("sudah bisa post")
          if (response.data.Data) {
            this.data = response.data.Data;
            this.$session.start();
            this.$session.set('role', this.data['JABATAN']);
            this.$session.set('id', this.data['ID_PEGAWAI']);
            // localStorage.setItem("role", this.data['JABATAN']);
            // localStorage.setItem("id", this.data['ID_PEGAWAI']);
            this.$router.push({
              path:'/pegawai/produk'
            });
          } else {
            this.snackbar = true;
            console.log("gagal post")
            this.text = "Invalid Username or Password!";
            this.color = "red";
            this.load = false;
          }
        });
      }
    }
  }
</script>