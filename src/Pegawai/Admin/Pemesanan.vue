<template>
<v-layout>
    <v-container fluid v-if="lihat">
        <h2 style="color:white" class="text-md-center">Data Pemesanan</h2>
        <v-layout row wrap style="margin:10px">
            <v-flex xs6>
                <v-btn depressed dark rounded :disabled="dis" style="text-transform: none !important;" color="green accent-3" @click="tambah=true;lihat=false">
                    <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                    Tambah Pesanan
                </v-btn>
            </v-flex>
            <v-flex xs6 class="text-right">
                <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                </v-text-field>
            </v-flex>
        </v-layout>
        <v-data-table :headers="headers" :loading="load" :items="pemesanans" :search="keyword" :items-per-page="10" class="elevation-1" light>
            <template v-slot:body="{ items }">
                <tbody>
                    <tr v-for="(item,index) in items" :key="item.ID_PEMESANAN">
                        <td>{{index+1}}</td>
                        <td>{{item.ID_PEMESANAN}}</td>
                        <TD>{{item.NAMA_SUPPLIER}}</TD>
                        <Td>{{item.TANGGAL_PEMESANAN}}</Td>
                        <td>{{item.TOTAL}}</td>
                        <td><v-chip :color="getColor(item.STATUS_PEMESANAN)">{{(item.STATUS_PEMESANAN==1) ? 'Done':'On Progres'}}</v-chip></td>
                        <td class="text-start">
                            <v-btn :disabled="disbutton(item.STATUS_PEMESANAN)" icon color="indigo" light @click="editHandler(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn :disabled="disbutton(item.STATUS_PEMESANAN)" icon color="error" light @click="deleteData(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <v-btn icon color="error" light @click="cetak(item.ID_PEMESANAN)">
                                <v-icon>mdi-file-pdf</v-icon>
                            </v-btn>
                        </td>
                        <TD>
                            <v-btn :disabled="disbutton(item.STATUS_PEMESANAN)" color="green" light @click="ubahStatus(item)">
                                done
                            </v-btn>
                        </TD>
                    </tr>
                </tbody>
            </template>
        </v-data-table>
    </v-container>
    <v-flex hidden-sm-and-down md6 v-if="tambah">
            <v-btn depressed dark rounded :disabled="dis" style="text-transform: none !important;" color="green accent-3" @click="tambah=false;lihat=true" class="mt-5 ml-12">
                    <v-icon size="18" class="mr-2">mdi-keyboard-backspace</v-icon>
                    Lihat Table Pemesanan
            </v-btn>
        <v-data-iterator :items="Prodfilter" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
            <template v-slot:default="props">
                <v-row class="ml-1">
                    <v-col class="ml-5" v-for="item in props.items" :key="item.ID_TRANSAKSI_LAYANAN" cols="8" sm="6" md="3" lg="3">
                        <v-card class="mx-auto" min-width="200px" min-height="300px">
                            <v-list dense>
                                <v-img :src='$apiGambar + item.GAMBAR' height="200px">
                                </v-img>
                                <v-list-item>
                                    <v-list-item-content>Nama</v-list-item-content>
                                    <v-list-item-content class="align-end">: {{ item.NAMA_PRODUK }}</v-list-item-content>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-item-content>STOCK</v-list-item-content>
                                    <v-list-item-content class="align-end">: {{ item.STOCK}}</v-list-item-content>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-item-content>MIN</v-list-item-content>
                                    <v-list-item-content class="align-end">: {{ item.MIN_STOCK }}</v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-card-actions class="justify-content-center">
                                <v-btn color="green" text :disabled="cektambahproduk(item.ID_PRODUK)" @click="addRow(item)">
                                    ADD
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:footer>
                <v-row class="mb-12 justify-content-center">
                    <v-btn fab dark color="primary" class="mr-6" @click="formerPage">
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn fab dark color="primary" class="mr-7" @click="nextPage">
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </template>
        </v-data-iterator>
    </v-flex>
    <v-flex class="mt-12" v-if="tambah" align-content-space-between layout :pa-5="$vuetify.breakpoint.smAndDown" wrap>
        <v-layout justify-center>
            <v-flex>
                <div class="mt-5 mr-2">
                    <v-card v-if="before" class="mx-auto" width="100%" height="100%" outlined>
                        <div class="d-flex justify-content-center">
                            <v-card-title class="headline">FORM SUPPLIER</v-card-title>
                        </div>
                        <v-row class="mb-2 mt-5" justify="center" no-gutters>
                            <v-col md="auto">
                                <v-row>
                                    <v-col cols="4">
                                        <v-text-field solo flat label="Nama Supplier" readonly=""></v-text-field>
                                    </v-col>
                                    <v-col cols="8">
                                        <v-select v-model="tempSupplier" :items="Supplier" item-text="NAMA_SUPPLIER" item-value="ID_SUPPLIER" label="Nama" persistent-hint return-object solo></v-select>
                                    </v-col>
                                </v-row>
                                <div class="d-flex justify-content-end">
                                    <v-btn class="ma-2" color="success" @click="inputsupplier(formSupplier)" dark>CEK</v-btn>
                                </div>
                                <div>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field solo flat label="Nama Suplier" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="formSupplier.nama" solo label="Nama Supplier" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field solo flat label="Alamat" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="formSupplier.alamat" solo label="Alamat" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="4">
                                            <v-text-field solo flat label="Telepone" readonly></v-text-field>
                                        </v-col>
                                        <v-col cols="8">
                                            <v-text-field v-model="formSupplier.tele" solo label="Phone" readonly></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <div class="d-flex justify-content-end">
                                        <v-btn class="ma-2" color="success" @click="postpemesanan()">
                                            Submit
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card v-if="after" class="mx-auto" width="100%" height="100%" outlined>
                        <div class="d-flex justify-content-center">
                            <v-card-title class="headline">FORM PRODUK</v-card-title>
                        </div>
                        <v-container>
                            <v-row>
                                <v-col cols="5">
                                    <label>Produk</label>
                                </v-col>
                                <v-col cols="2">
                                    <label>Jumlah</label>
                                </v-col>
                                <v-col cols="2">
                                    <label>Satuan Harga</label>
                                </v-col>
                                <v-col cols="2">
                                    <label>Total Harga</label>
                                </v-col>
                            </v-row>
                            <v-row v-for="(row,index) in rows" :key="index">
                                <v-col cols="5">
                                    <v-text-field v-model="row.nama" solo readonly></v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field v-model="row.jumlah" solo v-on:keyup="keymonitor(index)"></v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field v-model="row.hargabeli" solo readonly></v-text-field>
                                </v-col>
                                <v-col cols="2">
                                    <v-text-field v-model="row.hargaTotal" solo readonly></v-text-field>
                                </v-col>
                                <v-col cols="1">
                                    <button class="btn btn-danger" @click="deleteRow(rows,index)">X</button>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <div class="d-flex justify-content-end">
                                        <v-btn class="ma-2" color="error" @click="canceltransaksi()">
                                            Cancel
                                        </v-btn>
                                        <v-btn class="ma-2" color="success" @click="postDetil()">
                                            Submit
                                        </v-btn>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </div>
            </v-flex>
        </v-layout>
    </v-flex>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="10000">
        {{ text }}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog light v-model="detildialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Data Transaksi</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="tambahdetil()">Tambah</v-btn>
            <v-data-table :headers="headers2" :items="buatedititem" :hide-default-footer="true" light class="elevation-1">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="(item,index) in items" :key="item.ID_DETIL_PEMESANAN">
                            <td>{{index+1}}</td>
                            <td>{{item.NAMA_PRODUK}}</td>
                            <td>{{item.JUMLAH_PESANAN}}</td>
                            <td>{{item.SUB_TOTAL_PEMESANAN}}</td>
                            <td class="text-start">
                            <v-btn icon color="indigo" light @click="editdetilHandler(item)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon color="error" light @click="deletedetilproduk(item.ID_DETIL_PEMESANAN)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </td>
                        </tr>
                    </tbody>
                </template>
            </v-data-table>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="restartbuatedititem()">Close</v-btn>
                <v-btn color="blue darken-1" text @click="restartbuatedititem()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog light v-model="editdetildialog" persistent max-width="600px">
            <v-card class="mx-auto" width="100%" height="100%" outlined>
                <div class="d-flex justify-content-center">
                    <v-card-title class="headline">Edit PRODUK</v-card-title>
                </div>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <label>Produk</label>
                        </v-col>
                        <v-col cols="6">
                            <label>Jumlah</label>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-select v-model="editdetilitem.editdetilproduk" :items="produks" item-text="NAMA_PRODUK" item-value="ID_PRODUK" label="Produk" persistent-hint return-object solo></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field v-model="editdetilitem.jumlah" solo ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div class="d-flex justify-content-end">
                                <v-btn class="ma-2" color="error" @click="editdetildialog=false">
                                    Cancel
                                </v-btn>
                                <v-btn class="ma-2" color="success" @click="sendeditdetil()">
                                    Submit
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
    </v-dialog>

</v-layout>
</template>

<script>
export default {
    data: () => ({
        dis:false,
        load:false,
        ///buattambah
        produks: [],
        tambah: false,
        before: true,
        after: false,
        indexes: 0,
        page: 1,
        itemsPerPage: 8,
        itemsPerPageArray: [2],
        snackbar: false,
        color: null,
        dialog: false,
        text: '',
        Supplier: [],
        idpemesanantemp: '', //tampungidygdikirm
        tempSupplier: [], //tampungygdipili
        formSupplier: {
            id: 0,
            nama: '',
            alamat: '',
            tele: ''
        },
        rows: [],
        temparray: [],
        supplierFrom: new FormData,
        ///lihat
        headers: [{
                text: 'NO',
                align: 'start',
                value: 'ID_UKURAN',
            },
            {
                text: 'ID Pemesanan',
                value: 'ID_PEMESANAN'
            },
            {
                text: 'Nama Supplier',
                value: 'NAMA_SUPPLIER'
            },
            {
                text: 'Tanggal',
                value: 'TANGGAL_PEMESANAN'
            },
            {
                text: 'Total',
                value: 'TOTAL'
            },
            {
                text: 'Status',
                value: 'STATUS_PEMESANAN'
            },
            {
                text: 'Action',
                value: 'action',
                align:'start'
            },
            {

            }
        ],
        headers2:[
            {
                text:'NO',
                value:'NO',
            },
            {
                text:'Nama Produk',
                value:'NAMA_PRODUK',
            },
            {
                text:'Jumlah',
                value:'JUMLAH_PRODUK'
            },
            {
                text:'Harga',
                value:'SUB_TOTAL_PEMESANAN'
            },
            {
                text:'Action',
            }

        ],
        pemesanans: [],
        keyword: '',
        lihat:true,
        //EDIT
        tampungnota:'',
        buatedititem:[],
        detildialog:false,
        editdetildialog:false,
        editdetilitem:{
            iddetil:0,
            editdetilproduk:{
                ID_PRODUK:0,
                NAMA_PRODUK:'',
            },
            jumlah:0,
        },
        detiltambah:false,
        transaksidetil : new FormData,
        tempdetilproduk:[],

    }),
    computed: {
        numberOfPages() {
            return Math.ceil(this.produks.length / this.itemsPerPage)
        },
        Prodfilter: function () {
            var i;
            return this.produks.filter(function (u) {
                if (parseInt(u.MIN_STOCK) > parseInt(u.STOCK)) {
                    return true;
                }
            })
        },

    },
    methods: {
        //lihat
        disbutton(i){
            if(i == 1){
                return true;
            }
            else
                return false
        },
        getColor(i){
            if(i == 1){
                return 'green';
            }
            else
                return 'blue';
        },
        resetformsupplier() {
            this.formSupplier = {
                id: 0,
                nama: '',
                alamat: '',
                tele: ''
            }
        },
        postpemesanan() {
            var url = this.$apiUrl + '/pemesanan';
            this.supplierFrom.append('id_supplier', this.formSupplier.id);
            console.log(this.formSupplier.id);
            this.$http.post(url, this.supplierFrom).then(response => {
                this.idpemesanantemp = response.data.Data;
                this.after = true;
                this.before = false;
                this.tempSupplier = [];
                this.resetformsupplier();
                // console.log(this.idpemesanantemp);
            }).catch(error => {
                this.errors = error;
                console.log('asdasd');
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
                this.load = false;
            })

        },
        cektambahproduk(id) {
            var c = this.produks.length;
            var i;
            var array = [];
            if (this.temparray.length != 0) {
                console.log(this.temparray);
                for (i = 0; i < this.temparray.length; i++) {
                    if (this.temparray[i] == id)
                        return true;
                }
            }
        },
        getData() {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Admin') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/produk'
                    this.$http.get(uri).then(response => {
                        this.produks = response.data.Data
                    });
                    uri = this.$apiUrl + '/supplier'
                    this.$http.get(uri).then(response => {
                        this.Supplier = response.data.Data
                    });
                    uri = this.$apiUrl + '/pemesanan'
                    this.$http.get(uri).then(response => {
                        this.pemesanans = response.data.Data
                    });
                }
            }
        },
        postDetil() {
            console.log('cek')
            var c = this.rows.length;
            var DETIL = new FormData;
            var x;
            console.log(c)
            var i = 0;
            for (; i < c; i++) {
                DETIL.append('id_pemesanan', this.idpemesanantemp);
                DETIL.append('id_produk', this.rows[i].id);
                DETIL.append('jumlah_pesanan', this.rows[i].jumlah);
                for (var pair of DETIL.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
                var uri = this.$apiUrl + '/DetilPemesanan'
                this.$http.post(uri, DETIL).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil Kode Pemesanan '+ this.idpemesanantemp;
                    this.dialog = false;
                    this.restartrows();
                    this.before = true;
                    this.after = false;
                    // this.formAktif = false;
                    // this.cekform = true;
                    this.getData();
                }).catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = 'Produk Harus Di Isi';
                    this.color = 'red';
                    this.load = false;
                })
                DETIL = new FormData;
            }
            DETIL = new FormData;
        },
        canceltransaksi() {
            var uri = this.$apiUrl + '/pemesanan/' + this.idpemesanantemp;
            this.$http.delete(uri).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = response.data.Message;
                this.dialog = false;
                this.before = true;
                this.after = false;
                this.tempSupplier = [];
            }).catch(error => {
                this.errors = error;
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
            })
            this.resetformsupplier();
        },
        inputsupplier() {
            this.formSupplier.id = this.tempSupplier.ID_SUPPLIER,
                this.formSupplier.nama = this.tempSupplier.NAMA_SUPPLIER,
                this.formSupplier.alamat = this.tempSupplier.ALAMAT_SUPPLIER,
                this.formSupplier.tele = this.tempSupplier.PHONE_SUPPLIER
        },
        nextPage() {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
        },
        formerPage() {
            if (this.page - 1 >= 1) this.page -= 1
        },
        updateItemsPerPage(number) {
            this.itemsPerPage = number
        },
        updatebtn(cek) {
            if (cek == 0) {
                return false
            } else
                return true

        },
        ///EDIT
        editHandler(item){
            var url = this.$apiUrl + '/detilpemesanan/' + item.ID_PEMESANAN;
            this.tempdetilproduk = item;
            this.tampungnota = item.ID_PEMESANAN;
            console.log(this.tampungnota);
            this.$http.get(url, this.buatedititem).then(response => (
                this.buatedititem = response.data.Data
            ));
            this.detildialog= true;
        },
         restartbuatedititem() {
            this.buatedititem = [];
            this.detildialog = false;
        },
        editdetilHandler(item){
            this.editdetilitem.iddetil=item.ID_DETIL_PEMESANAN,
            this.editdetilitem.editdetilproduk.ID_PRODUK=item.ID_PRODUK,
            this.editdetilitem.editdetilproduk.NAMA_PRODUK=item.NAMA_PRODUK,
            console.log(this.editdetilitem.editdetilproduk.NAMA_PRODUK);
            this.editdetilitem.jumlah=item.JUMLAH_PESANAN;
            this.editdetildialog=true;
        },
        sendeditdetil() {
            if (this.detiltambah != true) {
                var url = this.$apiUrl + '/detilpemesanan/' + this.editdetilitem.iddetil;
                this.transaksidetil.append('id_produk', this.editdetilitem.editdetilproduk.ID_PRODUK);
                this.transaksidetil.append('jumlah_pesanan', this.editdetilitem.jumlah);
                this.$http.post(url, this.transaksidetil).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.editdetildialog = false;
                    this.editHandler(this.tempdetilproduk);
                    this.getData();
                    this.restartdetilproduk();
                }).catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = error.response.Message;
                    this.color = 'red';
                    this.load = false;
                })
            } else {
                var url = this.$apiUrl + '/detilpemesanan/';
                this.transaksidetil.append('id_produk', this.editdetilitem.editdetilproduk.ID_PRODUK);
                this.transaksidetil.append('jumlah_pesanan', this.editdetilitem.jumlah);
                this.transaksidetil.append('id_pemesanan', this.tampungnota);
                this.$http.post(url, this.transaksidetil).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.editdetildialog = false;
                    this.editHandler(this.tempdetilproduk);
                    this.getData();
                    this.restartdetilproduk();
                }).catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = error.response.Message;
                    this.color = 'red';
                    this.load = false;
                })
            }

        },
        tambahdetil(){
            this.editdetildialog=true;
            this.detiltambah=true;
        },
        restartdetilproduk(){
            this.editdetilitem={
                iddetil:0,
                editdetilproduk:{
                    ID_PRODUK:0,
                    NAMA_PRODUK:'',
                },
                jumlah:0,
            }
        },
        ubahStatus(item){
            var url = this.$apiUrl + '/pemesanan/'+item.ID_PEMESANAN;
            this.supplierFrom.append('id_supplier', item.ID_SUPPLIER);
            this.supplierFrom.append('status_pemesanan', 1);
            this.$http.post(url, this.supplierFrom).then(response => {
                this.getData();
                this.snackbar = true;
                this.color = 'green';
                this.text = 'Berhasil';
            }).catch(error => {
                this.errors = error;
                console.log('asdasd');
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
                this.load = false;
            })
        },
        /////row
        addRow(item) {
            this.indexes++;
            this.rows.push({
                id: item.ID_PRODUK,
                nama: item.NAMA_PRODUK,
                jumlah: 0,
                hargabeli: item.HARGA_BELI,
                hargaTotal: 0
            });
            this.temparray.push(item.ID_PRODUK);
        },
        deleteRow(rows, id) {
            var i;
            console.log(this.rows[id].id)
            for (i = 0; i < this.temparray.length; i++) {
                if (this.temparray[i] == this.rows[id].id) {
                    this.temparray.splice(i, 1);
                }
            }
            this.rows.splice(id, 1)
        },
        restartrows() {
            var i;
            for (i = 0; i <= this.rows.length; i++) {
                this.rows.splice(i, 1)
            }
        },
        keymonitor(i) {
            this.rows[i].hargaTotal = this.rows[i].hargabeli * this.rows[i].jumlah;
        },
        //delete
        deleteData(item) {
            if (item.TOTAL != 0) {
                this.snackbar = true;
                this.color = 'red';
                this.text = 'Pastikan Item Sudah di Hapus Terlebih Dahulu'
            } else {
                var url = this.$apiUrl + '/pemesanan/' + item.ID_PEMESANAN;
                this.$http.delete(url).then(response => {
                        this.snackbar = true;
                        this.color = 'green';
                        this.text = 'Berhasil';
                        this.getData();
                    })
                    .catch(error => {
                        this.errors = error;
                        console.log('asdasd');
                        this.snackbar = true;
                        this.text = error.response.Message;
                        this.color = 'red';
                        this.load = false;
                    });
            }
        },
        deletedetilproduk(id){
            var url = this.$apiUrl + '/detilpemesanan/' + id;
            this.$http.delete(url).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.detildialog = false;
                    this.getData();
                })
                .catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = error.response.Message;
                    this.color = 'red';
                    this.load = false;
                });
        },
        cetak(id){
             window.location = "http://localhost/apikouvee/index.php/cetaknota/printPesanan/"+id;
        }
    },
    mounted() {
        this.getData();
    }
}
</script>
