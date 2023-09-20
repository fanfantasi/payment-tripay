import { defineStore } from "pinia";


export const useInvoiceStore = defineStore('invoice', {
    state: () => {
        return {
            datainvoice:{},
        }
    },
    getters:{
        datainvoiceGetter(state){
            return state.datainvoice
        },
    },
    actions:{
        async getInvoice(data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const owner = await request<any>(`/getinvoice.php${data}`, {
                    method: "GET",
                    baseURL,
                });
                this.datainvoice = owner._data;
            } catch (error:any) {
                console.log(error)
                throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
            }
        },
    }
});