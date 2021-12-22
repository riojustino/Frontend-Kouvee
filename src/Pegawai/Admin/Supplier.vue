<template>
  <v-container grid-list-md fluid mb-1 mt-2>
      <v-container fluid>
        <h2 class="text-md-center">Data Supplier</h2>
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
            Tambah Supplier</v-btn>           
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
    :items="suppliers"
    :search="keyword"
    :items-per-page="10"
    light
    class="elevation-1"
    >
    <template v-slot:body="{ items }">
      <tbody >
        <tr v-for="(item,index) in items" :key="item.ID_SUPPLIER">
          <td>{{index+1}}</td>
          <td >{{item.NAMA_SUPPLIER}}</td>
          <td >{{item.ALAMAT_SUPPLIER}}</td>
          <td >{{item.PHONE_SUPPLIER}}</td>
          <TD>{{item.NAMA_PEGAWAI}}</TD>
          <td >{{item.CREATE_AT_SUPPLIER}}</td>
          <td>{{item.UPDATE_AT_SUPPLIER}}</td>
          <td>{{item.DELETE_AT_SUPPLIER}}</td>
          <td class="text-center"> 
            <v-btn icon color="indigo" light @click="editHandler(item)" >
              <v-icon>mdi-pencil</v-icon> 
            </v-btn> 
            <v-btn icon color="error" light @click="deleteData(item.ID_SUPPLIER)" > 
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
          <span class="headline">Supplier</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field color="blue" label="Nama Supplier" v-model="form.nama_supplier" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Alamat Supplier" v-model="form.alamat_supplier" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field color="blue" label="Phone Supplier" v-model="form.phone_supplier" required></v-text-field>
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
    items: [],
    typeInput: 'new',
    keyword: '',
    form:{
      id_pegawai: 1,
      nama_supplier: "",
      alamat_supplier:"",
      phone_supplier:"",
    },
    errors:"",
    headers: [
      {
      text: 'NO',
      align: 'start',
      sortable: true,
      value: 'ID_SUPPLIER',
      },
      { text: 'Nama Supplier', value: 'NAMA_SUPPLIER' },
      { text: 'Alamat Supplier', value: 'ALAMAT_SUPPLIER' },
      { text: 'Phone Supplier', value: 'PHONE_SUPPLIER' },
      { text: 'Nama Pegawai', value: 'NAMA_PEGAWAI' },
      { text: 'Create At Supplier', value: 'create_at_supplier' },
      { text: 'Update At Supplier', value: 'update_at_supplier' },
      { text: 'Delete At Supplier', value: 'delete_at_supplier' },
      { text: 'Action', value: 'action' },
    ],
    suppliers: [],
    supplier: new FormData,
    snackbar: false,
    color: null,
    text: '',
    load: false,
    updatedId:""
    }),
  methods: {
    sendData(){ 
      this.supplier.append('id_pegawai', this.$session.get('id')); 
      this.supplier.append('nama_supplier', this.form.nama_supplier);
      this.supplier.append('alamat_supplier', this.form.alamat_supplier);
      this.supplier.append('phone_supplier', this.form.phone_supplier);
      var uri = this.$apiUrl + '/supplier' 
      this.load = true;
      this.$http.post(uri,this.supplier).then(response =>{ 
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
      id_pegawai: this.$session.get('id'),
      nama_supplier: this.form.nama_supplier,
      alamat_supplier: this.form.alamat_supplier,
      phone_supplier: this.form.phone_supplier,
    };
    const confih={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    var uri =this.$apiUrl + '/supplier/' + this.updatedId
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
      var uri = this.$apiUrl + '/supplier/' + deleteId;
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
          var uri = this.$apiUrl + '/supplier'
          this.$http.get(uri,this.ukurans).then(response => {
          this.suppliers = response.data.Data
          })
        }
      }
    },
    editHandler(item) {
      this.typeInput = "edit";
      this.form.nama_supplier = item.NAMA_SUPPLIER;
      this.form.alamat_supplier = item.ALAMAT_SUPPLIER;
      this.form.phone_supplier = item.PHONE_SUPPLIER;
      (this.updatedId = item.ID_SUPPLIER);
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
        id_pegawai: 0,
        nama_supplier:'',
        alamat_supplier:'',
        phone_supplier:0,
      };
    }
  },
  mounted() {
    this.getData();
  }
}
</script>
