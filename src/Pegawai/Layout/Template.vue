<template>
<v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped color="blue">
        <v-list dense="">
            <v-list-group v-for="item in items" :key="item.title" v-model="item.active" no-action>
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-content>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                </template>
                <div class="justify-content-start">
                    <v-list-item v-for="subItem in item.items" :key="subItem.title" router :to="subItem.route" link>
                        <v-list-item-content>
                            <v-icon small>{{ subItem.icons }}</v-icon>
                        </v-list-item-content>
                        <v-list-item-content>
                            <v-list-item-title v-text="subItem.title"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="secondary" clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>Menu</v-toolbar-title>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on }">
                <v-btn icon color="error" light v-on="on">
                    <v-icon>
                        mdi-bell
                    </v-icon>
                    {{Prodfilter.length}}
                </v-btn>
            </template>
            <div style="background-color:white">
                <v-col v-for="(item, i) in Prodfilter" :key="i" cols="12">
                <v-card class="mx-auto" max-width="400">
                    <v-card-text class="text--primary">
                        <div>Produk {{item.NAMA_PRODUK}} Sudah Mulai Habis </div>
                        <div>Stock Tersisa {{item.STOCK}} {{item.SATUAN_PRODUK}}</div>
                    </v-card-text>
                </v-card>
            </v-col>
            </div>
        </v-menu>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn color="red" text ink @click="logout()">LogOut</v-btn>
        </v-toolbar-items>
    </v-app-bar>

    <v-content class="light-green darken-4">
        <router-view></router-view>
    </v-content>
</v-app>
</template>

<script>
export default {
    props: {
        source: String,
    },

    data() {
        return {
            drawer: null,
            menu: false,
            produks: [],
            items: [{
                    title: 'Admin',
                    icon: 'mdi-account',
                    items: [{
                            title: 'Produk',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/produk'
                        },
                        {
                            title: 'Layanan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/layanan'
                        },
                        {
                            title: 'Jenis Hewan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/jhewan'
                        },
                        {
                            title: 'Ukuran',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/ukuran'
                        },
                        {
                            title: 'Pegawai',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/employees'
                        },
                        {
                            title: 'Supplier',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/supplier'
                        },
                        {
                            title: 'Pemesanan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/pemesanan'
                        },
                        {
                            title: 'Laporan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/laporan'
                        },
                    ],
                },
                {
                    title: 'CS',
                    icon: 'mdi-laptop',
                    items: [{
                            title: 'Pelanggan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/pelanggan'
                        },
                        {
                            title: 'Hewan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/hewan'
                        },
                        {
                            title: 'Transaksi Produk',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/TransaksiProduk'
                        },
                        {
                            title: 'Transaksi Layanan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/TransaksiLayanan'
                        },
                    ]
                },
                {
                    title: 'Kasir',
                    icon: 'mdi-cash',
                    items: [{
                            title: 'Transaksi Produk',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/kasir/TransaksiProduk'
                        },
                        {
                            title: 'Transaksi Layanan',
                            icons: 'mdi-checkbox-blank-circle',
                            route: '/pegawai/kasir/TransaksiLayanan'
                        },
                    ]
                },
            ]
        }
    },
    computed: {
        Prodfilter: function () {
            return this.produks.filter(function (u) {
                if (parseInt(u.MIN_STOCK) > parseInt(u.STOCK)) {
                    return true;
                }
            })
            
        },
    },
    methods: {
        logout() {
            this.$session.destroy();
            this.$router.push('/');
        },
        getData() {
            if (!this.$session.exists()) {
                this.$router.push('/login');
            } else {
                if (this.$session.get('role') != 'Admin') {
                    
                } else {
                    var uri = this.$apiUrl + '/produk'
                    this.$http.get(uri).then(response => {
                        this.produks = response.data.Data
                    });
                }
            }
        },
    },
    mounted() {
        this.getData();
    }
}
</script>
