<template>
<v-container grid-list-md fluid mb-1 mt-2>
    <v-container fluid>
        <h2 class="text-md-center">Data Transaksi Produk</h2>
        <v-layout row wrap style="margin:10px">
            <v-flex xs6>
                <v-btn depressed dark rounded style="text-transform: none !important;" color="green accent-3" :disabled="dis" @click="dialog = true">
                    <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                    Tambah Transaksi Produk
                </v-btn>
            </v-flex>
            <v-flex xs6 class="text-right">
                <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                </v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
    <v-data-table :headers="headers" :items="transaksi_produks" :items-per-page="10" :search="keyword" light class="elevation-1">
        <template v-slot:body="{ items }">
            <tbody>
                <tr v-for="(item,index) in items" :key="item.ID_TRANSAKSI_PRODUK">
                    <td>{{index+1}}</td>
                    <td>{{item.ID_TRANSAKSI_PRODUK}}</td>
                    <td>{{item.NAMA_KASIR}}</td>
                    <td>{{item.NAMA_PELANGGAN}}</td>
                    <td v-if="item.STATUS_TRANSAKSI_PRODUK==0">BELUM LUNAS</td>
                    <td v-else>LUNAS</td>
                    <td>{{item.TGL_TRANSAKSI}}</td>
                    <td>{{item.SUBTOTAL_TRANSAKSI_PRODUK}}</td>
                    <td>{{item.TOTAL_TRANSAKSI_PRODUK}}</td>
                    <td>{{item.DISKON_PRODUK}}</td>
                    <td class="text-center">
                        <v-btn icon color="indigo" light @click="editHandler(item)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon color="error" light @click="dialogWarning1=true, deleteitem=item">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn icon color="yellow" light @click="detailtransaksi(item)">
                            <v-icon>mdi-eye-outline</v-icon>
                        </v-btn>
                        <v-btn icon color="green" light @click="detailbayar(item)">
                            <v-icon v-if="item.STATUS_TRANSAKSI_PRODUK==0">mdi-cash</v-icon>
                            <v-icon v-else></v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-data-table>

    <v-dialog v-model="dialogWarning1" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline" style="color:red">Warning!!!</span>
            </v-card-title>
            <v-card-text>
                <big>Apakah Anda yakin untuk menghapus?</big>
                <template v-slot:body="{ items }">
                    <tr v-for="(item) in items" :key="item.ID_TRANSAKSI_PRODUK">
                    </tr>
                </template>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cancelDialog()">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteData(deleteitem)">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog light="" v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Transaksi Produk</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field color="blue" label="ID Pegawai" v-model="form.id_pegawai" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field color="blue" label="ID Hewan" v-model="form.id_hewan" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field color="blue" label="Peg ID Pegawai" v-model="form.peg_id_pegawai" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field color="blue" label="Status Transaksi Produk" v-model="form.status_transaksi_produk" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field color="blue" label="Diskon Produk" v-model="form.diskon_produk" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Close</v-btn>
                <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogdetail" persistent max-width="1500px" @keydown.esc="dialogdetail = false">
        <v-card>
            <v-container grid-list-md mb-0>
                <v-btn icon @click="close2()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <h2 class="text-md-center">Data Detail</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6>
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                        </v-text-field>
                    </v-flex>
                </v-layout>
                <v-data-table :headers="headers2" :items="itemss" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item,index) in items" :key="item.ID_DETIL_TRANSAKSI">
                                <td>{{index+1}}</td>
                                <td>{{item.ID_DETIL_TRANSAKSI}}</td>
                                <td>{{item.ID_TRANSAKSI_PRODUK}}</td>
                                <td>{{item.ID_PRODUK}}</td>
                                <td>{{item.NAMA_PRODUK}}</td>
                                <td>{{item.HARGA_JUAL}}</td>
                                <td>{{item.JUMLAH_PRODUK}}</td>
                                <td>{{item.SUB_TOTAL_PRODUK}}</td>
                                <td class="text-center">
                                    <v-btn icon color="indigo" light @click="editHandler2(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="error" light @click="dialogWarning2=true, deleteitem=item">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>

                <v-dialog v-model="dialogWarning2" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline" style="color:red">Warning!!!</span>
                        </v-card-title>
                        <v-card-text>
                            <big>Apakah Anda yakin untuk menghapus?</big>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="cancelDialog2()">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteData2(deleteitem)">Yes</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <v-dialog light="" v-model="dialog1" persistent max-width="600px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Detail Transaksi Produk</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field color="blue" label="ID Transaksi Produk" v-model="form2.id_transaksi_produk" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-autocomplete item-value="ID_PRODUK" item-text="ID_PRODUK" label="ID PRODUK" v-model="form2.id_produk" :items="listItem">
                                            <template slot="item" slot-scope="data">
                                                {{ data.item["ID_PRODUK"] }} - {{ data.item["NAMA_PRODUK"] }}
                                            </template>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field color="blue" label="Jumlah Produk" v-model="form2.jumlah_produk" required>
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog1 = false">Close</v-btn>
                            <v-btn color="blue darken-1" text @click="setForm2()">Save</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-card>
    </v-dialog>

    <v-dialog v-model="dialogbayar" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">BAYAR BOSS</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field color="blue" label="Total" v-model="totalTrans" outlined dense></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field color="blue" label="Masukkan Uang" v-model="uangTrans" dense></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field color="blue" label="Kembalian" @keyup="kembalian()" v-model="kembalianTrans" :rules="bayarRules" outlined dense readonly></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogbayar = false, uangTrans=0, kembalianTrans=0">Close</v-btn>
                <v-btn color="blue darken-1" text @click="bayarTrans()">Bayar</v-btn>
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
        varAdd: '',
        varCheck: false,
        deleteitem: [],
        dialogWarning1: false,
        dialogWarning2: false,
        dialog: false,
        dialogdetail: false,
        dialogbayar: false,
        dialog1: false,
        edit: false,
        dis: false,
        cek: true,
        totalTrans: 0,
        uangTrans: 0,
        kembalianTrans: 0,
        idBayar: '',
        items: [],
        bayarRules: [
            value => (value >= 0) || 'Uang Kurang',
        ],
        itemTrans: '',
        typeInput: 'new',
        keyword: '',
        form2: {
            id_transaksi_produk: "",
            id_produk: 1,
            jumlah_produk: 1,
            sub_total_produk: 0
        },
        form: {
            id_pegawai: 1,
            id_produk: 1,
            peg_id_pegawai: 1,
            status_transaksi_produk: 0,
            tgl_transaksi: "",
            subtotal_transaksi_produk: 0,
            total_transaksi_produk: 0,
            diskon_produk: 0
        },
        errors: "",
        headers: [{
                text: 'NO',
                align: 'start',
                value: 'id_transaksi_produk',
            },
            {
                text: 'ID Transaksi Produk',
                value: 'indeks',
                sortable: false
            },
            {
                text: 'Nama Kasir',
                value: 'NAMA_KASIR',
                sortable: true
            },
            {
                text: 'Nama Pelanggan',
                value: 'NAMA_PELANGGAN',
                sortable: true
            },
            {
                text: 'Status Transaksi Produk',
                value: 'STATUS_TRANSAKSI_PRODUK',
                sortable: true
            },
            {
                text: 'Tgl Tranksaksi',
                value: 'TGL_TRANSAKSI',
                sortable: true
            },
            {
                text: 'Subtotal Transaksi Produk',
                value: 'SUBTOTAL_TRANSAKSI_PRODUK',
                sortable: true
            },
            {
                text: 'Total Transaksi Produk',
                value: 'TOTAL_TRANSAKSI_PRODUK',
                sortable: false
            },
            {
                text: 'Diskon Produk',
                value: 'DISKON_PRODUK',
                sortable: false
            },
            {
                text: 'Action',
                value: 'action',
                sortable: false
            },
        ],
        headers2: [{
                text: 'NO',
                align: 'start',
                value: 'id_detil_transaksi',
            },
            {
                text: 'ID Detail Transaksi Produk',
                value: 'ID_DETIL_TRANSAKSI',
                sortable: false
            },
            {
                text: 'ID Transaksi Produk',
                value: 'ID_TRANSAKSI_PRODUK',
                sortable: true
            },
            {
                text: 'ID Produk',
                value: 'ID_PRODUK',
                sortable: true
            },
            {
                text: 'Nama Produk',
                value: 'NAMA_PRODUK',
                sortable: true
            },
            {
                text: 'Harga Jual',
                value: 'HARGA_JUAL',
                sortable: true
            },
            {
                text: 'Jumlah Produk',
                value: 'JUMLAH_PRODUK',
                sortable: true
            },
            {
                text: 'Subtotal Produk',
                value: 'SUB_TOTAL_PRODUK',
                sortable: true
            },
            {
                text: 'Action',
                value: 'action',
                sortable: false
            },
        ],
        detil_transaksi_produks: [],
        detil_transaksi_produk: new FormData,
        transaksi_produks: [],
        statusBayar: 0,
        transaksi_produk: new FormData,
        bayarForm: new FormData,
        snackbar: false,
        color: null,
        text: '',
        load: false,
        temp: '',
        updatedId: '',
        updatedId2: '',
        updatedId3: '',
        itemss: [],
        listItem: [],
    }),
    methods: {
        bayarTrans() {
            if (this.kembalianTrans < 0) {
                this.snackbar = true;
                this.text = 'Uang Kurang Bro!';
                this.color = 'red';
            } else {
                this.statusBayar = 1;
                var uri = this.$apiUrl + '/transaksiproduk/' + this.idBayar
                this.$http.get(uri).then(response => {
                    this.itemTrans = response.data.Data
                    this.bayarForm.append('id_pegawai', this.itemTrans[0].ID_PEGAWAI);
                    this.bayarForm.append('id_hewan', this.itemTrans[0].ID_HEWAN);
                    this.bayarForm.append('peg_id_pegawai', this.itemTrans[0].PEG_ID_PEGAWAI);
                    this.bayarForm.append('status_transaksi_produk', this.statusBayar);
                    this.bayarForm.append('diskon_produk', this.itemTrans[0].DISKON_PRODUK);

                    this.$http.post(uri, this.bayarForm).then(response => {
                        this.snackbar = true;
                        this.color = 'green';
                        this.text = response.data.Message;
                        this.load = false;
                        this.dialogbayar = false;
                        this.uangTrans = 0;
                        this.kembalianTrans = 0;
                        this.cek = true
                        this.getData();
                        this.resetForm();
                    }).catch(error => {
                        this.errors = error
                        this.snackbar = true;
                        this.text = 'Try Again';
                        this.color = 'red';
                        this.load = false;
                    })

                });
                // this.bayarForm.append('id_transaksi_produk', this.itemTrans[0].ID_TRANSAKSI_PRODUK);

            }
        },
        kembalian() {
            this.kembalianTrans = this.uangTrans - this.totalTrans
        },
        listitem() {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Kasir') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/produk'
                    this.$http.get(uri).then(response => {
                        this.listItem = response.data.Data
                    })
                }
            }

        },
        cancelDialog() {
            this.dialogWarning1 = false;
            this.snackbar = true;
            this.text = 'TRANSAKSI TIDAK AKAN DIBATALKAN DAN TIDAK DIHAPUS';
            this.color = 'blue';
        },
        cancelDialog2() {
            this.dialogWarning2 = false;
            this.snackbar = true;
            this.text = 'TRANSAKSI TIDAK AKAN DIBATALKAN DAN TIDAK DIHAPUS';
            this.color = 'blue';
        },
        addDetail() {
            this.dialog1 = true,
                this.form2.id_transaksi_produk = this.varAdd
        },
        detailtransaksi(item) {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Kasir') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/detiltransaksiproduk/' + item.ID_TRANSAKSI_PRODUK
                    this.$http.get(uri).then(response => {
                        this.itemss = response.data.Data
                    })
                }
            }
            this.dialogdetail = true;

        },

        detailbayar(item) {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Kasir') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/transaksiproduk/' + item.ID_TRANSAKSI_PRODUK
                    this.$http.get(uri).then(response => {
                        this.itemTrans = response.data.Data
                        this.totalTrans = this.itemTrans[0].TOTAL_TRANSAKSI_PRODUK
                        this.idBayar = item.ID_TRANSAKSI_PRODUK
                    })
                }

            }
            this.dialogbayar = true;

        },

        getData() {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Kasir') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/transaksiproduk'
                    this.$http.get(uri, this.transaksi_produk).then(response => {
                        this.transaksi_produks = response.data.Data
                    })
                }
            }
        },
        sendData() {
            this.transaksi_produk.append('indeks', this.$session.get('id'));
            this.transaksi_produk.append('id_pegawai', this.form.id_pegawai);
            this.transaksi_produk.append('peg_id_pegawai', this.form.peg_id_pegawai);
            this.transaksi_produk.append('status_transaksi_produk', this.form.status_transaksi_produk);
            this.transaksi_produk.append('id_hewan', this.form.id_hewan);
            this.transaksi_produk.append('diskon_produk', this.form.diskon_produk);
            var uri = this.$apiUrl + '/transaksiproduk'
            this.load = true;
            this.$http.post(uri, this.transaksi_produk).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = response.data.Message;
                this.load = false;
                this.dialog = false
                this.cek = true
                this.getData();
                this.resetForm();
            }).catch(error => {
                this.errors = error
                this.snackbar = true;
                this.text = 'Try Again';
                this.color = 'red';
                this.load = false;
            })
        },

        // sendData2() {
        //   this.detil_transaksi_produk.append('id_detil_transaksi', this.$session.get('id'));
        //   this.detil_transaksi_produk.append('id_transaksi_produk', this.form2.id_transaksi_produk);
        //   this.detil_transaksi_produk.append('id_produk', this.form2.id_produk);
        //   this.detil_transaksi_produk.append('jumlah_produk', this.form2.jumlah_produk);
        //   if(this.form2.jumlah_produk == 0)
        //   {
        //     this.snackbar = true;
        //     this.text = 'JUMLAH PRODUK TIDAK BOLEH 0';
        //     this.color = 'red';
        //     this.load = false;
        //   }
        //   else if (this.form2.jumlah_produk != 0) {
        //     var i;
        //     for (i = 0; i < this.listItem.length; i++) {
        //       if (this.form2.id_produk == this.listItem[i].ID_PRODUK && this.form2.jumlah_produk > this.listItem[i].STOCK) {
        //         this.varCheck=false
        //       }
        //       else if(this.form2.id_produk == this.listItem[i].ID_PRODUK && this.form2.jumlah_produk <= this.listItem[i].STOCK){
        //         this.varCheck=true
        //       }
        //     }
        //     if(varCheck=false){
        //       this.snackbar = true;
        //         this.text = "JUMLAH PRODUK MELEBIHI STOK";
        //         this.color = 'red';
        //         this.load = false;
        //     }
        //     else {
        //       var uri = this.$apiUrl + '/detiltransaksiproduk'
        //       this.load = true;
        //       this.$http.post(uri, this.detil_transaksi_produk).then(response => {
        //         this.snackbar = true;
        //         this.color = 'green';
        //         this.text = response.data.Message;
        //         this.load = false;
        //         this.dialog1 = false
        //         this.cek = true
        //         var uri2 = this.$apiUrl + '/detiltransaksiproduk/' + this.varAdd
        //         this.$http.get(uri2).then(response => {
        //           this.itemss = response.data.Data
        //         })
        //         this.resetForm2();
        //       }).catch(error => {
        //         this.errors = error
        //         this.snackbar = true;
        //         this.text = 'Try Again';
        //         this.color = 'red';
        //         this.load = false;
        //       })
        //     }
        //     }

        // },

        updateData() {
            this.transaksi_produk.append('id_transaksi_produk', this.form.id_transaksi_produk);
            this.transaksi_produk.append('peg_id_pegawai', this.form.peg_id_pegawai);
            this.transaksi_produk.append('id_pegawai', this.form.id_pegawai);
            this.transaksi_produk.append('id_hewan', this.form.id_hewan);
            this.transaksi_produk.append('status_transaksi_produk', this.form.status_transaksi_produk);
            this.transaksi_produk.append('diskon_produk', this.form.diskon_produk);
            var uri = this.$apiUrl + '/transaksiproduk/' + this.updatedId
            this.load = true;
            this.$http.post(uri, this.transaksi_produk).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = response.data.Message;
                this.load = false;
                this.dialog = false
                this.cek = true
                this.getData();
                this.resetForm();
            }).catch(error => {
                this.errors = error
                this.snackbar = true;
                this.text = 'Try Again';
                this.color = 'red';
                this.load = false;
            })
        },

        deleteData(deleteitem) {
            var uri = this.$apiUrl + '/transaksiproduk/' + this.deleteitem.ID_TRANSAKSI_PRODUK;
            this.$http.delete(uri).then(response => {
                    this.snackbar = true;
                    this.text = "TRANSAKSI DIHAPUS";
                    this.color = "green";
                    this.dialogWarning1 = false;
                    this.getData();
                })
                .catch(error => {
                    this.errors = error;
                    this.snackbar = true;
                    this.text = "TRANSAKSI AKAN DIBATALKAN DAN DATA DIHAPUS";
                    this.color = "red";
                });
        },
        deleteData2(deleteitem) {
            var uri = this.$apiUrl + '/detiltransaksiproduk/' + this.deleteitem.ID_DETIL_TRANSAKSI;
            this.$http.delete(uri).then(response => {
                    this.snackbar = true;
                    this.text = "TRANSAKSI DIHAPUS";
                    this.color = "green";
                    this.dialogWarning2 = false;
                    this.detailtransaksi(deleteitem);
                })
                .catch(error => {
                    this.errors = error;
                    this.snackbar = true;
                    this.text = "TRANSAKSI AKAN DIBATALKAN DAN DATA DIHAPUS";
                    this.color = "red";
                });
        },

        editHandler(item) {
            this.edit = true,
                this.typeInput = "edit";
            this.form.id_transaksi_produk = item.ID_TRANSAKSI_PRODUK;
            this.form.id_pegawai = item.ID_PEGAWAI;
            this.form.id_hewan = item.ID_HEWAN;
            this.form.peg_id_pegawai = item.PEG_ID_PEGAWAI;
            this.form.status_transaksi_produk = item.STATUS_TRANSAKSI_PRODUK;
            this.form.tgl_transaksi = item.TGL_TRANSAKSI;
            this.form.subtotal_transaksi_produk = item.SUBTOTAL_TRANSAKSI_PRODUK;
            this.form.total_transaksi_produk = item.TOTAL_TRANSAKSI_PRODUK;
            this.form.diskon_produk = item.DISKON_PRODUK;
            (this.updatedId = item.ID_TRANSAKSI_PRODUK);
            this.dialog = true;
        },
        updateData2() {
            this.detil_transaksi_produk.append('id_transaksi_produk', this.form2.id_transaksi_produk);
            this.detil_transaksi_produk.append('id_produk', this.form2.id_produk);
            this.detil_transaksi_produk.append('jumlah_produk', this.form2.jumlah_produk);
            var uri = this.$apiUrl + '/detiltransaksiproduk/' + this.updatedId2
            this.load = true;
            this.$http.post(uri, this.detil_transaksi_produk).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = response.data.Message;
                this.load = false;
                var uri2 = this.$apiUrl + '/detiltransaksiproduk/' + this.updatedId3
                this.$http.get(uri2).then(response => {
                    this.itemss = response.data.Data
                })
                this.resetForm2();
                this.dialog1 = false;
            }).catch(error => {
                this.errors = error
                this.snackbar = true;
                this.text = 'Try Again';
                this.color = 'red';
                this.load = false;
                this.typeInput = 'new';
            })
        },
        editHandler2(item) {
            this.edit = true,
                this.typeInput = "edit";
            this.form2.id_transaksi_produk = item.ID_TRANSAKSI_PRODUK;
            this.form2.id_produk = item.ID_PRODUK;
            this.form2.jumlah_produk = item.JUMLAH_PRODUK;
            this.updatedId2 = item.ID_DETIL_TRANSAKSI;
            this.updatedId3 = item.ID_TRANSAKSI_PRODUK;
            this.dialog1 = true;
        },
        setForm() {
            if (this.typeInput === "new") {
                this.sendData();
            } else {

                this.updateData();
            }
        },
        setForm2() {
            if (this.typeInput === "new") {
                this.sendData2();
            } else {

                this.updateData2();
            }
        },
        close() {
            this.dialogdetail = false,
                this.dialog = false,
                this.resetForm()
        },
        close2() {
            this.varAdd = '',
                this.itemss = [],

                this.dialogdetail = false,
                this.dialog1 = false,
                this.resetForm2()
        },
        resetForm() {
            this.edit = false,
                this.form = {
                    id_transaksi_produk: "",
                    id_pegawai: 1,
                    id_produk: 1,
                    peg_id_pegawai: 1,
                    status_transaksi_produk: 0,
                    tgl_transaksi: "",
                    subtotal_transaksi_produk: 0,
                    total_transaksi_produk: 0,
                    diskon_produk: 0
                };
        },

        resetForm2() {
            this.edit = false,
                this.form2 = {
                    id_transaksi_produk: "",
                    id_produk: 1,
                    jumlah_produk: 1,
                    sub_total_produk: 0
                };
        },
    },

    mounted() {
        this.listitem();
        this.getData();
    }
}
</script>
