<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Hewan</h2>
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
            Tambah Hewan</v-btn>           
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
    :items="hewans"
    :items-per-page="10"
    :search="keyword"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_HEWAN">
          <td>{{index+1}}</td>
          <td >{{item.NAMA_HEWAN}}</td>
          <td >{{item.JENISHEWAN}}</td>
          <td >{{item.TGL_LAHIR_HEWAN}}</td>
          <td >{{item.NAMA_PELANGGAN}}</td>
          <td >{{item.NAMA_PEGAWAI}}</td>
          <td>{{item.CREATE_AT_HEWAN}}</td>
          <td>{{item.UPDATE_AT_HEWAN}}</td>
          <td>{{item.DELETE_AT_HEWAN}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_HEWAN)" > 
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
          <span class="headline">Hewan</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Hewan" v-model="form.nama_hewan" required></v-text-field>
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
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="form.tanggal_lahir_hewan"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.tanggal_lahir_hewan"
                      label="Tanggal Lahir Hewan"
                      prepend-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.tanggal_lahir_hewan" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-select
                    v-model="form.cust"
                    :items="pelanggans"
                    item-text="NAMA_PELANGGAN"
                    item-value="ID_PELANGGAN"
                    label= "Nama Pelanggan"
                    persistent-hint
                    return-object
                    single-line
                ></v-select>
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
    dis:false,
    typeInput: 'new',
    keyword: '',
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    form:{
      id_pegawai:1,
      nama_hewan: "",
      jenishewan: {JENISHEWAN:"",ID_JENISHEWAN:0},
      cust: {NAMA_PELANGGAN:"",ID_PELANGGAN:0},
      tanggal_lahir_hewan:"",
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      sortable: false,
      value: 'ID_HEWAN',
      },
      { text: 'Nama Hewan', value: 'NAMA_HEWAN',sortable: false, },
      { text: 'Jenis Hewan', value: 'JENISHEWAN',sortable: false, },
      { text: 'Tanggal Lahir Hewan', value: 'TGL_LAHIR_HEWAN',sortable: false, },
      { text: 'Nama Pelanggan', value: 'NAMA_PELANGGAN',sortable: false, },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI',sortable: false, },
      { text: 'Create At Hewan', value: 'create_at_hewan',sortable: false },
      { text: 'Update At Hewan', value: 'update_at_hewan',sortable: false },
      { text: 'Delete At Hewan', value: 'delete_at_hewan',sortable: false },
      { text: 'Action', value: 'action',sortable: false },
    ],
    hewans: [],
    jenishewans:[],
    pelanggans:[],
    hewan: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    updatedId:""
    }),
  methods: {
    sendData(){ 
      this.hewan.append('id_pegawai', this.$session.get('id'));
      this.hewan.append('id_pelanggan', this.form.cust.ID_PELANGGAN);
      this.hewan.append('id_jenishewan', this.form.jenishewan.ID_JENISHEWAN);
      this.hewan.append('nama_hewan', this.form.nama_hewan);
      this.hewan.append('tgl_lahir_hewan', this.form.tanggal_lahir_hewan);
      var uri = this.$apiUrl + '/hewan' 
      this.load = true;
      this.$http.post(uri,this.hewan).then(response =>{ 
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
        id_jenishewan:this.form.jenishewan.ID_JENISHEWAN,
        id_pelanggan:this.form.cust.ID_PELANGGAN,
        nama_hewan:this.form.nama_hewan,
        tgl_lahir_hewan:this.form.tanggal_lahir_hewan,
      };
      const confih={
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      var uri =this.$apiUrl + '/hewan/' + this.updatedId
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
      var uri = this.$apiUrl + '/hewan/' + deleteId;
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
          var uri = this.$apiUrl + '/hewan'
          var uri2= this.$apiUrl+'/jenishewan'
          var uri3= this.$apiUrl+'/pelanggan'
          this.$http.get(uri,this.hewans).then(response => {
              this.hewans = response.data.Data
          });
          this.$http.get(uri2,this.jenishewans).then(response => {
              this.jenishewans = response.data.Data
          });
          this.$http.get(uri3,this.pelanggans).then(response => {
              this.pelanggans = response.data.Data
          });
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_hewan = item.NAMA_HEWAN;
      this.form.tanggal_lahir_hewan = item.TGL_LAHIR_HEWAN;
      this.form.jenishewan.JENISHEWAN = item.JENISHEWAN;
      this.form.jenishewan.ID_JENISHEWAN = item.ID_JENISHEWAN;
      this.form.cust.NAMA_PELANGGAN = item.NAMA_PELANGGAN;
      this.form.cust.ID_PELANGGAN = item.ID_PELANGGAN;
      (this.updatedId = item.ID_HEWAN);
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
        nama_hewan: "",
        jenishewan: {JENISHEWAN:"",ID_JENISHEWAN:0},
        cust: {NAMA_PELANGGAN:"",ID_PELANGGAN:0},
        tanggal_lahir_pelanggan:"",
      };
    },
  },
  mounted() {
    this.getData();
  },
}
</script>