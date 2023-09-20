<script setup>
import { useOwnerStore } from '~/stores/owner';
import { useInvoiceStore } from '~/stores/invoice';
import { useTransactionStore } from '~/stores/transaction';
import { useDayStore } from '~/stores/day';
const day = useDayStore()
const dayjs = useDayjs()
const ownerStore = useOwnerStore()
const invoiceStore = useInvoiceStore();
const transactionStore = useTransactionStore();
const route = useRoute()
const isLoading = ref(false)
const isSubmit = ref(false)
const isCopy = ref(false)
const textCopy = ref('Salin')
const router = useRouter();
const owner = ref({})
const transaction = ref([])
const invoice = ref({})

const loadFromServer = async (id) => {
  if (ownerStore.dataownerGetter.data){
    owner.value = ownerStore.dataownerGetter.data;
  }else{
    await ownerStore.getOwner(
        `?in=${id}`
    );
    owner.value = ownerStore.dataownerGetter.data;
  }
  
};

const loadFromServerInvoice = async () => {
  isLoading.value = true;
  if (invoiceStore.datainvoiceGetter.data){
    invoice.value = invoiceStore.datainvoiceGetter.data;
  }else{
    await invoiceStore.getInvoice(
    `?in=${route.params.id}`
    );
    invoice.value = invoiceStore.datainvoiceGetter.data;
  }
  
  if (invoice.value){
    await loadFromServer(invoice.value.ownerid)
    await loadTransactionFromServer(invoice.value.reference, owner.value.paymentkey)
    
    
  }else{
    await navigateTo('/not-found')
  }



  isLoading.value = false;
};

const loadTransactionFromServer = async (reference, key) => {
    await transactionStore.getTransaction(`?reference=${reference}`, key);
    if (transactionStore.transactionGetter.data){
        transaction.value = transactionStore.transactionGetter.data
        console.log(transaction.value.status != 'UNPAID' && transaction.value.status != 'PAID')
        if (transaction.value.status != 'UNPAID' && transaction.value.status != 'PAID'){
        setTimeout(async () => {
            const res = await transactionStore.changeTransaction(invoice.value.invoiceid);
            console.log(res)
            if (res.success){
                router.back();
            }
        }, 2000);
    }
    }
}

loadFromServerInvoice()

import { filename } from 'pathe/utils';

const glob = import.meta.glob('~/assets/img/*.webp', { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default])
);
const copyToClipBoard = (textToCopy) => {
    isCopy.value = true;
    navigator.clipboard.writeText(textToCopy);
    setTimeout(async () => {
        isCopy.value = false;
        textCopy.value = 'Berhasil';
    }, 300);
    setTimeout(async () => {
        textCopy.value = 'Salin';
    }, 1000);
}
const changeButton = () => {
    isSubmit.value = true;
    setTimeout(async () => {
        isSubmit.value = false;
        router.replace({ path : `../${owner.value.id}`})
    }, 300);
}
</script>
<template>
    <div class="bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto min-h-screen">
        <template v-if="isLoading">
            <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-50 flex flex-col items-center justify-center">
                <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray h-12 w-12 mb-4"></div>
                <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
            </div>
        </template>
        <template v-else>
            <div class="mb-20">
                <div class="flex items-center justify-between mb-8 border-b-2 border-gray-300 pb-2">
                    <div class="items-center mr-4">
                        <div class="text-gray-700 font-bold text-xl mb-2">{{ owner?.companyname }}</div>
                        <div class="text-sm">Alamat : {{ owner?.address }}</div>
                        <div class="text-sm">Telp ({{ owner?.phone }}) Email ({{ owner?.email }})</div>
                    </div>
                </div>
                
                <div class="relative h-12">
                    <div class="absolute top-0 right-0">
                        <img :src="images[transaction?.payment_method.toLowerCase()]" class="h-10 right" /></div>
                </div>

                <div class="m-auto w-full bg-white shadow p-2 border-t-4 border-green-600 rounded-xl">
                    <header class="p-2 border-b"> 
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col">
                                <h4 class="text-xs font-semibold">Nomor Referensi</h4>
                                <h2 class="text-sm font-mono text-green-600">{{transaction?.reference}}</h2>
                            </div>
                            <div v-if="transaction?.status == 'UNPAID'" class="py-2 px-4 text-xs leading-3 font-bold text-red-700 rounded-full bg-red-100 right"> {{ transaction?.status }}</div>
                            <div v-else-if="transaction?.status == 'PAID'" class="py-2 px-4 text-xs leading-3 font-bold text-green-700 rounded-full bg-green-100 right"> {{ transaction?.status }}</div>
                            <div v-else-if="transaction?.status == 'REFUND'" class="py-2 px-4 text-xs leading-3 font-bold text-blue-700 rounded-full bg-blue-100 right"> {{ transaction?.status }}</div>
                            <div v-else-if="transaction?.status == 'FAILED'" class="py-2 px-4 text-xs leading-3 font-bold text-gray-700 rounded-full bg-gray-100 right"> {{ transaction?.status }}</div>
                            <div v-else-if="transaction?.status == 'EXPIRED'" class="py-2 px-4 text-xs leading-3 font-bold text-gray-700 rounded-full bg-gray-100 right"> {{ transaction?.status }}</div>
                        </div>
                    </header>
                    <div v-if="transaction?.status === 'PAID'" class="flex flex-wrap p-2 w-full gap-4">
                        <div class="bg-white p-6  md:mx-auto">
                            <svg viewBox="0 0 24 24" class="text-green-600 w-16 h-16 mx-auto my-6">
                                <path fill="currentColor"
                                    d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                                </path>
                            </svg>
                            <div class="text-center">
                                <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Pembayaran Selesai!</h3>
                                <p class="text-gray-600 text-sm">Hari <b>{{ day.dayInd(dayjs(transaction?.paid_at*1000).format('d')) }}</b>, <b>{{ dayjs(transaction?.paid_at*1000).format('HH:mm A') }}, {{ dayjs(transaction?.paid_at*1000).format('DD MMM YYYY') }}</b>.</p>
                                <p class="text-gray-600 my-2">Terima kasih telah menggunakan layanan kami</p>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="transaction?.status === 'EXPIRED'" class="flex flex-wrap p-2 w-full gap-4">
                        <div class="bg-white p-6  md:mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-clock-cancel text-red-600 w-16 h-16 mx-auto my-6" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M20.997 12.25a9 9 0 1 0 -8.718 8.745"></path>
                                <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                                <path d="M17 21l4 -4"></path>
                                <path d="M12 7v5l2 2"></path>
                            </svg>
                            <div class="text-center">
                                <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Pembayaran Kadaluarsa!</h3>
                                <p class="text-gray-600 my-2">Harap Tunggu Sebentar</p>
                                <p class="text-gray-600 my-2">Invoice anda di proses kembali oleh kami</p>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="transaction?.status === 'FAILED'" class="flex flex-wrap p-2 w-full gap-4">
                        <div class="bg-white p-6  md:mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-rounded-x text-red-600 w-16 h-16 mx-auto my-6" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 10l4 4m0 -4l-4 4"></path>
                                <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                            </svg>
                            <div class="text-center">
                                <h3 class="md:text-2xl text-base text-gray-900 font-semibold text-center">Pembayaran Gagal!</h3>
                                <p class="text-gray-600 my-2">Status Pembayaran anda gagal.</p>
                                <p class="text-gray-600 my-2">Harap Tunggu ... Invoice anda di proses kembali oleh kami.</p>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="transaction?.status === 'UNPAID'" class="flex flex-wrap p-2 w-full gap-4">
                        <div class="flex flex-col w-full">
                            <h4 class="text-xs">Pembayaran dengan</h4>
                            <h1 class="text-sm"> {{ transaction?.payment_name }}</h1>
                        </div>
                        <div v-if="transaction?.qr_url == null" class="flex flex-col w-full">
                            <h4 class="text-xs">Kode Bayar/Nomor VA</h4>
                            <div class="flex items-center justify-between">
                                <div class="mr-4">
                                    <h1 class="text-sm"> {{ transaction?.pay_code }}</h1>
                                </div>
                                <div v-if="!isCopy" class="py-2 px-4 text-xs leading-3 font-semibold text-gray-700 rounded-md bg-gray-100 right cursor-pointer" @click="copyToClipBoard(transaction?.pay_code)"> {{ textCopy }} </div>
                                <div v-else class="inline-flex items-center py-2 px-4 text-xs font-semibold leading-3 text-gray-700 rounded-md bg-gray-100 right">
                                    <svg class="animate-spin -ml-1 mr-3 h-2 w-2 text-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ textCopy }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex flex-col w-full items-center">
                            <img :src="`${transaction?.qr_url}`" class="h-38 w-38 center">
                        </div>
                        <div class="flex flex-col w-full">
                            <div class="flex items-center justify-between">
                                <div><h4 class="text-sm">Tagihan</h4></div>
                                <div><h4 class="text-sm">Rp. {{ Math.floor(invoice.items.map(sub => sub.subtotal).reduce((price, nextprice) => Math.floor(price) + Math.floor(nextprice))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h4></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <div><h4 class="text-sm">Biaya Adminsitrasi</h4></div>
                                <div><h4 class="text-sm">Rp. {{ transaction?.fee_customer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h4></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <div><h4 class="text-sm font-bold">Jumlah Tagihan</h4></div>
                                <div><h4 class="text-sm font-bold">Rp. {{ transaction?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h4></div>
                            </div>
                        </div>
                        <div class="flex flex-col w-full">
                        </div>
                    </div>
                </div>
                <div v-if="transaction?.status === 'UNPAID'" class="m-auto mt-2 w-full bg-white shadow p-2 border-t-4 border-blue-600 rounded-xl">
                    <header class="p-2 border-b flex"> 
                        <div class="flex flex-col">
                            <h4 class="text-xs font-semibold">Tatacara Pembayaran</h4>
                            <h1 class="text-lg text-blue-600">{{ transaction?.payment_name }}</h1>
                        </div>
                    </header>
                    <div class="grid divide-y divide-neutral-200 max-w-xl mx-auto">
                        <div class="py-5 px-2" v-for="(res, i) in transaction?.instructions">
                            <details class="group">
                                <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span> {{ res.title }}</span>
                                    <span class="transition group-open:rotate-180">
                                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                    <div class="inline-flex items-top space-x-2 w-full" v-for="(st, i) in res.steps">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-blue-500 hover:text-indigo-600 hover:cursor-pointer">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                                                    
                                        </div>
                                        <div v-html="st"></div>
                                    </div>
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="transaction?.status === 'UNPAID'" class="fixed bottom-4 mb-4 left-1/2 transform -translate-x-1/2">
                <button v-if="!isSubmit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded-full shadow-lg" @click="changeButton">
                 Ganti Pembayaran
                </button>
                <button v-else class="inline-flex items-center font-bold py-2 px-4 mb-4 text-white btn bg-blue-500 hover:bg-blue-500 cursor-not-allowed rounded-full shadow-lg" disabled>
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Proses...
                </button>
            </div>
        </template>
        
    </div>

</template>