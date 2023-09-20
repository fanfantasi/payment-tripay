<script setup>
import { useOwnerStore } from '~/stores/owner';
import { useInvoiceStore } from '~/stores/invoice';
import { useDayStore } from '~/stores/day';
const day = useDayStore()
const dayjs = useDayjs()
const invoiceStore = useInvoiceStore();
const ownerStore = useOwnerStore()
const isLoading = ref(false)
const isSubmit = ref(false)
const route = useRoute()
const invoice = ref({})
const owner = ref({})

const loadFromServerInvoice = async () => {
  isLoading.value = true;
  await invoiceStore.getInvoice(
    `?in=${route.params.id}`
  );
  invoice.value = invoiceStore.datainvoiceGetter.data;
  if (invoice.value){
    loadFromServer(invoice.value.ownerid)
  }else{
    await navigateTo('/not-found')
  }
  isLoading.value = false;
};

const loadFromServer = async (id) => {
  await ownerStore.getOwner(
    `?in=${id}`
  );
  owner.value = ownerStore.dataownerGetter.data;
  if (invoice.value.reference != null || invoice.value.status =='UNPAID'){
        setTimeout(async () => {
            isSubmit.value = false;
            await navigateTo(`${route.params.id}/${owner.value.paymentkey}/reference/${invoice.value.reference}`)
        }, 300);
    }
};
loadFromServerInvoice();
const submitPembayaran = () => {
    isSubmit.value = true;
    if (invoice.value.reference != null && invoice.value.status =='UNPAID'){
        setTimeout(async () => {
            isSubmit.value = false;
            await navigateTo(`${route.params.id}/${owner.value.paymentkey}/reference/${invoice.value.reference}`)
        }, 300);
    }else{
        setTimeout(async () => {
            isSubmit.value = false;
            await navigateTo(`../${route.params.id}/${owner.value.paymentkey}/${owner.value.id}`)
        }, 300);
    }
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
                    <div class="flex items-center justify-between mb-8">
                        <div class="items-center mr-4  w-1/2">
                            <div class="text-gray-700 font-bold text-xl mb-2">{{ owner.companyname }}</div>
                            <div class="text-sm">Alamat : {{ owner.address }}</div>
                            <div class="text-sm">Telp : {{ owner.phone }}</div>
                        </div>
                        <div class="text-gray-700 mr-4">
                            <div class="font-bold text-xl mb-2">INVOICE</div>
                            <div class="text-sm">Tanggal : {{ dayjs(invoice?.createdat).format('DD MMM YYYY')}}</div>
                            <div class="text-sm">Invoice : #{{ invoice?.invoiceid }}</div>
                        </div>
                    </div>
                    <div class="border-b-2 border-gray-300 pb-8">
                        <h2 class="text-xl font-bold mb-2">Bill To:</h2>
                        <div class="text-gray-700">{{ invoice?.customername }}</div>
                        <div class="text-gray-700">{{ invoice?.customerphone ?? '--' }}</div>
                        <div class="text-gray-700 mb-2">{{ invoice?.customeremail ?? '--'}}</div>
                    </div>
                    <table class="w-full text-left">
                        <thead>
                            <tr>
                                <th class="text-gray-700 font-bold py-2">Description</th>
                                <th class="text-gray-700 font-bold py-2 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in invoice?.items">
                                <td class="text-gray-700">{{ item.name }}</td>
                                <td class="text-gray-700 text-right"> {{ item.quantity }} x {{ Math.floor(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-end mb-8 mt-8">
                        <div class="text-gray-700 mr-2 font-bold text-xl">Total:</div>
                        <div class="text-gray-700 font-bold text-xl"> Rp. {{ invoice?.items.map(sub => sub.subtotal).reduce((price, nextprice) => Math.floor(price) + Math.floor(nextprice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
                    </div>
                    <div class="border-t-2 border-gray-300 pt-8 mb-16">
                        <div class="text-gray-700 mr-2">Pembayaran paling lambat pada hari <b>{{ day.dayInd(dayjs(invoice?.expired).format('d'))}}</b> Pukul <b>{{ dayjs(invoice?.expired).format('HH:mm A') }}</b>  Tanggal <b>{{ dayjs(invoice?.expired).format('DD MMM YYYY') }}</b>.</div>
                    </div>
                </div>
                <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                    <button v-if="!isSubmit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded-full shadow-lg" @click="submitPembayaran">
                    Bayar Sekarang
                    </button>
                    <button v-else class="inline-flex items-center font-bold py-2 px-4 mb-4 text-white btn bg-blue-500 hover:bg-blue-500 cursor-not-allowed rounded-full shadow-lg" disabled>
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Proses Bayar...
                    </button>
                </div>
        </template>
    </div>
</template>