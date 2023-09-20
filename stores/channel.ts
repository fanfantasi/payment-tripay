import { defineStore } from "pinia";


export const useChannelStore = defineStore('channel', {
    state: () => {
        return {
            datachannel:{},
        }
    },
    getters:{
        datachannelGetter(state){
            return state.datachannel
        },
    },
    actions:{
        async getChannel(data:any) {
            try {
                const { baseURL } = usePayloadUrl();
                const channel = await request<any>(`/tripay-channel.php`, {
                    method: "POST",
                    baseURL,
                    body: {
                        'key': data
                    }
                });
                this.datachannel = JSON.parse(channel._data);
            } catch (error:any) {
                throw error.data;
            }
        },
    }
});