import { defineStore } from "pinia";


export const useOwnerStore = defineStore('owner', {
    state: () => {
        return {
            dataowner:{},
        }
    },
    getters:{
        dataownerGetter(state){
            return state.dataowner
        },
    },
    actions:{
        async getOwner(data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const owner = await request<any>(`/getowner.php${data}`, {
                    method: "GET",
                    baseURL,
                });
                this.dataowner = owner._data;
            } catch (error:any) {
                throw error.data;
            }
        },
    }
});