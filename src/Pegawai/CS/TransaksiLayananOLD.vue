<template>
<v-container grid-list-md fluid mb-1 mt-2>
    <v-container fluid>
        <h2 class="text-md-center" style="color:white">Transaksi Layanan</h2>
        <v-layout row wrap style="margin:10px">
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
                            <v-row>
                                <v-col cols="3">
                                    <v-text-field solo flat label="Diskon" readonly></v-text-field>
                                </v-col>
                                <v-col cols="9">
                                    <v-text-field v-model="formHewan.diskon" solo></v-text-field>
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-content-end">
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
                                    <v-select v-model="row.layanan" :items="layanans" item-text="NAMA_LAYANAN" item-value="ID_LAYANAN" label="Layanan" persistent-hint return-object solo></v-select>
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
        </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="5000">
        {{ text }}
        <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
</v-container>
</template>

<script>
export default {
    data: () => ({
        indexes: 0,
        cekform: true,
        formAktif: false,
        submitatascek: true,
        layanans: [],
        transaksiLayanan: new FormData,
        detiltransaksi: new FormData,
        hewans: [],
        text: '',
        List_Items: [],
        error: '',
        tempHewan: [],
        snackbar: false,
        color: null,
        load: false,
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
        checkedList: []
    }),
    methods: {
        postTansaksi() {
            this.transaksiLayanan.append('id_pegawai', this.$session.get('id'));
            this.transaksiLayanan.append('peg_id_pegawai', 1);
            this.transaksiLayanan.append('id_hewan', this.formHewan.id_hewan);
            this.transaksiLayanan.append('diskon_layanan', this.formHewan.diskon);
            console.log(this.formHewan.id_hewan);
            var uri = this.$apiUrl + '/TransaksiLayanan'
            console.log(uri);
            this.$http.post(uri, this.transaksiLayanan).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.kodeTemp = response.data.Data;
                this.text = response.data.Message+' Kode Anda '+this.kodeTemp;
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
            console.log(c)
            var i = 0;
            for (; i < c; i++) {
                this.detiltransaksi.append('id_transaksi_layanan', this.kodeTemp);
                this.detiltransaksi.append('id_layanan', this.rows[i].layanan.ID_LAYANAN);
                var uri = this.$apiUrl + '/detiltransaksilayanan'
                this.$http.post(uri, this.detiltransaksi).then(response => {
                    this.snackbar = true;
                    this.color = 'green';
                    this.text = response.data.Message;
                    this.dialog = false;
                    this.restartrows();
                    this.formAktif = false;
                    this.cekform = true;
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
        getdata() {
            var uri = this.$apiUrl + '/layanan'
            this.$http.get(uri, this.layanans).then(response => {
                this.layanans = response.data.Data
            })

            var uri = this.$apiUrl + '/hewan'
            this.$http.get(uri, this.hewans).then(response => {
                this.hewans = response.data.Data
            })
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
        this.getdata();
    }
}
</script>
