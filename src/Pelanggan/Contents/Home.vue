<template>
    <div id="app">
        <full-page :options="options" id="fullpage">
            <div class="section">
              <v-layout>
              <v-img
              src="../../assets/pic4.jpg"
              contain
            >
            <div class="center-screen">
              <h1><span class="span1" >KOUVEE PET SHOP</span>
              <br> your best pets friends</h1>
              <div class="button">
                <v-btn color="secondary" large href="#product">Our Product</v-btn>
                <v-btn color="third" style="margin-left:10vh" large href="#service">Our Services</v-btn>
              </div>
            </div>
            </v-img>
              </v-layout>
            </div>
            <div class="section center-screen">
              <!-- PRODUK -->
              <v-layout>
                <v-img
                src="../../assets/pic1.jpg"
                contain
                > 
                <v-data-iterator 
              :items="produkk" 
              :search="search" 
              :items-per-page.sync="itemsPerPage"
              :page="page"
              hide-default-footer >
                <template 
                v-slot:header>
                  <v-toolbar
                  color="primary"
                  class="mb-2"
                  flat>
                    <v-text-field
                      v-model="search"
                      clearable
                      solo-inverted
                      hide-details
                      label="Search"
                      class="ml-12"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                    large
                    class="mr-10 ml-7"
                    @click="sort('HARGA_JUAL')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-tag-text-outline
                    </v-icon>
                    <v-icon
                      v-if="sortBy === 'HARGA_JUAL'"
                      small
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                    <span class="caption text-lowercase">Sort by Price</span>
                  </v-btn>
                  <v-btn
                    large=""
                    class="mr-10 ml-7"
                    @click="sort('STOCK')"
                  >
                    <v-icon
                      left
                      small
                    >
                      mdi-cart-outline
                    </v-icon>
                    <v-icon
                      v-if="sortBy === 'STOCK'"
                      small
                    >
                      mdi-sort-{{ sortDirection }}
                    </v-icon>
                    <span class="caption text-lowercase">Sort by Stock</span>
                  </v-btn>
                  </v-toolbar>
                </template>
                <template 
                v-slot:default="props"
                >
                  <v-row
                  class="ml-1">
                      <v-col v-for="item in props.items" :key="item.NAMA_PRODUK" cols="8" sm="6" md="3" lg="3">
                          <v-card
                          max-width="250"
                          min-height="100"
                          class="mb-10"
                          >
                              <img :src= '$apiGambar + item.GAMBAR' width="250px" height="200px">
                              <v-list dense>
                                  <v-list-item>
                                  <v-list-item-content>Nama Produk</v-list-item-content>
                                  <v-list-item-content class="align-end">: {{ item.NAMA_PRODUK }}</v-list-item-content>
                                  </v-list-item>

                                  <v-list-item>
                                  <v-list-item-content>Harga</v-list-item-content>
                                  <v-list-item-content class="align-end">: {{ item.HARGA_JUAL }}</v-list-item-content>
                                  </v-list-item>

                                  <v-list-item>
                                  <v-list-item-content>Stock</v-list-item-content>
                                  <v-list-item-content class="align-end">: {{ item.STOCK }}</v-list-item-content>
                                  </v-list-item>
                              </v-list>
                          </v-card>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:footer >
                  <v-row class="mt-12" align="center" justify="end">
                    <v-btn
                      fab
                      dark
                      color="primary"
                      class="mr-6"
                      @click="formerPage"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      dark
                      color="primary"
                      class="mr-12"
                      @click="nextPage"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-data-iterator>
            
            
                </v-img>
              </v-layout>
            </div>
            <div class="section center-screen">
              <!-- Serices -->
              <v-layout>
              <v-img
              src="../../assets/pic2.jpg"
              contain
              >
               <v-data-iterator 
              :items="layanan" 
              :search="search" 
              :items-per-page.sync="itemsPerPage"
              :page="page"
              hide-default-footer >
                <template v-slot:header>
                  <v-toolbar
                  color="primary"
                  class="mb-2"
                  flat>
                    <v-text-field
                      v-model="search"
                      clearable
                      solo-inverted
                      hide-details
                      label="Search"
                      class="ml-5 mb-2"
                    ></v-text-field>
                  </v-toolbar>
                </template>
                <template 
                v-slot:default="props">
                  <v-row
                  class="ml-5">
                      <v-col v-for="item in props.items" :key="item.NAMA_LAYANAN" cols="8" sm="6" md="3" lg="3"
                      class="mt-10">
                          <v-card
                          max-width="250"
                          min-height="100"
                          >
                            <v-card-text>
                            <div>Our Services</div>
                            <p class="display-1 text--primary">
                            {{item.NAMA_LAYANAN}} <br> {{item.JENISHEWAN}} <br> {{item.UKURAN}}
                            </p>
                            <p>harga</p>
                            <div class="text--primary">
                            RP. {{item.HARGA_LAYANAN}}<br>
                            </div>
                            </v-card-text>
                          </v-card>
                    </v-col>
                  </v-row>
                </template>
                <template v-slot:footer >
                  <v-row class="mt-12" align="center" justify="end">
                    <v-btn
                      fab
                      dark
                      color="secondary"
                      class="mr-8"
                      @click="formerPage"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                      fab
                      dark
                      class="mr-12"
                      color="secondary"
                      @click="nextPage"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </template>
              </v-data-iterator>
              </v-img>
              </v-layout>
            </div>
            <div class="section">
              <!-- AboutUS -->
              <v-layout>
              <v-flex
              hidden-sm-and-down
              md6
              >
              <v-img
              src="../../assets/pic4.jpg"
              height="100vh"
              />
              </v-flex>

              <v-flex
              xs12
              md6
              align-content-space-between
              layout
              :pa-5="$vuetify.breakpoint.smAndDown"
              wrap
              >

              <v-layout
              align-center
              justify-center
              >
              <v-flex
              xs10
              md6
              >
              <br>
              <p style="text-align:justify">
              Kouvee Pet Shop
              This was formed because we wanted to channel our hobbies and facilitate some people who shared a hobby like us. we will serve you wholeheartedly and your pet will be very happy to be with us.
              </p>
              <p style="text-align:justify">
              “There’s a saying. If you want someone to love you forever, buy a dog, feed it and keep it around.” Dick Dale, American Musician
              </p>
              <p style="text-align:justify">
                “A dog is the only thing on earth that loves you more than you love yourself.” Josh Billings, American Comedian
              </p>
              <h1>OUR MEMBER</h1>
              <br>
              <p style="text-align:justify">
              Andreas Widi Nugroho Prihastama
              </p>
              <p style="text-align:justify">
              Alexander Rivelino Aldo Aldiero 
              </p>
              <p style="text-align:justify">
              Rio Justino Monaha Zebua
              </p>
              <p style="text-align:justify">
              Ryan Octavius Saputra
              </p>
              <p style="text-align:justify">
              Yosseleon Alfanus Irawan
              </p>
              </v-flex>
              </v-layout>
              </v-flex>
              </v-layout>
            </div>
            <div class="section">
                <!-- ContactUS -->
                <v-layout>
              <v-img
              src="../../assets/pic3.jpg"
              contain
            >
            <div class="center-screen">
              <v-layout row wrap>
                  <v-flex md6>
                    <v-card dark tile flat color="transparent" min-height="100vh">
                       <v-img class="mt-12" contain height="200" src="https://i.pinimg.com/originals/71/c8/06/71c806428f9d8c76f8dd491ee177382c.png"></v-img>
                       <h2 style="font-size:50px">ADDRESS</h2>
                       <h3>Jln. Mosses Gatotkaca No. 22 Yogyakarta 55281</h3>
                    </v-card>
                  </v-flex>
                  <v-flex md6>
                      <v-card dark tile flat color="transparent" min-height="100vh">
                       <v-img class="mt-12" contain height="200" src="https://kiosbfo.files.wordpress.com/2015/06/phone-logo-pngphone-png-icon-clipart-best-ttocgqc71.png"></v-img>
                       <h2 style="font-size:50px">PHONE</h2>
                       <h3>(0274) 357735 </h3>
                    </v-card>
                  </v-flex>
                </v-layout> 
            </div>
            </v-img>
              </v-layout>
            </div>
        </full-page>
    </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        options: {
          licenseKey: 'YOUR_KEY_HERE',
          afterLoad: this.afterLoad,
          scrollOverflow: false,
          scrollBar: false,
          menu: '#menu',
          navigation: true,
          anchors: ['home', 'product', 'service','aboutus','contactus'],
          sectionsColor: ['#05386b','#0798ec', '#ff5f45', '#47a4cd', '#ffbcbc']
        },
        produkk:[],
        page: 1,
        itemsPerPage: 4,
        itemsPerPageArray: [8],
        search:'',
        sortBy:[],
        layanan:[],
      }
    },
    computed: {
      numberOfPages () {
        return Math.ceil(this.produkk.length / this.itemsPerPage)
      },
    },
    methods: {
      sort (props) {
      if (props === this.sortBy) {
        // reverse sort order if requested sort is the same as current
        this.sortDirection = this.sortDirection === 'ascending' ? 'descending' : 'ascending';
      } else {
        // otherwise sort order is ascending
        this.sortDirection = 'ascending';
      }
      this.sortBy = props;
      this.produkk.sort((a, b) => {
        if (parseInt(a[props]) === parseInt(b[props])) {
        } else if (parseInt(a[props]) < b[props]) {
          return this.sortDirection === 'ascending' ? -1 : 1;
        } else if (parseInt(a[props]) > b[props]) {
          return this.sortDirection === 'ascending' ? 1 : -1;
        }
      });
    },
    getData(){
      var uri = this.$apiUrl + '/produk'
      var uri2 = this.$apiUrl + '/layanan'
      this.$http.get(uri).then(response =>{
      this.produkk=response.data.Data
      }) 
      this.$http.get(uri2).then(response =>{
      this.layanan=response.data.Data
      })
    },
    nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
    },
    mounted() {
        this.getData();
    },
  }
</script>

<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .section{
    text-align: center;
    position: relative;
  }
  .center-screen {
    display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  }
  .button{
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: -50vh;
    
  }
  h1 {
    font: 600 1.5em/1 'Raleway', sans-serif;
    color: rgba(0,0,0,.5);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: .5em;
    position: absolute;
    width: 100%;
  }

.span1, .span1:after {
    font-weight: 900;
    color: #efedce;
    white-space: nowrap;
    display: inline-block;
    position: relative;
    letter-spacing: .1em;
    padding: .2em 0 .25em 0;
}

.span1 {
    font-size: 4em;
    z-index: 100;
    text-shadow: .04em .04em 0 #9cb8b3;
} 
</style>
