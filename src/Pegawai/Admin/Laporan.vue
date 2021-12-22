<template>

<v-container grid-list-md fluid mb-1 mt-2>
    <v-row>
        <v-col cols="1">
            <v-text-field v-model="tahun" solo dense label="Tahun" type="number"></v-text-field>
        </v-col>
        <v-col cols="2">
            <v-select :items="bulan" item-text="name" item-value="name" v-model="bulans" solo dense label="Bulan"></v-select>
        </v-col>
        <v-col cols="2">
            <v-btn v-model="printBtn" @click="tampilLaporan()">
                Print Laporan
            </v-btn>
        </v-col>
    </v-row>
    <a v-bind:href="'http://kouvee.xyz/index.php/Laporan/printLaporanPengadaanTahun/'+tahun" v-if="printBtn">
        <v-btn class="mr-2">Print Pengadaan Tahunan</v-btn>
    </a>
    <a v-bind:href="'http://kouvee.xyz/index.php/Laporan/printLaporanPengadaanBulan/'+tahun+'/'+bulans" v-if="printBtn">
        <v-btn class="mr-2">Print Pengadaan Bulanan</v-btn>
    </a>
    <a v-bind:href="'http://kouvee.xyz/index.php/Laporan/printLaporanPendapatanTahun/'+tahun" v-if="printBtn">
        <v-btn class="mr-2">Print Pendapatan Tahunan</v-btn>
    </a>
    <a v-bind:href="'http://kouvee.xyz/index.php/Laporan/printLaporanPendapatanBulan/'+tahun+'/'+bulans" v-if="printBtn">
        <v-btn class="mr-2">Print Pendapatan Bulanan</v-btn>
    </a>
    
    <v-row>

    </v-row>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
      {{ text }}
      <v-btn dark text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
</v-container>
</template>

<script>
export default {
    props: {
      source: String,
    },

    data: () => ({
        bulans: '',
        snackbar: false,
        text: '',
        color: null,
        bulan:  [
            {"id" : 1,
            "name" :"January"}, 
            {"id" : 2,
            "name" :"February"},  
            {"id" : 3,
            "name" :"March"},  
            {"id" : 4,
            "name" :"April"},   
            {"id" : 5,
            "name" :"May"},   
            {"id" : 6,
            "name" :"June"},
            {"id" : 7,
            "name" :"July"},
            {"id" : 8,
            "name" :"August"}, 
            {"id" : 9,
            "name" :"September"}, 
            {"id" : 10,
            "name" :"October"}, 
            {"id" :11,
            "name" :"November"},
            {"id" : 12,
            "name" :"December"}],
        tahun: '',
        printBtn: false,
    }),
    methods: {
        tampilLaporan(){
            if(this.bulan != '' && this.tahun != '')
            {
                if(this.tahun < 0){
                    this.snackbar = true,
                    this.text = 'Tahun Tidak Boleh Kurang Dari 0'
                    this.printBtn=false
                    this.color = 'red'
                }else if(this.tahun.length < 4){
                    this.snackbar = true,
                    this.text = 'Tahun Harus 4 Angka'
                    this.printBtn=false
                    this.color = 'red'
                }else{
                    this.printBtn = true
                }
            }
            else
            {
                this.printBtn=false
            }
        },
    }
        
}
</script>