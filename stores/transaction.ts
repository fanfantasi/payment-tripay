import { defineStore } from "pinia";


export const useTransactionStore = defineStore('transaction', {
    state: () => {
        return {
            datatransaction:{},
        }
    },
    getters:{
        transactionGetter(state){
            return state.datatransaction
        },
    },
    actions:{
        async getTransaction(getter:any, data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const trx = await request<any>(`/gettransaction.php${getter}`, {
                    method: "POST",
                    baseURL,
                    body: {
                        'key': data
                    }
                });
                this.datatransaction = trx._data;
            } catch (error:any) {
                throw error.data;
            }
        },

        async postTransaction(data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const trx = await request<any>(`/tripay-transaction.php`, {
                    method: "POST",
                    baseURL,
                    body: data
                });
                return trx._data;
            } catch (error:any) {
                throw error.data;
            }
        },

        async changeTransaction(data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const trx = await request<any>(`/tripay-change-transaction.php`, {
                    method: "POST",
                    baseURL,
                    body: {
                        'invoiceid': data
                    }
                });
                return trx._data;
            } catch (error:any) {
                throw error.data;
            }
        },
    }
});