import { defineStore } from "pinia";

export const useDayStore = defineStore('day', {
    actions:{
        dayInd(day:any){
            let dayname;
            switch(parseInt(day)) {
                case 0: dayname= "Minggu"; break;
                case 1: dayname= "Senin"; break;
                case 2: dayname= "Selasa"; break;
                case 3: dayname= "Rabu"; break;
                case 4: dayname= "Kamis"; break;
                case 5: dayname= "Jum'at"; break;
                case 6: dayname= "Sabtu"; break;
            }
            return dayname
        }
    }
})