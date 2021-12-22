<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Layanan</h2>
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
            Tambah Layanan</v-btn>           
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
    :items="layanans"
    :items-per-page="10"
    :search="keyword"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_LAYANAN">
          <td>{{index+1}}</td>
          <td>{{item.NAMA_LAYANAN}}</td>
          <td >{{item.UKURAN}}</td>
          <td>{{item.JENISHEWAN}}</td>
          <td>{{item.HARGA_LAYANAN}}</td>
          <td>{{item.NAMA_PEGAWAI}}</td>
          <td >{{item.CREATE_AT_LAYANAN}}</td>
          <td>{{item.UPDATE_AT_LAYANAN}}</td>
          <td>{{item.DELETE_AT_LAYANAN}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_LAYANAN)" > 
              <v-icon>mdi-delete</v-icon> 
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>  
    </v-data-table>
    <v-dialog light v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Layanan</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Layanan" v-model="form.nama_layanan" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="form.ukuran"
                    :items="ukurans"
                    item-text="UKURAN"
                    item-value="ID_UKURAN"
                    label= "Ukuran"
                    persistent-hint
                    return-object
                    single-line
                ></v-select>
                <!-- <v-text-field label="Ukuran" v-model="form.ukuran" required></v-text-field> -->
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="form.jenishewan"
                    :items="jenishewans"
                    item-text="JENISHEWAN"
                    item-value="ID_JENISHEWAN"
                    label= "Jenis Hewan"
                    persistent-hint
                    return-object
                    single-line
                ></v-select>
                <!-- <v-text-field label="Jenis Hewan" v-model="form.jenishewan" required></v-text-field> -->
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Harga Layanan" v-model="form.hargalayanan" required></v-text-field>
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
    items: [],
    typeInput: 'new',
    keyword: '',
    form:{
      id_pegawai: 1,
      nama_layanan: "",
      jenishewan: {JENISHEWAN:"",ID_JENISHEWAN:0},
      ukuran: {UKURAN:"",ID_UKURAN:0},
      hargalayanan:0,
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      sortable: false,
      value: 'id_produk',
      },
      { text: 'Nama Layanan', value: 'NAMA_LAYANAN',sortable: false },
      { text: 'Ukuran', value: 'UKURAN',sortable: false },
      { text: 'Jenis Hewan', value: 'JENISHEWAN',sortable: false },
      { text: 'Harga Layanan', value: 'HARGA_LAYANAN',sortable: true },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI',sortable: false },
      { text: 'Create At Layanan', value: 'create_at_layanan',sortable: false },
      { text: 'Update At Layanan', value: 'update_at_layanan',sortable: false },
      { text: 'Delete At Layanan', value: 'delete_at_layanan',sortable: false },
      { text: 'Action', value: 'action',sortable: false },
    ],
    layanans: [],
    jenishewans:[],
    ukurans:[],
    layanan: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    updatedId:"",
    dis:false
    }),
  methods: {
    sendData(){ 
      this.layanan.append('id_pegawai', this.$session.get('id')); 
      this.layanan.append('nama_layanan', this.form.nama_layanan); 
      this.layanan.append('harga_layanan', this.form.hargalayanan); 
      this.layanan.append('id_ukuran', this.form.ukuran.ID_UKURAN); 
      this.layanan.append('id_jenishewan', this.form.jenishewan.ID_JENISHEWAN);
      var uri =this.$apiUrl + '/layanan' 
      this.load = true;
      this.$http.post(uri,this.layanan).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false 
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
    const qs = require('qs');
    const data = {
        nama_layanan: this.form.nama_layanan,
        id_ukuran: this.form.ukuran.ID_UKURAN,
        id_jenishewan: this.form.jenishewan.ID_JENISHEWAN,
        id_pegawai:this.$session.get('id'),
        harga_layanan:this.form.hargalayanan,
    };
    console.log(data);
    const confih={
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    var uri =this.$apiUrl + '/layanan/' + this.updatedId
    console.log(uri);
    this.load = true;
    this.$http.put(uri,qs.stringify(data),confih).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false 
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
      var uri = this.$apiUrl + '/layanan/' + deleteId;
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
          var uri = this.$apiUrl + '/layanan'
          var uri2 = this.$apiUrl + '/JenisHewan'
          var uri3 = this.$apiUrl + '/ukuran'
          this.$http.get(uri,this.layanans).then(response => {
          this.layanans = response.data.Data
          // console.log(this.layanans);
          });
          this.$http.get(uri2,this.jenishewans).then(response => {
          this.jenishewans = response.data.Data
          });
          this.$http.get(uri3,this.ukurans).then(response => {
          this.ukurans = response.data.Data
          });
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_layanan = item.NAMA_LAYANAN;
      this.form.hargalayanan=item.HARGA_LAYANAN;
      this.form.jenishewan.JENISHEWAN=item.JENISHEWAN;
      this.form.jenishewan.ID_JENISHEWAN=item.ID_JENISHEWAN;
      this.form.ukuran.UKURAN=item.UKURAN;
      this.form.ukuran.ID_UKURAN=item.ID_UKURAN;
      console.log(this.form);
      (this.updatedId = item.ID_LAYANAN);
      this.dialog = true;
    },
    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else {
        console.log("dddd");
        this.updateData();
      }
    },
    resetForm() {
      this.form = {
        id_pegawai: 1,
        nama_layanan: "",
        ukuran: 0,
        jenishewan: {JENISHEWAN:"",ID_JENISHEWAN:0},
        ukuran: {UKURAN:"",ID_UKURAN:0},
        hargalayanan:0,
      };
    }
  },
  mounted() {
    this.getData();
  }
}
</script>