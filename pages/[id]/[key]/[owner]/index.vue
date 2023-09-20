<script setup>
import { useOwnerStore } from '~/stores/owner';
import { useChannelStore } from '~/stores/channel';
import { useInvoiceStore } from '~/stores/invoice';
import { useTransactionStore } from '~/stores/transaction';
const ownerStore = useOwnerStore()
const channelStore = useChannelStore()
const invoiceStore = useInvoiceStore();
const transactionStore = useTransactionStore();
const route = useRoute()
const isLoading = ref(false)
const isSubmit = ref(false)
const router = useRouter();
const owner = ref({})
const channel = ref([])
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
  if (owner.value){
    loadChannelFromServer(owner.value.paymentkey)
  }else{
    await navigateTo('/not-found')
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
    loadFromServer(invoice.value.ownerid)
  }else{
    await navigateTo('/not-found')
  }
  isLoading.value = false;
};

const loadChannelFromServer = async (key) => {
  await channelStore.getChannel(key);
  const result = channelStore.datachannelGetter.data.reduce((r, { group: group, ...object }) => {
        var temp = r.find(o => o.group === group);
        if (!temp) r.push(temp = { group, children: [] });
        temp.children.push(object);
        return r;
    }, []);
    
  channel.value = result
};

loadFromServerInvoice()
const submitTransaction = async (code) => {
    isSubmit.value = true;
    var res = await transactionStore.postTransaction({'key': owner.value.paymentkey, 'paymentcode': code, 'data': invoice.value});
    if (res.success){
        setTimeout(async () => {
            isSubmit.value = false;
            router.back()
        }, 300);
        
    }else{
        isSubmit.value = false;
    }
}

const backButton = () => {
    isSubmit.value = true;
    setTimeout(async () => {
        isSubmit.value = false;
        router.back()
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
            <div class="flex items-center justify-between mb-8 border-b-2 border-gray-300 pb-2">
                <div class="items-center mr-4">
                    <div class="text-gray-700 font-bold text-xl mb-2">{{ owner?.companyname }}</div>
                    <div class="text-sm">Alamat : {{ owner?.address }}</div>
                    <div class="text-sm">Telp ({{ owner?.phone }}) Email ({{ owner?.email }})</div>
                </div>
            </div>
            
            <div class="pb-4">
                <div class="rounded-3xl p-px bg-gradient-to-b from-blue-300 to-gray-300 dark:from-blue-800 dark:to-purple-800">
                    <div class="rounded-[calc(1.5rem-1px)] p-2 bg-white dark:bg-gray-900">
                        <h2 class="text-xl text-right font-bold">Total Rp. {{ invoice.items.map(sub => sub.subtotal).reduce((price, nextprice) => Math.floor(price) + Math.floor(nextprice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</h2>
                    </div>
                </div>
            </div>
            <div class="pb-0">
                <h2 class="text-xl font-bold">Silahkan Pilih Metode Pembayaran</h2>
            </div>
            <div class="mb-16">
                <template v-for="(item, i) in channel">
                    <div class="m-auto w-full bg-white shadow border-t-4 mt-4 border-red-600 rounded">
                        <header class="p-2 border-b flex"> 
                            <div class="flex flex-col">
                                <h1 class="text-xl font-mono text-red-600"> {{ item.group }}</h1>
                            </div>
                        </header>
                        <div class="grid grid-cols-2 gap-4">
                            <template v-for="(n, i) in item.children">
                                <div class="bg-white p-2 cursor-pointer rounded-2xl shadow m-2" @click="submitTransaction(n.code)">
                                    <div class="overflow-x-hidden relative">
                                        <img class="h-18 rounded-xl w-full object-fill p-2" :src="`${ n.icon_url }`">
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            
            <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2">
                <button v-if="!isSubmit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-4 rounded-full shadow-lg" @click="backButton">
                 Kembali
                </button>
                <button v-else class="inline-flex items-center font-bold py-2 px-4 mb-4 text-white btn bg-blue-500 hover:bg-blue-500 cursor-not-allowed rounded-full shadow-lg" disabled>
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </button>
            </div>
        </template>
     </div>
</template>