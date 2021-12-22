<template>
<v-container>
    <v-data-iterator :items="layanans" :search="search" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
        <template v-slot:header>
            <v-toolbar class="mb-2">
                <v-text-field v-model="search" clearable solo hide-details label="Search"></v-text-field>
            </v-toolbar>
        </template>
        <template v-slot:default="props">
            <v-row class="ml-1">
                <v-col v-for="item in props.items" :key="item.ID_TRANSAKSI_LAYANAN" cols="8" sm="6" md="3" lg="3">
                    <v-card max-width="250" min-height="100" class="mb-10">
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>ID Transaksi</v-list-item-content>
                                <v-list-item-content class="align-end">: {{ item.ID_TRANSAKSI_LAYANAN }}</v-list-item-content>
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
                            <v-btn color="green" text :disabled="updatebtn(item.STATUS_LAYANAN)" @click="bayar(item)">
                                DONE
                            </v-btn>
                            <v-btn color="green" text :disabled="updatebtn(item.STATUS_LAYANAN)" @click="edit(item)">
                                Lihat
                            </v-btn>
                            <v-btn color="green" text :disabled="updatebtn(item.STATUS_LAYANAN)" @click="diskon(item)">
                                Diskon
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>
        <template v-slot:footer>
            <v-row class="mb-12 justify-content-end">
                <v-btn fab dark color="primary" class="mr-6" @click="formerPage">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab dark color="primary" class="mr-7" @click="nextPage">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-row>
        </template>
    </v-data-iterator>
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
                <span class="headline">DISKON</span>
            </v-card-title>
            <v-text-field
            outlined
            v-model="diskonHandler.diskon_layanan" label="Diskon"></v-text-field>
            <v-card-actions>
                <v-btn color="blue darken-1" text @click="diskonsend()">Save</v-btn>
                <v-btn color="blue darken-1" text @click="dialog2=false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogbayar" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">Kasir</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                <v-col cols="6">
                <v-text-field color="blue" label="Total" readonly v-model="totalTrans" outlined dense></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field color="blue" label="Masukkan Uang" v-on:keyup="kembalian()" v-model="uangTrans"  dense></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field color="blue" label="Kembalian"  v-model="kembalianTrans"  :rules="bayarRules" outlined dense readonly></v-text-field>
              </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogbayar = false, uangTrans=0, kembalianTrans=0">Close</v-btn>
              <v-btn color="blue darken-1" text @click="update(tempbayar)">Bayar</v-btn>
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
        layanans: [],
        tambah:false,
        indexes: 0,
        page: 1,
        dialog2: false,
        tempbayar:[],
        totalTrans:0,
        uangTrans:0,
        kembalianTrans:0,
        dialogbayar: false,
        bayarRules: [
       value => (value >= 0 )|| 'Uang Kurang',
    ],
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
        diskonHandler:{
            id_transaksi_layanan:0,
            id_pegawai:0,
            id_hewan:0,
            diskon_layanan:0,
            total_transaksi_layanan:0,
            progres_layanan:0,
            subtotal:0,
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
        bayar(item){
            this.totalTrans = item.TOTAL_TRANSAKSI_LAYANAN;
            this.dialogbayar = true;
            this.tempbayar= item;
        },
        kembalian(){
            this.kembalianTrans = this.uangTrans - this.totalTrans
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
        diskon(item){
            this.diskonHandler.id_transaksi_layanan=item.ID_TRANSAKSI_LAYANAN,
            this.diskonHandler.id_pegawai=item.ID_PEGAWAI,
            this.diskonHandler.id_hewan=item.ID_HEWAN,
            this.diskonHandler.diskon_layanan=item.DISKON_LAYANAN,
            this.diskonHandler.total_transaksi_layanan=item.TOTAL_TRANSAKSI_LAYANAN,
            this.diskonHandler.progres_layanan=item.PROGRES_LAYANAN,
            this.diskonHandler.subtotal=item.SUBTOTAL_TRANSAKSI_LAYANAN,
            this.dialog2=true;
        },
        diskonsend(){
            var uri = this.$apiUrl + '/transaksilayanan/' + this.diskonHandler.id_transaksi_layanan
            this.transaksiLayanan.append('id_pegawai', this.diskonHandler.id_pegawai);
            this.transaksiLayanan.append('peg_id_pegawai', this.$session.get('id'));
            this.transaksiLayanan.append('id_hewan', this.diskonHandler.id_hewan);
            this.transaksiLayanan.append('diskon_layanan', this.diskonHandler.diskon_layanan);
            this.transaksiLayanan.append('total_transaksi_layanan', this.diskonHandler.total_transaksi_layanan);
            this.transaksiLayanan.append('status_layanan', 0);
            this.transaksiLayanan.append('progres_layanan', this.diskonHandler.progres_layanan);
            this.transaksiLayanan.append('subtotal_transaksi_layanan', this.diskonHandler.subtotal);
            this.$http.post(uri, this.transaksiLayanan).then(response => {
                this.snackbar = true;
                this.color = 'green';
                this.text = 'Berhasil';
                this.getData();
                this.dialog2=false;
            }).catch(error => {
                this.errors = error;
                console.log('asdasd');
                this.snackbar = true;
                this.text = error.response.Message;
                this.color = 'red';
                this.load = false;
            })
        },
        update(item) {
            console.log(item);
            var uri = this.$apiUrl + '/transaksilayanan/' + item.ID_TRANSAKSI_LAYANAN
            console.log(item.ID_TRANSAKSI_LAYANAN)
            this.transaksiLayanan.append('id_pegawai', item.ID_PEGAWAI);
            this.transaksiLayanan.append('peg_id_pegawai', this.$session.get('id'));
            this.transaksiLayanan.append('id_hewan', item.ID_HEWAN);
            this.transaksiLayanan.append('diskon_layanan', item.DISKON_LAYANAN);
            this.transaksiLayanan.append('total_transaksi_layanan', item.TOTAL_TRANSAKSI_LAYANAN);
            this.transaksiLayanan.append('status_layanan', 1);
            this.transaksiLayanan.append('progres_layanan', item.PROGRES_LAYANAN);
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
            window.location = "http://localhost/apikouvee/index.php/cetaknota/printNota/"+item.ID_TRANSAKSI_LAYANAN;
            this.dialogbayar = false;
            this.uangTrans=0; 
            this.kembalianTrans=0;
        },
        deletetransaksi(item) {
            if (item.TOTAL_TRANSAKSI_LAYANAN != 0) {
                this.snackbar = true;
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
            if(!this.$session.exists()){
                this.$router.push('/login');
            }
            else{
                if (this.$session.get('role') != 'Kasir') {
                    this.dis = true ;
                }
                else{
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
    },
    mounted() {
        this.getData();
    }
}
</script>


