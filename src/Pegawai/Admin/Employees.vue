<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Pegawai</h2>
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
            Tambah Pegawai</v-btn>           
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
    :items="pegawais"
    :items-per-page="10"
    :search="keyword"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_PEGAWAI">
          <td>{{index+1}}</td>
          <td >{{item.NAMA_PEGAWAI}}</td>
          <td >{{item.JABATAN}}</td>
          <td >{{item.PHONE_PEGAWAI}}</td>
          <td >{{item.ALAMAT_PEGAWAI}}</td>
          <td >{{item.TGL_LAHIR_PEGAWAI}}</td>
          <td :type="'password'">{{item.PASSWORD}}</td>
          <td>{{item.CREATE_AT_PEGAWAI}}</td>
          <td>{{item.UPDATE_AT_PEGAWAI}}</td>
          <td>{{item.DELETE_AT_PEGAWAI}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_PEGAWAI)" > 
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
          <span class="headline">Pegawai</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Pegawai" v-model="form.nama_pegawai" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="form.jabatan"
                  :items="jabatan"
                  label="Jabatan"
                  dense
                ></v-select>
                <!-- <v-text-field label="Jabatan" v-model="form.jabatan" required></v-text-field> -->
              </v-col>
              <v-col cols="12">
                <v-text-field 
                label="Phone Pegawai" 
                v-model="form.phone_pegawai" 
                :rules="rules"
                counter="12"
                color="blue"
                required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="form.tanggal_lahir_pegawai"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="form.tanggal_lahir_pegawai"
                      label="Tanggal Lahir Pegawai"
                      prepend-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.tanggal_lahir_pegawai" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="blue" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="blue" @click="$refs.menu.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Alamat Pegawai" v-model="form.alamat_pegawai" required></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-text-field label="Password" color="blue" v-model="form.password" required></v-text-field>
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
    dis: false,
    items: [],
    jabatan:['Admin','Kasir','CS'],
    rules: [v => v.length <= 12 || 'Max 12 '],
    typeInput: 'new',
    keyword: '',
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    form:{
      nama_pegawai: "",
      alamat_pegawai:"",
      phone_pegawai:"",
      jabatan:"",
      tanggal_lahir_pegawai:"",
      password:"",
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      sortable: false,
      value: 'ID_PEGAWAI',
      },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI',sortable: false },
      { text: 'Jabatan', value: 'JABATAN',sortable: false },
      { text: 'Phone Pegawai', value: 'PHONE_PEGAWAI',sortable: false },
      { text: 'Alamat Pegawai', value: 'ALAMAT_PEGAWAI',sortable: false },
      { text: 'Tanggal Lahir Pegawai', value: 'TGL_LAHIR_PEGAWAI',sortable: false },
      { text: 'Password', value: 'PASSWORD',sortable: false },
      { text: 'Create At Pegawai', value: 'create_at_pegawai',sortable: false },
      { text: 'Update At Pegawai', value: 'update_at_pegawai',sortable: false },
      { text: 'Delete At Pegawai', value: 'delete_at_pegawai',sortable: false },
      { text: 'Action', value: 'action',sortable: false },
    ],
    pegawais: [],
    pegawai: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    updatedId:""
    }),
  methods: {
    sendData(){ 
      this.pegawai.append('nama_pegawai', this.form.nama_pegawai);
      this.pegawai.append('jabatan', this.form.jabatan);
      this.pegawai.append('tgl_lahir_pegawai', this.form.tanggal_lahir_pegawai);
      this.pegawai.append('alamat_pegawai', this.form.alamat_pegawai);
      this.pegawai.append('phone_pegawai', this.form.phone_pegawai);
      this.pegawai.append('password', this.form.password);
      var uri = this.$apiUrl + '/pegawai' 
      this.load = true;
      this.$http.post(uri,this.pegawai).then(response =>{ 
        this.snackbar = true; 
        this.color = 'green'; 
        this.text = response.data.Message; 
        this.load = false; 
        this.dialog = false 
        this.getData(); 
        this.resetForm(); 
      }).catch(error =>{ 
        this.errors = error;
        this.snackbar = true; 
        this.text = error.response.Message; 
        this.color = 'red'; 
        this.load = false; 
      }) 
    },
    updateData(){ 
      const qs = require('qs');
      const data = {
        nama_pegawai: this.form.nama_pegawai,
        jabatan: this.form.jabatan,
        tgl_lahir_pegawai:this.form.tanggal_lahir_pegawai,
        alamat_pegawai:this.form.alamat_pegawai,
        phone_pegawai:this.form.phone_pegawai,
        password:this.form.password
      };
      const confih={
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      var uri =this.$apiUrl + '/pegawai/' + this.updatedId
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
      var uri = this.$apiUrl + '/pegawai/' + deleteId;
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
          var uri = this.$apiUrl + '/pegawai'
          this.$http.get(uri,this.pegawais).then(response => {
          this.pegawais = response.data.Data
          })
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_pegawai = item.NAMA_PEGAWAI;
      this.form.alamat_pegawai = item.ALAMAT_PEGAWAI;
      this.form.jabatan = item.JABATAN;
      this.form.tanggal_lahir_pegawai = item.TGL_LAHIR_PEGAWAI;
      this.form.phone_pegawai = item.PHONE_PEGAWAI;
      this.form.password = item.PASSWORD;
      (this.updatedId = item.ID_PEGAWAI);
      this.dialog = true;
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
        nama_pegawai: "",
        alamat_pegawai:"",
        phone_pegawai:0,
        jabatan:"",
        tanggal_lahir_pegawai:"",
        password:"",
      };
    },
  },
  mounted() {
    this.getData();
  },
}
</script>