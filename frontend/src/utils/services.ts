import backupPng from "../assets/backup.png";
import impressoraPng from "../assets/impressora.png";
import internetPng from "../assets/internet.png";
import perifericosPng from "../assets/periféricos.png";
import softwarePng from "../assets/software.png";
import virusPng from "../assets/anti_virus.png";


export const SERVICES = {

    backup: {
        name: "Backup e recuperação de dados",
        icon: backupPng,
        value: 100.00,
    },
    virus: {
        name: "Diagnóstico e remoção de Vírus",
        icon: virusPng,
        value: 85.00,
    },
    software: {
        name: "Instalação e Atualização de Software",
        icon: softwarePng,
        value: 120.00,

    },
    internet: {
        name: "Problemas com a conectividade de Internet",
        icon: internetPng,
        value: 70.00,
    },
    printer: {
        name: "Suporte a Impressoras",
        icon: impressoraPng,
        value: 110.00,
    },

    peripherals: {
        name: "Suporte a Periféricos",
        icon: perifericosPng,
        value: 75.00,
    },
}

export const SERVICES_KEYS = Object.keys(SERVICES) as Array<
    keyof typeof SERVICES
>


