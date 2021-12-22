<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Pelanggan</h2>
        <v-layout row wrap style="margin:10px">
          <v-flex xs6>
            <v-btn
            depressed
            dark
            rounded
            :disabled="dis"
            style="text-transform: none !important;"
            color = "green accent-3"
            @click="dialog = true">               
              <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>                   
            Tambah Pelanggan</v-btn>           
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
    :items="pelanggans"
    :items-per-page="10"
    :search="keyword"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_PELANGGAN">
          <td>{{index+1}}</td>
          <td >{{item.NAMA_PELANGGAN}}</td>
          <td >{{item.PHONE_PELANGGAN}}</td>
          <td >{{item.ALAMAT_PELANGGAN}}</td>
          <td >{{item.TGL_LAHIR_PELANGGAN}}</td>
          <td >{{item.NAMA_PEGAWAI}}</td>
          <td>{{item.CREATE_AT_PELANGGAN}}</td>
          <td>{{item.UPDATE_AT_PELANGGAN}}</td>
          <td>{{item.DELETE_AT_PELANGGAN}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_PELANGGAN)" > 
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
          <span class="headline">Pelanggan</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Pelanggan" v-model="form.nama_pelanggan" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Phone Pelanggan" v-model="form.phone_pelanggan" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="form.tanggal_lahir_pelanggan"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.tanggal_lahir_pelanggan"
                      label="Tanggal Lahir Pelanggan"
                      prepend-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.tanggal_lahir_pelanggan" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="red" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="red" @click="$refs.menu.save(form.tanggal_lahir_pelanggan)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Alamat Pelanggan" v-model="form.alamat_pelanggan" required></v-text-field>
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
    dis:false,
    keyword: '',
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    form:{
      id_pegawai:1,
      nama_pelanggan: "",
      alamat_pelanggan:"",
      phone_pelanggan:"",
      tanggal_lahir_pelanggan:new Date().toISOString().substr(0, 10),
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      sortable: false,
      value: 'ID_PELANGGAN',
      },
      { text: 'Nama Pelanggan', value: 'NAMA_PELANGGAN',sortable: false },
      { text: 'Phone Pelanggan', value: 'PHONE_PELANGGAN',sortable: false },
      { text: 'Alamat Pelanggan', value: 'ALAMAT_PELANGGAN',sortable: false },
      { text: 'Tanggal Lahir Pelanggan', value: 'TGL_LAHIR_PELANGGAN',sortable: false },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI',sortable: false },
      { text: 'Create At Pegawai', value: 'create_at_pelanggan',sortable: false },
      { text: 'Update At Pegawai', value: 'update_at_pelanggan',sortable: false },
      { text: 'Delete At Pegawai', value: 'delete_at_pelanggan',sortable: false},
      { text: 'Action', value: 'action',sortable: false },
    ],
    pelanggans: [],
    pelanggan: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    updatedId:""
    }),
  methods: {
    sendData(){ 
      this.pelanggan.append('id_pegawai', this.$session.get('id'));
      this.pelanggan.append('nama_pelanggan', this.form.nama_pelanggan);
      this.pelanggan.append('tgl_lahir_pelanggan', this.form.tanggal_lahir_pelanggan);
      this.pelanggan.append('alamat_pelanggan', this.form.alamat_pelanggan);
      this.pelanggan.append('phone_pelanggan', this.form.phone_pelanggan);
      var uri = this.$apiUrl + '/pelanggan' 
      this.load = true;
      this.$http.post(uri,this.pelanggan).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false 
        this.getData(); 
        this.resetForm(); 
      }).catch(error =>{ 
        this.errors = error;
        console.log(this.error);
        this.snackbar = true; 
        this.text = error.response.Message; 
        this.color = 'red'; 
        this.load = false; 
      }) 
    },
    updateData(){ 
      const qs = require('qs');
      const data = {
        id_pegawai: this.$session.get('id'),
        tgl_lahir_pelanggan:this.form.tanggal_lahir_pelanggan,
        alamat_pelanggan:this.form.alamat_pelanggan,
        phone_pelanggan:this.form.phone_pelanggan,
        nama_pelanggan:this.form.nama_pelanggan
      };
      const confih={
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      var uri =this.$apiUrl + '/pelanggan/' + this.updatedId
      // console.log(this.form.jabatan);
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
        console.log(this.errors) 
        this.snackbar = true; 
        this.text = 'Try Again'; 
        this.color = 'red'; 
        this.load = false; 
      }) 
    },
    deleteData(deleteId) {
      var uri = this.$apiUrl + '/pelanggan/' + deleteId;
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
        if (this.$session.get('role') != 'CS') {
          this.dis = true ;
        }else{
          var uri = this.$apiUrl + '/pelanggan'
          this.$http.get(uri,this.pelanggan).then(response => {
          this.pelanggans = response.data.Data
          })
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_pelanggan = item.NAMA_PELANGGAN;
      this.form.alamat_pelanggan = item.ALAMAT_PELANGGAN;
      this.form.tanggal_lahir_pelanggan = item.TGL_LAHIR_PELANGGAN;
      this.form.phone_pelanggan = item.PHONE_PELANGGAN;
      (this.updatedId = item.ID_PELANGGAN);
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
        id_pegawai:1,
        nama_pelanggan: "",
        alamat_pelanggan:"",
        phone_pelanggan:"",
        tanggal_lahir_pelanggan:"",
      };
    },
  },
  mounted() {
    this.getData();
  },
}
</script>