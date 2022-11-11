import * as moment from 'moment';
import 'favIcon-badge';

import { log } from '@/common/logger';
import { insertFaviconHTML } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import SessionManager from '@/common/SessionManager';
import { Moment } from '@/moment';
import * as PackageJson from '@/../package.json';
import Attendance from '@/werp/interfaces/Attendance';
import AnnualLeave from '@/werp/interfaces/AnnualLeave';
import SessionKeys from '@/werp/enums/SessionKeys';

const fetchAnnualLeave = async (): Promise<AnnualLeave> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
            pragma: 'no-cache',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F10%2F26&j_idt158_input=2022%2F11%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=jPxeINJOjGEGQmKXT%2F3zuvrgZAUo0CzrhH3rQKK%2Bc97eW9R6NOYxyfTSddz1GGF27wVwuWal71m8IhgEXUT%2BDAIqUt3acWst3I937X0mKlvggSZESYh6oF5lV1lnomLO8uZiqe%2B54FnA09n3hKjrifwAvCIH8%2FCXMGkkjzk9%2BxrXSu8lxMAWZC%2Brsen4o6phHlZzX0R9Atr%2BYMZRmvcv9fUJ2y6fyrwrBI95svf3be0H1Q2XjVVw675xaW0Qux5xAxm8l1Jqjd3Owou%2FIbLA5dRCSyQdUv2zStwjSm9wdQLys4nNVohy03GZDJTit%2FRc900l76jm14ivoklbAjq%2FCan6msSq%2FBv7IFrgUmpo0yqlXDBvAgBtXU8Ba%2BujpBusv9bD92mQaInVoLHgGTsstFVckYu7%2BfoDUuklPcgcjd97GAzrEznf2Wxv5rapNMjwSM%2FMmLEZSCq1uoAJT%2B9S0RBo5xQ3Is3%2BHzAdw5XNnHeAJd2aBq2ZADJoojcuzK5ZeWb8YWEU%2BM9%2BX1xRg4Bz4Em7C%2Ff75gqKsQ7CQjkCUmnJ5hCb0gRKP0oOs4K0xz8sjv1kVwVQ7be2htyy0T7mSstZHRERWk9yJdqiZ8HNzJhjTHv2LWPVfA3QVDg8FwK8boTZDXXUB14akws81FBFtKBLaj0%2FY2Dqb4bbCnbunnONIvyTWOG%2FaZ387FXz8I0PIDTqEvfYYd5XcqCMLvEMuPQmj92XfJMD%2BzYwOLAtR4YC5Vob4ANhII3y%2BI5z5LC4uQGK7FDpRukXLhjHJmBqWBHTHRa0GHhuN9%2FGHT9xu5IuJFufjTENcCq7CwUfiUg46tBLijVHaKf7XGf07qY4uzex4byX2kE26fYAbNVY2G4Is%2Fry209jbi14fKYb%2Fq9u5vFruGcXhkMcMUFvkdI1d1UhGappFJIO4Mc0950g9ggQs4uqbfxMOmF8k62BYJd9a86JI11vAVoh%2BIMqrJ5FYBmDXS6ELxDlJhj9LkJSioAGYlJo7lnwzqiKE4l9zyE8cCxf4HI%2BDxowirpONF00owShk9hzUU3Qg%2FNmu60pxmRHxBRuNzn35P9wjMUcbW%2FLgesZHhGDoR%2FhQJA4KvRDbnBEDawYlm7rY8hv5uj19BfpQJKNJn8fotXChuZzd%2FhpThkBdv2EFr7FoF4yk9QgXI1Lp2LzVKXqQYjAWqtqqvseffdz62%2BEaNXLWSUOK5garoN4CFM2H21G%2FDb008fWA%2Ff64n2ypVWwk%2BE1quvzvyZUuh74EItePlwUlhxX2aJ8LgW9RJCZlyktLuxj9mSTPKGgT9mXypa3Ky%2B0GfCGLaDUQVQkesdY997r21uNkPVyJqBEnK1HTHmmc4UW1im4g52f0GbfXm%2Bkb1PY871fyDD427ZBfcp00VGs4%2FObOsikjcokGzVfqx0Rou2ax7U4jnIMtZ5pT565EgUpRBwAUKjjUe0Aqggpcg2oecMsXE%2BHby58ApxE7NsQ%2BYs%2FcLpWOGA9SpMpoqaXR5bg1c953hteGxuteU42ZJgD9SB9uphtB6Wos1dyqgX%2BYMMZ0Vk4GpfE6tWG8VDhzJ9w8O2qxgfmZK60iZYLBMgeNNGbh0FPcCOdBIy3vlIJF9lO1242f0QISCeHz1BCNCBd3KHwJtB5sn6Yw8sojXt0fEDzq79yWL63491TPmgM%2BPuaRLF%2BcdOs5MfEsTcYOZj7HDEG7wLF29Jh6o5amPkn9ecTSNV9Zy%2FRhH%2Ffre981CGac5KkMXmtZPOKSX2sKJgLduED%2BKBXw6TL%2FpSXJdNleogqpv6zda2%2FlvPghytdnmIHHG4yMSALhIIC5FM%2BqkfccXhZrEGR2OgjuY29LJhtiyBQvAfs4LqGt94Db1CPgK8LY%2F3LOyQvDMiZ0F1INJoXCjpn5k%2FZOf4GOSS2ItudVe1A11zjcgR6t%2FQO%2FbYd2LrkOcR2EDCl%2Fx7Uka33W6VUh1f6cSpgK%2BAfZdlnxul0o0uKZJdytvRbGbr4CahC6AcwuvwCDfKixQFj6fk9MtIkLh3qFfTeGlrZWZpRH2inj%2BxrGJFk4yn5c4CxyizGl62ALTAge7%2B3D2x8v%2F5rEyP11IZjKoIWOgJilGFYOaNoDjECpF20BtJ%2BAAV4miLlI0HoW%2F%2BTFvFqwPvNjQNVF%2FpKPRRtRsmI%2FzF6iJZcaCes%2FxssdtU5m992I753fluxRk%2BKIhem0g%2BcsFlkqqVt2HygsJfi94oAncSrCNyHE01AvE0TGAPX4Ss%2FL%2BKiK2ceDaLcImcy6oPhMpM4yp043PzyqnN7hacGlPFMO2HN8bwkbU5Upfm2KuWNXsZKrWqKBXwzt6u07x3wDeiZ5El6jhRYJ8UyDB4%2Fu%2FM8QcIRrUQgscA0US3sjQaCnIogOeltQy99hPhg33zV2mnniSscnfOPAi%2Bv4AVQGb6zhz7YeaB19mZDoXi4nrl1zyKVUZb5XYwtgSm6okZ%2BpL%2Fgdvf3Dq8XfTRdz1GviENJbja%2F5h2s%2BDi7qqWQlVsNEIVXWCAiiodgJomD8wEK5%2BLZ9ECeIYmy%2FAHDwfEqxvcxAE%2F1MQ9saP07ZITI90ZQVYnxz9AYlu3GR3SjuCmLJ%2BBby2UCiRv5o6yfXZCD4UtJxfgMlpnS3HInj%2BnJd2xJAYEVzUZIZvWHPw9oL2lGFPSGnsakQ%2Ft3D%2B08mkr8K2wi1kDKCjPGFHMWMxSjg9fNPDi%2B2umOpP1KqqJbe5cri%2FGCrJD4Rfg50Ar90kndHz3OTgCDqRMT8GuuYwEKicByUlO3RDGmghGyp1CrSqJN78aADTTUXunFLlSw4QEKFTtP6amDB2WlpM27CeNZ6%2BQ2tETMLkRGliZdaIA8xHcesvuKMWbycTfZGhlqksDdpI8acZ8RW5USZ1j%2BhrMPt5A%2BP26H6kzH1J%2FMUAhxlQDyQpA1eTWJA%2FTIkaynoKWnT%2FNJCSQ3Cn0WEwklsS1RXtkWdLStXHgLPUm%2FxsFp%2BSlFbYR6z6IdS7SMCPBqtKxeQkltB6%2B%2FpMA49crOvNnZhm0j7UbzaHH1PgfTe6CKaXtK8dVTn%2FECA431F3LWGRJb4RmzyP4jdYAjqFKgVYN2R3Cdq90jIcr%2FLB%2Fhu6MvU6h0XdDaTBuqGDB2lmEgrJcTZC9kDtRuzTDKIIa4LD56TfjVgnLXJLiozhf8VVR64AeOPBEKqiGSJReN8kvZzwZaZH3DL%2FzKLNPQXojuxm%2BYpDfqJmciKN2Z9%2B0iwlPIpIsSy0i3yIp31fHRf8zxtjUcEAwpFriWNJQGTvBRoxfvoiiSJsWH7qre1e6%2BY2mEYQdun1alE5ku%2BHOUYN%2B93mcQHgWxDTIeDnjpiPqUHYYXAxnjZO99G55Ut8aPxGoJ4IwaBXW6PyVgdfX69gf2rObgxuU5Wdqut3tDTTPH4PW%2BcTZNAHuXy1ldUYzH9o2NglchYhHT9eMYrOwllo5Ctmqb2j2jUGEspRnFizDES5BofEYHuUR1PQW1upbexcCZafjF8CqjedzYNnAGKEezmEwwQO8Lp1Bgt7iywrdcMTQ7gAoRtwi%2BliPbaZldCd3MAxi%2BcFmhfbouldDsLAL%2BuJVgdpUwt5bG7Wig%2F7DTVnvuhLx9MkWzomkhYeC%2F0ZRQmHuNOJ7vhnCDHghNEhpJrN7XtubY1k1NQzT4FT8hc0NphJuKIHFebX%2BFRcySp36ZG70%2F%2FUiR8ASkENm0kbsF2wRGmHLx0GDGQUM0kC%2FdINVI3PO3p2loS%2F9Tbthf591wVeZgAsLuhPdpRxv1Yr6M07dhrUhGpe%2FbcCVKaQ4zC3C4URnyPsUYEVTe3zsXmOTFk96iLEjijb4fZ4xRfTsWbnqT9OJLpTdp6jImGAjW14O3ElEIg9fko%2FnruQyju8fkrAetGlJdxC7f4jMUc%2BHWQd4eLN5OoUXP%2Bhd4dwVTxXcR0i30m6xRFTmYjclYkxmIJ0T54ZeUSs3IXM3h9xoBBpF79zzPodq6k1ESdFCsu4CQaeyCb2KvUHYVOBo6If3chlUuj5%2FTpgXT30g8k9ypRSldx6vcFG1yeytrq4hH8S85avRbWVu5ENkGPJcva45%2FAbOAIckak7k7OalSqBm9woRiLi%2BDHW6%2BrrehkB1sK1EmTkTiq%2F%2BkkknvNAdRMFMPfBdSPir9V3kRrOEAWknP6x3NPRCUOUK8HDEpswmpTa9OQxov%2FAro8aEdM%2FWVG2KwaMm6QxWxjYKTWY0iqd3FQ6m%2FNDxPC3yCR2iRRN0B5Z%2BAGMRGX4BNku7O0bQwql2E3AqnfLa%2Fj1p9PTnWNfLUVWta5BthbnR9ti%2FR4mb5Tm5gMRRmPGnLBaLLLFAS8zx%2FgmsfNnJviYIDIIErjCHriiAhNoLiSLOsESq4sr%2FhHEXZ5Enu7up3kBBqSb9AeKzUCQhMFteJr5q8BWwyBQPZDW8aUWipoT%2F5UuBD6dVrRUb98FKlC0tr2LAm1%2BOiP8zJP0CA719IcPcNLkvfV5sNf0lL6PKh535MiH8G64F%2FyP9r1nvTuDiCrhVlEv%2FInLj5W57NgS1bGOJKah4lAIA2ScaOLFVJ84z%2BRFqhKcg60W8Sm2zLw%2FjNleiUlad6SR9VCH4NPP7%2FnaVQ56XQZu3dpa8g3Q1mSikRg6f7jqcKhz7BmO%2FOVxgg3rXAnkDKhIzhKM72c3vEFIFAEqTcfvgurzsAJJjp0qP1ZiPjl7l5g%2Fflgt3oC9JMTYIloAag4lGBJuadejQVTffYiK7L3aydjE5U2QQ3IFEGPHsVoDrVkP5jzgaZQmhEhcw0ehC%2BbGAfhmNOYJAUVZcu5QLJaTrgNOcnsoGz0ggOrHsdN7W9FykSWPEAQDwnG0nzDflWdQ%2B1MQhqkRdlN4prnp0QA79cRPjaz%2F8fcqwMffsTdygFZ5Ohbq1jWnJiE%2Bh8QRdrEyVONPB64Lh3UcJUF8HH%2Fq5HsLZzAi%2B59K%2FgiKNJBwlecMlyg4KV0V1Qnj5o5iFHlmdxwp6dymwHQ5TfFf373N4Gph0szGuqwWTiQf%2FSahAskqCL9mBP2aGPvKGCGxkLpwlBCEtkYwrxw%2BUtpS0UtR%2B1GHigR9cPERkgPxYEuKURkEh9MH5Q12w%2Fw%2FB2z6Z5OKxWOEKSUlsMOOE9iIYwJq4qNPQsRYkZr0g2Gvx%2FpJDZrGxb16nomG%2FesknKt3BxkTAcxScKAvZr4NkgyK6MAdlaqfGYOglmtC27XrfUq7jBT%2B%2FPyFXmGaGRXj7N9GDc2S%2B8niMrfGv8JAaEByJVNpX0AWQGMxj01NWKFFp9RBBZnIgZwP%2Bp1gAATPpL7PWRuYYG89xoUTs7CEPkqGcGs4FFTuCWLUBdSiQCb2hD9SeTmTxRNACXfYKzG0AmEDjQkF3TETvOxaYXXxluutfphS4JdOD5pAeYggnjsFkBwsb9ZTyw1pTCT0%2FUJS%2FhP1ooYkrZR8%2Fo2moyjNz8FiTS%2Fa5bw5X60bOJ4361RQGB9Nu9lBW1E3NTQ8VE9Hujn4lMa70HSLfT16PSZJmCfydxlikP3CC8LqPcezBVxVDZaqM3k8T8ucHyLw9FGhVOrkj%2BLR12lh6vUmSOTqReMoc2gFoGGPxBXpXEFogkp0yTXG%2BwrqHoHaJFPRmVfOQMs1Sdzd76B%2BeXJUtEQNj%2FHH%2FKbmqS7xd9th5rRHvJilI8yMuqeFYP9OVCUOBTSXrBFibbQQwICO6SUh4RkvtsgZ3WuSFYkahMhYNdTTUiIULh3FBIddShSxtFotIrHFoSmrIgaXz3bLFpHovB%2FCxUlyvrCBJ7W1H6I9nAK6kiM9FofmNc3lajVdqZRtHJnZve6C8pS9pkCuaNY1Gb9QGmLYJPw2yjrYl5aPWxZPixu%2BJuwmrU27mBrA8bTumnNBl%2FxyABSO30%2BsbQHZQ%2FsHboV0oFhTvN5DWsutmg3FiKwl%2FsINFDA7%2BiooAgn2icm8XmenjcWZ5BgeF2p0THqW%2Bp3PEMwYv7vx9%2BMPxie95IT1LYusYChTj6C1YXitnZSRt2nuYNTRFaoMjtSfCwIKmedOzKVKfn%2Bnr2J7s7AMgGvp9d9UqeSSX2aNuIAHL%2BivZLFbo%2F%2B1vOCt17rKQKH29pJl6Iepj2Zw1V3KjlcxvaBZKLWGQXuB1j%2Bko588pMCTq3liBfoCxio9%2B%2B8wCp7VWNKDfP1U79t7nULGIEjCTFarcOApHYEB0a4JyeVnn3FWJUxMF9s3Njb6vgS0x3F5Xv%2B3Skuez77sNT4ZDfHXiXWvMvwu7gsaFPlJT12JgubURshaWpw5uzBce8HgBwinOwZ9vTAYXmriGz%2FXDGwkhXCAWCo7QiXfNFaeZRPsTNfgTLdNG0HIaPLDO%2F2zwfcCMws72nPE7qkVFKhlZBiHFB5W4ueIgJEq%2BgBHfW8DiU%2FVLPjpn3w2sz9PUXc0RBM44ADhywEHJpqao7xK1lGnkr884CKvUxlPqwnzEGy%2FrgeO%2Fdo1ygsxCRh7dctTRo1sgKvHf62c3p0NwbkEh1pGJRoMe5uvzwE5t%2BbWmkaAaH8Q7nXryEzhP%2FxEmYrG5WbGeKYSu8nX9xZNBUKeIuOMJvn3%2BcnOVpTcZWgjcmpHNGBDO8kez4y33%2BEJY9W%2BCPaN%2FJ2keIgvzNSQYbyJMrbYeKjU88zWII%2BsuN9gWPXdELfAgos4AibpYvc8fT%2BkyGs9IPMmMNkMp5%2FENK%2B63yRoIJcsQes3nCB3HaGffu3R7S2bEVZ2kmBtkopBZ9%2FUMYc9NmtIA10jIW5FtsDyjERkGGxL%2BYE9825iuyyNoGsbPweXlo%2By1HJaDAMbsYNiP91NzCEjxz8OIKjcRqPFfmlDxVNsMooW1hDBWStzwxbQ3ETx99OrEbAiX7Zg2SusX9xLF13k12ruErWN1djcNavZjUA5xHzgqnt46pXC2y1wJ0R9Q0r6BgHxy9OnNZ4KkHPIlGdYBg1P%2BDfRoWeLxp3AkKeC8aTnkLbGxblu6Wh04WeDGDVXw1MY2LrUI4jLo97aADtjawouYR8w4GeiVphWJC%2F%2BmhlaD5pj%2B%2Bt1qM02Yb9xPbVkQSlyXkhNxnApQb3TZ3hNduXQUy2mQOpCadJCS8OwVmMdMqMUzZaOe1snG3yp9%2B4zslTcuDHM1tdynV9HhdEOXcvKTn%2B0M%2BnEyK%2BWfG1LIrNAk5cZpgux5Qs%2BAZtypzdJUDkUeHtVRg3jt1iU8xVMojysJ6OpZ8IleXQrGEuVp8oU4xJrNJ6%2BC5TT7lX3E%2BekbuTz84PCOfHqNMc8k7cTuytxAg%2Bod0QQ9HWXt7SJAsxt7xuUAD%2Ffu5aiLqw0BwFLgpeGvQ9bCFNOBSppQ3QZQ5wHenYCcgUAdYxdqbyyzc06mP911x1H%2FUePFJeBmoG7cufGq53c0O1N6C%2FTfvst4MFbEt0%2B8tFtCXR8EPccLpvPR0sjJrHdR4zXqAv20dM0WjrAMDJ85xOFAKBSf0Z8qcmLD6j1Wn0%2F1ZwLWQLcpUQS4APwVmmzNWaRPnf6MmgXhAE1DlENAN1sra9woOwAQZX%2BRJTHobGsfj4tGxewjjvQiy1cQgHJ3V5WNjoVtK1YBPf%2FD4xhuvPGqSDdBHLHcK99UC%2F5tJCLU3KzQjbZ8pZyLTkh%2Fonf2O16zlz38hwz9NgsocNTlAmDO0nTRzTbAzX3OLJ5C0u4o6uzs6qFV44SRLEPO0Yk4TQKhty%2BYmK1FfhTg80NJmepWWzxPjEbrTI3WiEgnQg9OPVGEpGDf8hRh8LBwOyEXscP9v1wTtViO%2Fyp%2FDZZkxAMSOm86faflOIPZ0bQ%2F%2Fl%2FL7Efd%2F6mc031pmaEvEUNjQhghmJnBFxfDOv8iWJifAgk%2FRbnv81yMkU41pnSBxGueLP%2FGxZxY1CXwQubK%2FLLpXIhosB5z7mfsOOx%2BoalkWw73Rq9tnF6Kub%2FU8jki5s7CC8JpeoUdAO7CSoabGvZOTnpTD1DRFyGM%2BptH08Di84qlR%2FqrR3ypk9k2CEYX8GuaoD3VW3JZ3kUZVqJg9Pi8vL5xKJveHSQ%2FMr0FGqU%2F0gwmmD%2Br3fr0Wqi%2BCGXFkC48GNn7Lw7ms5kpcnZfQmSktAuorOhP3iKxXW1F6WCkPujBrCXVLKcI5rJQ5wdo9DyBf5%2BH8fRO%2B9H18QBYknz4uehOZu7F%2FLlMQPvpsEcraikdsS2qPf6E4%2BJFk4w%2BOrMuWen2ZgQ54lvAVPZsFhMeQKPGGUX%2FSXAdmoPFETYy7ECMUUZwXPcdPzKCurF4s%2F2gadsbxeQYWstBH6f%2FugDbbRWu%2F7wBkAOOgvZNEf46pAFT7DS2jZnFpgnM%2B9yBUS2TOUoOhU1Da0Jh6t5tg',
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            const labels: NodeListOf<HTMLLabelElement> = html.querySelectorAll('#annual-now-year li label:nth-child(2)');
            return {
                totalHours: parseInt(labels.item(0).innerText),
                leaveHours: parseInt(labels.item(1).innerText),
                notLeaveHours: parseInt(labels.item(2).innerText),
                startDatetime: labels.item(3).innerText,
                endDatetime: labels.item(4).innerText,
            };
        });
};

const showSignInNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const { signInDate, signOutDate }: Attendance = formatAttendance(attendances[0]);
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const todaySignInContent: string = signInDate.format('HH:mm', { trim: false });
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(currentDate, 'minutes');
    const currentDateString: string = currentDate.format('YYYYMMDD', { trim: false });

    if (todaySignInContent === '') {
        if (SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽到',
            {
                body: '尚未有簽到的紀錄',
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽到通知`);
                SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION, currentDateString);
            }
        );
    }

    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        if (SessionManager.getByKey(SessionKeys.OFF_WORK_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(SessionKeys.OFF_WORK_NOTIFICATION, currentDateString);
            }
        );
    }
    // 即將下班
    else if (predictedSignOutLeftMinutes < 30) {
        if (SessionManager.getByKey(SessionKeys.SIGN_OUT_NOTIFICATION) === currentDateString) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `${predictedSignOutLeftMinutes > 0 ? `預計 ${predictedSignOutDate.fromNow()}下班` : '符合下班條件'}`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SessionKeys.SIGN_OUT_NOTIFICATION, currentDateString);
            }
        );
    }

    const signInNotificationTimer: number = window.setTimeout(
        (): void => showSignInNotification(attendances),
        5 * 60 * 1000
    );
    SessionManager.setByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER, String(signInNotificationTimer));
};

const formatEarliestSignInDate = (signInDate: Moment): Moment => {
    const signInDateString: string = signInDate.format('YYYY/MM/DD', { trim: false });
    const earliestSignInDate: Moment = moment(`${signInDateString} 08:00`);
    if (signInDate.isBefore(earliestSignInDate)) {
        return earliestSignInDate;
    }
    return signInDate;
};

const formatEarliestSignOutDate = (signOutDate: Moment): Moment => {
    const signOutDateString: string = signOutDate.format('YYYY/MM/DD', { trim: false });
    const earliestSignOutDate: Moment = moment(`${signOutDateString} 17:00`);
    if (signOutDate.isBefore(earliestSignOutDate)) {
        return earliestSignOutDate;
    }
    return signOutDate;
};

const formatAttendance = (attendance: Attendance): Attendance => {
    return {
        ...attendance,
        signInDate: formatEarliestSignInDate(attendance.signInDate),
    };
};

const getTotalRemainMinutes = (attendances: Attendance[]): number => {
    let remainMinutes: number = 0;
    for (const attendance of attendances) {
        remainMinutes += getRemainMinutes(attendance);
    }
    return remainMinutes;
};

const getRemainMinutes = (attendance: Attendance): number => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(attendance);
    const diffMinutes = signOutDate.diff(signInDate, 'minutes');
    if (diffMinutes === 0) {
        return 0;
    }
    return diffMinutes - 9 * 60;
};

const getAttendanceByTr = (tr: HTMLTableRowElement): Attendance => {
    const currentDate: Moment = moment();
    // ['09/12 (一)', '09:38', '18:41']
    const datetimeStrings: string[] = tr.innerText.split('\t');
    const dateString: string = `${currentDate.year()}/${datetimeStrings[0].split(' ')[0]}`;
    const signInDate: Moment = moment(`${dateString} ${datetimeStrings[1]}`);
    const signOutDate: Moment = moment(`${dateString} ${datetimeStrings[2]}`);
    return {
        signInDate,
        signOutDate,
    };
};

const getAttendanceByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>): Attendance[] => {
    const attendances: Attendance[] = [];

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        attendances.push(getAttendanceByTr(tr));
    }

    return attendances;
};

const updateTodayAttendanceContent = (td: HTMLTableCellElement, attendances: Attendance[]): void => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(attendances[0]);
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutTimeString: string = predictedSignOutDate.format('HH:mm', {
        trim: false,
    });
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');

    td.innerHTML = `<h6> ${predictedSignOutTimeString} </h6>`;
    if (predictedSignOutLeftMinutes > 0) {
        td.innerHTML += `<div> 預計 ${predictedSignOutDate.fromNow()} </div>`;
    } else {
        td.innerHTML += `<div> 符合下班條件 </div>`;
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        td.innerHTML = `<div> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+${Math.abs(
            todaySignOutLeftMinutes
        )})</span></div>`;
    }

    // 定時更新內容
    const todayAttendanceContentTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班內容');
        updateTodayAttendanceContent(td, attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER, String(todayAttendanceContentTimer));
};

const updatePastDayAttendanceContent = (td: HTMLTableCellElement, attendance: Attendance): void => {
    const signInTimeString: string = attendance.signInDate.format('HH:mm', {
        trim: false,
    });
    const signOutTimeString: string = attendance.signOutDate.format('HH:mm', {
        trim: false,
    });

    // 國定假日或請假
    if (signOutTimeString === '00:00' && signInTimeString === '00:00') {
        td.innerHTML = '';
        return;
    }

    const remainMinutes: number = getRemainMinutes(attendance);
    // 顯示超過或不足的分鐘數
    td.innerHTML += ` <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, attendances: Attendance[]) => {
    for (let i = 0; i < attendances.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const td: HTMLTableCellElement = tr.getElementsByTagName('td').item(2);
        if (i === 0) {
            updateTodayAttendanceContent(td, attendances);
        } else {
            updatePastDayAttendanceContent(td, attendances[i]);
        }
    }
};

const updateAttendanceFavicon = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, attendances: Attendance[]) => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(attendances[0]);
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const faviconBadge: FavIconBadge = document.querySelector('favicon-badge');
    faviconBadge.textColor = 'white';
    faviconBadge.badgeSize = 16;

    if (predictedSignOutLeftMinutes > 0) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#006600';
        faviconBadge.badge = `${predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1]}${
            predictedSignOutLeftMinutes > 60 ? 'H' : ''
        }`;
    } else {
        document.title = '符合下班條件';
        faviconBadge.badgeColor = '#e69500';
        faviconBadge.badge = '可';
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        document.title = `超時工作(+${Math.abs(todaySignOutLeftMinutes)})`;
        faviconBadge.badgeColor = '#cc0000';
        faviconBadge.badge = '超';
    }

    // 定時更新內容
    const todayAttendanceFaviconTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班 Favicon');
        updateAttendanceFavicon(trs, attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER, String(todayAttendanceFaviconTimer));
};

const getAnnualLeaveTemplate = (annualLeave: AnnualLeave): string => {
    return `
<div id="formTemplate:j_idt323" class="ui-outputpanel ui-widget">
  <div class="ui-g-12 waiting-task-g">
    <div class="title-name ui-g-4 ">特休狀況
    </div>
    <div class="ui-g-8 ">
      <span class="todocss">
        <ul class="todo-ul-list">
          <li>
            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
            已休(含在途)：${annualLeave.leaveHours}
          </li>
          <li>
            <img id="formTemplate:j_idt329:2:j_idt332" src="/portal/javax.faces.resource/werp_red.png.xhtml?ln=images" alt="">
            <label id="formTemplate:j_idt329:2:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
            <a href="/hr-attendance/leave/personal/personal-apply.xhtml" target="_blank" class="select-link-red">未休：${annualLeave.notLeaveHours}</a>
          </li>
          <li>
            <img id="formTemplate:j_idt329:0:j_idt331" src="/portal/javax.faces.resource/werp_blue.png.xhtml?ln=images" alt="">
            <label id="formTemplate:j_idt329:0:j_idt333" class="ui-outputlabel ui-widget" style=" width: 0px;"></label>
            有效日：${annualLeave.endDatetime}
          </li>
        </ul>
      </span>
    </div>    
  </div>
</div>
<table id="formTemplate:j_idt319" class="ui-panelgrid ui-widget" style=" width: 100%; border: none;margin-top: 2px;margin-bottom: 2px; " role="grid"><tbody><tr class="ui-widget-content ui-panelgrid-even" role="row"><td role="gridcell" class="ui-panelgrid-cell" style="border-bottom-color: #C4C4C4;border-bottom-width: 0.5px;border-top-color: white;                                border-left-color: white;border-right-color: white;"></td></tr></tbody></table>
    `;
};

const getUpdateLogs = (): string[] => {
    return [
        'v2.4.2(20221111) 更新特休 TOKEN',
        'v2.4.1(20221111) 修正 favicon 無限增生的問題',
        'v2.4.0(20221107) 修正 favicon 失效的問題',
        'v2.3.9(20221104) 根據不同剩餘時間來顯示 favicon 樣式和網頁標題',
        'v2.3.8(20221028) 下班提示訊息和畫面一致化',
        'v2.3.7(20221026) 修改彈跳視窗「即將符合下班條件」字眼為「預計 MM 分鐘後」',
        'v2.3.6(20221024) 解決過早上班或是預測過早下班的問題',
        'v2.3.5(20221020) 顯示「符合下班條件」資訊',
        'v2.3.4(20221018) 顯示超時工作的資訊',
        'v2.3.4(20221018) 清空重複執行的出缺勤 timer',
        'v2.3.3(20221014) 更新特休 TOKEN',
        'v2.3.2(20221013) 顯示更新日誌',
        'v2.3.1(20221013) 新增每五分鐘(簽到、簽退、超時工作)通知訊息視窗',
        'v2.3.1(20221013) 通知訊息視窗點擊「關閉」後當天不會再顯示',
        'v2.2.0(20221012) 解決特休狀況失效的問題',
        'v2.2.0(20221012) 顯示版號和版權資訊',
        'v2.2.0(20221012) 忽略國定假日的簽退內容提示文字',
        'v2.1.0(20221006) 解決每次 wrep 更新時畫面為空的問題',
        'v2.0.0(20221003) 顯示特休狀況',
    ];
};

const appendCopyrightAndVersion = (body: HTMLElement): void => {
    const copyRightDiv: HTMLDivElement = document.createElement('div');
    copyRightDiv.innerText = `Kenny design © V${PackageJson['wrep-version']}`;
    copyRightDiv.style.textAlign = 'right';
    copyRightDiv.title = getUpdateLogs().slice(0, 5).join('\n');
    body.append(copyRightDiv);
};

const resetAttendanceTimers = (): void => {
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.SIGN_IN_NOTIFICATION_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER)));
    window.clearTimeout(Number(SessionManager.getByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER)));
};

const initializeFaviconBadge = (): void => {
    document.querySelectorAll('favicon-badge').forEach((faviconBadge: FavIconBadge) => {
        faviconBadge.remove();
    });
    document.querySelectorAll('link[rel="shortcut icon"]').forEach((linkElement: HTMLLinkElement) => {
        linkElement.remove();
    });
    insertFaviconHTML(`<favicon-badge src="" />`);
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then((table: HTMLTableElement) => {
        if (
            table.innerText.includes('預計') === true ||
            table.innerText.includes('符合下班條件') === true ||
            table.innerText.includes('超時工作') === true
        ) {
            return;
        }
        initializeFaviconBadge();
        resetAttendanceTimers();
        log('出缺勤表格已經載入');
        const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
        const attendances: Attendance[] = getAttendanceByTrs(trs);
        updateAttendanceContent(trs, attendances);
        updateAttendanceFavicon(trs, attendances);
        showSignInNotification(attendances);
        appendCopyrightAndVersion(table.parentElement.parentElement);
    });

    // 待辦事項表格
    waitElementLoaded('.waitingTaskMClass').then(async (table: HTMLTableElement): Promise<void> => {
        if (table.innerText.includes('特休狀況') === true) {
            return;
        }
        log('待辦事項表格已經載入');
        const annualLeave: AnnualLeave = await fetchAnnualLeave();
        const annualTemplate: string = getAnnualLeaveTemplate(annualLeave);
        table.insertAdjacentHTML('afterbegin', annualTemplate);
    });
};

(function () {
    moment.locale('zh-tw');
    main();
    window.setInterval((): void => {
        main();
    }, 5 * 1000);
})();
