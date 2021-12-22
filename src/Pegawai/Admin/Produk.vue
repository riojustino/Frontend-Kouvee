<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Produk</h2>
        <v-layout row wrap style="margin:10px">
          <v-flex xs6>
            <v-btn
            depressed
            dark
            rounded
            style="text-transform: none !important;"
            color = "green accent-3"
            :disabled="dis"
            @click="dialog = true">               
              <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>                   
            Tambah Produk</v-btn>           
          </v-flex>           
          <v-flex xs6 class="text-right">               
            <v-text-field                 
            v-model="keyword"                 
            append-icon="mdi-search"                 
            label="Search"                 
            hide-details>
            </v-text-field>       
          </v-flex>
        </v-layout>
      </v-container>
    <v-data-table
    :headers="headers"
    :items="produks"
    :items-per-page="10"
    :search="keyword"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_PRODUK">
          <td>{{index+1}}</td>
          <td>
            <v-img      
            :src= '$apiGambar + item.GAMBAR'
            class="grey lighten-2"
            width="80"
            height="80" 
          ></v-img>
          </td>
          <td >{{item.NAMA_PRODUK}}</td>
          <td> <v-chip :color="getColor(item.STOCK,item.MIN_STOCK)">{{item.STOCK}}</v-chip></td>
          <td>{{item.MIN_STOCK}}</td>
          <td>{{item.SATUAN_PRODUK}}</td>
          <td>{{item.HARGA_BELI}}</td>
          <td>{{item.HARGA_JUAL}}</td>
          <td>{{item.NAMA_PEGAWAI}}</td>
          <td >{{item.CREATE_AT_PRODUK}}</td>
          <td>{{item.UPDATE_AT_PRODUK}}</td>
          <td>{{item.DELETE_AT_PRODUK}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_PRODUK)" > 
              <v-icon>mdi-delete</v-icon> 
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>  
    </v-data-table>
    <v-dialog light="" v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Produk</span>
        </v-card-title>
        <v-card-text>
          <v-container >
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Produk" v-model="form.nama_produk" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Min Stock" v-model="form.min_stock" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Stock" v-model="form.stock" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Satuan Produk" v-model="form.satuan_produk" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Harga Beli" v-model="form.harga_beli" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Harga Jual" v-model="form.harga_jual" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-checkbox v-model="cek" class="mx-2" label="Unable To Upload Foto"></v-checkbox>
                <v-file-input v-model="form.gambar" label="Select Image File*"
                  accept="image/png, image/jpeg, image/bmp, image/jpg" 
                  prepend-icon="mdi-camera" :disabled="cek">
                </v-file-input>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
      {{ text }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dis:false,
    cek:true,
    items: [],
    typeInput: 'new',
    keyword: '',
    form:{
      nama_produk: "",
      stock: 0,
      min_stock: 0,
      satuan_produk:"",
      harga_beli:0,
      harga_jual:0,
      gambar:null
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      value: 'id_produk',
      },
      { text: '', value: 'GAMBAR',sortable: false },
      { text: 'Nama Produk', value: 'NAMA_PRODUK',sortable: false },
      { text: 'Stock', value: 'STOCK',sortable: true},
      { text: 'Min Stock', value: 'MIN_STOCK',sortable: true },
      { text: 'Satuan Produk', value: 'SATUAN_PRODUK',sortable: false },
      { text: 'Harga beli', value: 'HARGA_BELI',sortable: true },
      { text: 'Harga Jual', value: 'HARGA_JUAL',sortable: true },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI',sortable: true },
      { text: 'Create At Produk', value: 'create_at_produk',sortable: false },
      { text: 'Update At Produk', value: 'update_at_produk',sortable: false },
      { text: 'Delete At Produk', value: 'delete_at_produk',sortable: false },
      { text: 'Action', value: 'action',sortable: false },
    ],
    produks: [],
    produk: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    temp:'',
    updatedId:"",
    }),
  methods: {
    sendData(){ 
      this.produk.append('id_pegawai', this.$session.get('id')); 
      this.produk.append('nama_produk', this.form.nama_produk); 
      this.produk.append('stock', this.form.stock); 
      this.produk.append('min_stock', this.form.min_stock); 
      this.produk.append('satuan_produk', this.form.satuan_produk);
      this.produk.append('harga_beli', this.form.harga_beli);
      this.produk.append('harga_jual', this.form.harga_jual);
      this.produk.append('gambar',this.form.gambar);
      var uri =this.$apiUrl + '/produk' 
      this.load = true;
      this.$http.post(uri,this.produk).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false
        this.cek=true 
        this.getData(); 
        this.resetForm(); 
      }).catch(error =>{ 
        this.errors = error 
        this.snackbar = true; 
        this.text = 'Try Again'; 
        this.color = 'red'; 
        this.load = false; 
      }) 
    },
    updateData(){ 
      this.produk.append('id_pegawai', this.$session.get('id')); 
      this.produk.append('nama_produk', this.form.nama_produk); 
      this.produk.append('stock', this.form.stock); 
      this.produk.append('min_stock', this.form.min_stock); 
      this.produk.append('satuan_produk', this.form.satuan_produk);
      this.produk.append('harga_beli', this.form.harga_beli);
      this.produk.append('harga_jual', this.form.harga_jual);
      if(this.cek){
        this.produk.append('gambar',this.temp);
        console.log(this.temp);
      }else{
        this.produk.append('gambar',this.form.gambar);
        console.log(this.form.gambar);
      } 
      var uri =this.$apiUrl + '/produk/' + this.updatedId
      this.load = true;
      this.$http.post(uri,this.produk).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false
        this.cek=true 
        this.getData(); 
        this.resetForm(); 
      }).catch(error =>{ 
        this.errors = error 
        this.snackbar = true; 
        this.text = 'Try Again'; 
        this.color = 'red'; 
        this.load = false; 
      }) 
    },
    deleteData(deleteId) {
      var uri = this.$apiUrl + '/produk/' + deleteId;
      this.$http.delete(uri).then(response => {
        this.snackbar = true;
        this.text = response.data.Message;
        this.color = "green";
        this.deleteDialog = false;
        this.getData();
      })
      .catch(error => {
        this.errors = error;
        this.snackbar = true;
        this.text = "Try Again";
        this.color = "red";
      });
    },  
    getData(){
      if (!this.$session.exists()) {
      this.$router.push('/login');
      }else{
        if (this.$session.get('role') != 'Admin') {
          this.dis = true ;
        }else{  
          var uri = this.$apiUrl + '/produk'
          this.$http.get(uri,this.produks).then(response => {
          this.produks = response.data.Data
          })
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_produk = item.NAMA_PRODUK;
      this.form.stock=item.STOCK;
      this.form.min_stock=item.MIN_STOCK;
      this.form.satuan_produk=item.SATUAN_PRODUK;
      this.form.harga_beli=item.HARGA_BELI;
      this.form.harga_jual=item.HARGA_JUAL;
      this.form.gambar= item.GAMBAR;
      this.temp = item.GAMBAR;
      (this.updatedId = item.ID_PRODUK);
      this.dialog = true;
    },
    getColor(stock,min) {
      var a = parseInt(stock);
      var b = parseInt(min);
      if (a > b) {
        return 'green'
      }
      else
        return 'red'
    },
    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else {
        
        this.updateData();
      }
    },
    resetForm() {
      this.form = {
        
        nama_produk: '',
        stock: 0,
        min_stock: 0,
        satuan_produk:'',
        harga_beli:0,
        harga_jual:0,
        gambar:''
      };
    },
  },
  mounted() {
    this.getData();
  }
}
</script>