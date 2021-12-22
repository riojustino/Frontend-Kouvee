<template>
<v-container>
    <v-data-iterator :items="layanans" :search="search" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
        <template v-slot:header>
            <v-toolbar class="mb-2">
                <v-text-field v-model="search" clearable solo hide-details label="Search"></v-text-field>
                <v-btn large class="mr-3 ml-10" color="green" :disabled="dis" @click="tambah=true">Tambah
                </v-btn>
            </v-toolbar>
        </template>
        <template v-slot:default="props">
            <v-row class="ml-1">
                <v-col v-for="item in props.items" :key="item.ID_TRANSAKSI_LAYANAN" cols="8" sm="6" md="3" lg="3">
                    <v-card max-width="500" min-height="100" class="mb-10">
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>ID Transaksi</v-list-item-content>
                                <v-list-item-content class="align-end">: {{ item.ID_TRANSAKSI_LAYANAN }}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>Pelanggan</v-list-item-content>
                                <v-list-item-content class="align-center">: {{ item.NAMA_PELANGGAN }}</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>Tanggal</v-list-item-content>
                                <v-list-item-content class="align-end">: {{ item.TGL_TRANSAKSI_LAYANAN}}</v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>Total Belanja</v-list-item-content>
                                <v-list-item-content class="align-end">: {{ item.TOTAL_TRANSAKSI_LAYANAN }}</v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-card-actions class="justify-content-center">
                            <v-btn color="green" text :disabled="updatebtn(item.PROGRES_LAYANAN)" @click="update(item)">
                                DONE
                            </v-btn>
                            <v-btn color="green" text :disabled="updatebtn(item.PROGRES_LAYANAN)" @click="edit(item)">
                                EDIT
                            </v-btn>
                            <v-btn color="red" text :disabled="updatebtn(item.PROGRES_LAYANAN)" @click="deletetransaksi(item)">
                                DELETE
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <template v-slot:footer>
            <v-row class="mb-12 justify-content-center">
                <v-btn fab dark color="primary" class="mr-12" @click="formerPage">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab dark color="primary" class="mr-12" @click="nextPage">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-row>
        </template>
    </v-data-iterator>
    <v-dialog light v-model="tambah" persistent max-width="1000px" height="1000px">
        <v-row class="mb-2 mt-5" justify="center" no-gutters v-if="cekform">
            <v-col md="auto">
                <v-card class="pa-5" width="1000px" outlined light tile>
                    <v-row>
                        <v-col cols="3">
                            <v-text-field solo flat label="Nama Hewan	:" readonly=""></v-text-field>
                        </v-col>
                        <v-col cols="9">
                            <v-select v-model="tempHewan" :items="hewans" item-text="NAMA_HEWAN" item-value="ID_HEWAN" label="Nama" persistent-hint return-object solo></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-btn block color="success" @click="inputhewan(formHewan)" dark>CEK</v-btn>
                        </v-col>
                    </v-row>
                    <div>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field solo flat label="Nama Hewan" readonly></v-text-field>
                            </v-col>
                            <v-col cols="9">
                                <v-text-field v-model="formHewan.namahewan" solo label="Nama Hewan" readonly></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field solo flat label="Jenis Hewan" readonly></v-text-field>
                            </v-col>
                            <v-col cols="9">
                                <v-text-field v-model="formHewan.jenishewan" solo label="jenis Hewan" readonly></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field solo flat label="Nama Pemilik" readonly></v-text-field>
                            </v-col>
                            <v-col cols="9">
                                <v-text-field v-model="formHewan.namaPemilik" solo label="Nama Pemilik" readonly></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-text-field solo flat label="Tgl Lahir" readonly></v-text-field>
                            </v-col>
                            <v-col cols="9">
                                <v-text-field v-model="formHewan.tgllahir" solo label="Tanggal Lahir Hewan" readonly></v-text-field>
                            </v-col>
                        </v-row>
                        <div class="d-flex justify-content-end">
                            <v-btn class="ma-2" color="error" @click="tambah=false">
                                Cancel
                            </v-btn>
                            <v-btn class="ma-2" color="success" :disabled="submitatascek" @click="postTansaksi()">
                                Submit
                            </v-btn>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="mb-2 mt-5" justify="center" no-gutters v-if="formAktif">

            <v-col md="auto">
                <v-card class="pa-2" width="1000px" outlined tile light="">
                    <v-container>
                        <v-row>
                            <v-col cols="9">
                                <label>Layanan</label>
                            </v-col>
                            <v-col cols="2">
                                <label>Total Harga</label>
                            </v-col>
                            <v-col cols="1">
                                <button type="submit" class="btn btn-success" @click="addRow">+</button>
                            </v-col>
                        </v-row>
                        <v-row v-for="(row,index) in rows" :key="index">
                            <v-col cols="9">
                                <v-select v-model="row.layanan" :items="isilayanans" item-text="NAMA_LAYANAN" item-value="ID_LAYANAN" label="Layanan" persistent-hint return-object solo></v-select>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field v-model="row.layanan.HARGA_LAYANAN" solo readonly></v-text-field>
                            </v-col>
                            <v-col cols="1">
                                <button class="btn btn-danger" @click="deleteRow(rows,row.index)">X</button>
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
            </v-col>
        </v-row>
    </v-dialog>
    <v-dialog light v-model="dialog" persistent max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Data Transaksi</span>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="tambahdetil()">Tambah</v-btn>
            <v-data-table :headers="headers" :items="buatedititem" :hide-default-footer="true" light class="elevation-1">
                <template v-slot:body="{ items }">
                    <tbody>
                        <tr v-for="(item,index) in items" :key="item.ID_DETILTRANSAKSI_LAYANAN">
                            <td>{{index+1}}</td>
                            <td>{{item.NAMA_LAYANAN}}</td>
                            <td>{{item.SUB_TOTAL_LAYANAN}}</td>
                            <td class="text-start">
                                <v-btn icon color="indigo" light @click="editHandler(item,0)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon color="error" light @click="deletedetil(item.ID_DETILTRANSAKSI_LAYANAN)">
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
    <v-dialog light v-model="dialog2" persistent max-width="600px">
        <v-card>
            <v-card-title class="justify-content-center">
                <span class="headline">Jenis Layanan</span>
            </v-card-title>
            <v-select v-model="formedit.editlayanan" :items="isilayanans" item-text="NAMA_LAYANAN" item-value="ID_LAYANAN" label="Layanan" persistent-hint return-object solo></v-select>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="restartedithandler()">Close</v-btn>
                <v-btn color="blue darken-1" text @click="sendedithandler()">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="10000">
        {{ text }}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
</v-container>
</template>

<script>
export default {
    data: () => ({
        dis: false,
        layanans: [],
        tambah: false,
        indexes: 0,
        page: 1,
        dialog2: false,

        headers: [{
                text: 'NO',
                value: '',
                sortable: false,
            },
            {
                text: 'Nama Layanan',
                value: 'NAMA_LAYANAN',
                sortable: false,
            },
            {
                text: 'Harga Layanan',
                value: 'HARGA_LAYANAN',
                sortable: false,
            },
            {
                text: 'Action',
                value: '',
                sortable: false,
            },
        ],
        itemsPerPage: 8,
        itemsPerPageArray: [8],
        search: '',
        formedit: {
            id_item: 0,
            editlayanan: {
                ID_LAYANAN: 0,
                NAMA_LAYANAN: ""
            }
        },
        editdata: false,
        transaksiLayanan: new FormData,
        transaksidetil: new FormData,
        snackbar: false,
        color: null,
        dialog: false,
        text: '',
        isilayanans: [],
        buatedititem: [],
        tampungnota: 0,
        tempaaaa: [],
        cektambah: false,
        ///buattambah
        cekform: true,
        formAktif: false,
        submitatascek: true,
        layanans: [],
        tempHewan: [],
        transaksiLayanan: new FormData,
        detiltransaksi: new FormData,
        hewans: [],
        kodeTemp: '',
        formHewan: {
            id_hewan: 0,
            namahewan: '',
            tgllahir: '',
            namaPemilik: '',
            jenishewan: '',
            diskon: 0,
        },
        rows: [{
            index: 0,
            layanan: [],
            harga: 0,
        }],
    }),
    computed: {
        numberOfPages() {
            return Math.ceil(this.layanans.length / this.itemsPerPage)
        },
    },
    methods: {
        restartbuatedititem() {
            this.buatedititem = [];
            this.dialog = false;
        },
        restartedithandler() {
            this.formedit = {
                id_item: 0,
                editlayanan: {
                    ID_LAYANAN: 0,
                    NAMA_LAYANAN: ""
                }
            }
            this.dialog2 = false;
        },
        editHandler(item) {
            this.dialog2 = true;
            this.formedit.id_item = item.ID_DETILTRANSAKSI_LAYANAN,
                this.formedit.editlayanan.ID_LAYANAN = item.ID_LAYANAN,
                this.formedit.editlayanan.NAMA_LAYANAN = item.NAMA_LAYANAN;
            console.log(this.formedit.editlayanan.ID_LAYANAN)
        },
        sendedithandler() {
            if (this.cektambah != true) {
                var url = this.$apiUrl + '/detiltransaksilayanan/' + this.formedit.id_item;
                this.transaksidetil.append('id_layanan', this.formedit.editlayanan.ID_LAYANAN);
                this.$http.post(url, this.transaksidetil).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.dialog2 = false;
                    this.edit(this.tempaaaa);
                    this.getData();
                }).catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = error.response.Message;
                    this.color = 'red';
                    this.load = false;
                })
            } else {
                var url = this.$apiUrl + '/detiltransaksilayanan/';
                this.transaksidetil.append('id_layanan', this.formedit.editlayanan.ID_LAYANAN);
                this.transaksidetil.append('id_transaksi_layanan', this.tampungnota);
                this.$http.post(url, this.transaksidetil).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.dialog2 = false;
                    this.edit(this.tempaaaa);
                    this.getData();
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
        tambahdetil() {
            this.dialog2 = true;
            this.cektambah = true;
        },
        deletedetil(id) {
            var url = this.$apiUrl + '/detiltransaksilayanan/' + id;
            this.$http.delete(url).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = 'Berhasil';
                    this.edit(this.tempaaaa);
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
        edit(item) {
            this.editdata = true;
            this.tempaaaa = item;
            var url = this.$apiUrl + '/detiltransaksilayanan/' + item.ID_TRANSAKSI_LAYANAN;
            this.tampungnota = item.ID_TRANSAKSI_LAYANAN;
            console.log(this.tampungnota);
            this.$http.get(url, this.buatedititem).then(response => (
                this.buatedititem = response.data.Data
            ));
            this.dialog = true;
        },
        update(item) {
            console.log(item)
            var uri = this.$apiUrl + '/transaksilayanan/' + item.ID_TRANSAKSI_LAYANAN
            console.log(item.ID_TRANSAKSI_LAYANAN)
            this.transaksiLayanan.append('id_pegawai', this.$session.get('id'));
            this.transaksiLayanan.append('peg_id_pegawai', 1);
            this.transaksiLayanan.append('id_hewan', item.ID_HEWAN);
            this.transaksiLayanan.append('diskon_layanan', item.DISKON_LAYANAN);
            this.transaksiLayanan.append('total_transaksi_layanan', item.TOTAL_TRANSAKSI_LAYANAN);
            this.transaksiLayanan.append('status_layanan', item.STATUS_LAYANAN);
            this.transaksiLayanan.append('progres_layanan', 1);
            this.transaksiLayanan.append('subtotal_transaksi_layanan', item.SUBTOTAL_TRANSAKSI_LAYANAN);
            this.$http.post(uri, this.transaksiLayanan).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = 'Berhasil';
                this.getData();
            }).catch(error => {
                this.errors = error;
                console.log('asdasd');
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
                this.load = false;
            })
        },
        deletetransaksi(item) {
            if (item.TOTAL_TRANSAKSI_LAYANAN != 0) {
                this.snackbar = true;
                this.color = 'red';
                this.text = 'Pastikan Item Sudah diHapus Terlebih Dahulu'
            } else {
                var url = this.$apiUrl + '/transaksilayanan/' + item.ID_TRANSAKSI_LAYANAN;
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
        getData() {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'CS') {
                    this.dis = true;
                } else {
                    var uri = this.$apiUrl + '/transaksilayanan'
                    this.$http.get(uri).then(response => {
                        this.layanans = response.data.Data
                    });
                    var uri = this.$apiUrl + '/layanan'
                    this.$http.get(uri, this.isilayanans).then(response => {
                        this.isilayanans = response.data.Data
                    });
                    var uri = this.$apiUrl + '/hewan'
                    this.$http.get(uri, this.hewans).then(response => {
                        this.hewans = response.data.Data
                    })
                }
            }

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
        /////buatnambah
        postTansaksi() {
            this.transaksiLayanan.append('id_pegawai', this.$session.get('id'));
            this.transaksiLayanan.append('peg_id_pegawai', 1);
            this.transaksiLayanan.append('id_hewan', this.formHewan.id_hewan);
            this.transaksiLayanan.append('diskon_layanan', 0);
            // console.log(this.formHewan.id_hewan);
            var uri = this.$apiUrl + '/TransaksiLayanan'
            // console.log(uri);
            this.$http.post(uri, this.transaksiLayanan).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.kodeTemp = response.data.Data;
                this.text = response.data.Message + ' Kode Anda ' + this.kodeTemp;
                this.dialog = false;
                console.log(this.kodeTemp);
                this.formAktif = true;
                this.cekform = false;
                this.restartforms();
            }).catch(error => {
                this.errors = error;
                console.log('asdasd');
                this.snackbar = true;
                this.text = error.data.Message;
                this.color = 'red';
                this.load = false;
            })
        },
        postDetil() {
            console.log('cek')
            var c = this.rows.length;
            var DETIL = new FormData;
            var x;
            console.log(c)
            var i = 0;
            for (; i < c; i++) {
                DETIL.append('id_transaksi_layanan', this.kodeTemp);
                console.log(i);
                x = this.rows[i].layanan.ID_LAYANAN;
                DETIL.append('id_layanan', this.rows[i].layanan.ID_LAYANAN);
                for (var pair of DETIL.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
                var uri = this.$apiUrl + '/detiltransaksilayanan'
                this.$http.post(uri, DETIL).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.Message;
                    this.dialog = false;
                    this.restartrows();
                    this.formAktif = false;
                    this.cekform = true;
                    this.getData();
                }).catch(error => {
                    this.errors = error;
                    console.log('asdasd');
                    this.snackbar = true;
                    this.text = 'Layanan Harus Di Isi';
                    this.color = 'red';
                    this.load = false;
                })
                DETIL = new FormData;
            }
            DETIL = new FormData;
        },
        canceltransaksi() {
            var uri = this.$apiUrl + '/transaksilayanan/' + this.kodeTemp;
            this.$http.delete(uri).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = response.data.Message;
                this.dialog = false;
                this.restartrows();
                this.formAktif = false;
                this.cekform = true;
            }).catch(error => {
                this.errors = error;
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
            })
        },
        inputhewan() {
            this.formHewan.id_hewan = this.tempHewan.ID_HEWAN,
                this.formHewan.namahewan = this.tempHewan.NAMA_HEWAN,
                this.formHewan.jenishewan = this.tempHewan.JENISHEWAN,
                this.formHewan.tgllahir = this.tempHewan.TGL_LAHIR_HEWAN,
                this.formHewan.namaPemilik = this.tempHewan.NAMA_PELANGGAN;
            if (this.formHewan.id_hewan != null) {
                this.submitatascek = false;
            }
            console.log(this.formHewan)
        },
        addRow() {
            this.indexes++;
            this.rows.push({
                index: this.indexes,
                layanan: [],
                harga: 0
            });
        },
        deleteRow(rows, id) {
            var i = rows.length;
            if (i != 0) { // (not 0)
                while (--i) {
                    var cur = rows[i];
                    if (cur.index == id) {
                        rows.splice(i, 1);
                    }
                }
            }
            this.indexes--;
        },
        restartrows() {
            var i = this.rows.length;
            if (i != 0) { // (not 0)
                while (--i) {
                    this.rows.splice(i - 1, 1);
                    if (i - 1 == 0) {
                        this.rows[0].index = 0,
                            this.rows[0].layanan = [],
                            this.rows[0].harga = 0;
                    }
                }
            }
            this.indexes = 0;
        },
        restartforms() {
            this.formHewan = {
                id_hewan: 0,
                namahewan: '',
                tgllahir: '',
                namaPemilik: '',
                jenishewan: '',
                diskon: '',
            }
            this.tempHewan = null;
        },
        keymonitor(i) {
            this.rows[i].hargaTotal = this.rows[i].produk.HARGA_JUAL * this.rows[i].jumlah;
        },
        setnonmem() {
            this.formHewan.id_hewan = 1;
            this.postTansaksi();
            this.membercek = false;
        }
    },
    mounted() {
        this.getData();
    }
}
</script>
