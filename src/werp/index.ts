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
import { getTodayAttendance, getWeekAttendances } from '@/werp/classes/attendanceUtility';
import { formatTime, isToday } from '@/werp/classes/momentUtility';
import {
    getAnnualLeaveTemplate,
    getAttendanceDateTemplate,
    getAttendanceSignInTemplate,
    getAttendanceSignOutTemplate,
    getLeaveNoteTemplate,
} from '@/werp/classes/template';

const fetchAnnualLeave = async (): Promise<AnnualLeave | null> => {
    return await fetch('https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F11%2F26&j_idt158_input=2022%2F12%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=OR%2Ba9n7kVAraYse5Z03wpLhCqA94KT7cy%2BoFEmAvJpqZJ8767p2PTko21O0BdneqJC65n6vqCCtPbgLjwWSH8MAs6004OopAad6%2BHTvSBDAajD%2FafgecejTXlakICm5EL%2BTx1lUILp2w15cluGX4wT%2BhZ4LNxsyLufVucxMHWdgIfvaPWBDpSP4wbmKQ077jp70x3DnvrTQEU%2F1bfLj%2BGo%2FhdpA9J7Xmo9jeIDP9Xs5KKayzvAt8KwPElDqPgASt%2F5VJ8S5f7lWzDgjE699W3gLUf%2FLKspRNRfKcocghRHHetBYGYOLyBW4zVGpdvM6H9W%2F2YqzYsdsCvqyLMsezyZTzgvU%2FGxAHPM9msrx7slvWUTbhorVr9jtgQySMb6UjakFCum%2BfjvQAVuxwmyDkWCscJdmv1QAel3BlWBDZLxSFHKKFCb7XGXRZSFKp5vowOMp1mgwmRhlSn90a0UOiwqMpIHigv1tDBCozjInpoOpQm8K%2BXxUDnuaCYIA6vjlZC1OWrqhYM3BjcjAVtXRHYh8g9lkuWU%2FuUnAy9SR%2BY%2BcFGbaIazvBcPDaQdWi0D9582ooBhFO6f6E%2BsS5b2YGvtJa5qbvXMr8TuOZhGk6scr9dNK7Vv8h3MPVkt9iYuJ%2F55ORjgM6XF7V0UC%2B0Jlv8LlQASQ2EiLcr1kSPblsUrXEU6Pl5%2F%2B3obMPWZl5EhyLQgS%2BucW%2BV7uhF3QOBjvxM89fZIEL49VnPXyweaXmS9i0p3FElhmUII4N7JPz%2BAVRvFAMI88DsgJN%2BM0qMQIsUiNJxf%2BwIwMTpEC4MaGhimDcjnZ1zQa%2B4MX833TMvC79Y7LEbp3NJDGoWNbB648b9X%2F1HG2JpcEkpH0lvLxuGusELFrj5rCe%2FJz9Riim%2FK3llTwrl84dSVu9FxddwKnAcwUJJDho3yxHoaxTKskZZEagjsY3Gny3McQaps4ceSjyJEWMPpqjv9IACScR4jnohvRG37Se2FCfvmvVvZY1wupHETfBizLVomy7qIJ9I3CZpqz066M4JmbMYGH79UCdF4aZCjNHLFQ3MHIQRN85nkP8gLrdODvQqKv78kZwrR5elzt36aKdiQiO8%2FO9RwUL%2B%2B4bdcMAbsgEjiA0Bk6iF7ODnh0RxKElIS08HsB4GND4DwC1aB2BfZpDADKQNNHdO%2FXU1F4LZmGVSEk3gXs5l%2BesBfs9ymS%2BsV7uAUY54Hih4wfXJ6EwOl6GJlG3B80RMmGdcZUmtc8jbn5XILIEwKMbrcG8ahGSd%2BC7rf3ytRvjE3UQ%2Fr6q7l9T%2FTnXWa00KKxtrTwF3M%2FrE9%2Fpkge3XeYwm0vZwgtiZiEg4%2F6zhRh8iwIASKvGZ0JWgFzJqAaImbYLgM8%2F0wGvFt0953zZZ3M%2FLnRmU%2FC2YV%2F4dL7A8Gz8L8KpJoIvM0RR5l5u5gIWC4AdSticS1bA8b%2BEh7KrHNWRrAnXe3wWzL%2B%2FU%2BkzsZhb3u1XqhwsSkCjXrN1JseVRRHWr0hOHPYZDWeDbgPEP2XgnDGjL%2B%2BfCiX3WZb5bQtHZ7EULwNPCsf1PwUR5frejAULXDoBvXPsYXUEcQiX9XhCo02h2%2BNbB3a8kytl0dN86SxWtmZ1TMis5JugAg%2BqPA%2BWzH9ulRcIMjYhnnj51PcHYSnHAJBh80Acl8yKH3plnZsr14c%2FcPTVp0%2F40OdKOFCx98rBvKFiywmeUYYNAuIjLFBYWDC01kdbaYd245AHrBmqCB3hB4%2Bip8uNd%2FGSynhl8nieKID1rd0ic82xtS5G9itxAOTYEB9p7gAliKz9CDMiY3wrfJJBE5ZBjnVidD%2FGIyUpZ6kpIBJU2834Mh1CVGPodV%2B2JJCQDfglfF5fImlgLwoxSgrPKbSi%2ByUud3%2FM1uhXOkhHo4L1ky1IETFH7J%2B1nfX4M0rEfl9wgAGB1%2BjJkf54tot2snRHrU%2B6HrjubJ1xE%2B5EJ71L3oN2sbEqdkP1poh2FX%2BnyEwzoZX0xXHOCOz8Qwc8Ni1g5HJy4wu0TsK%2BYmghu5Z1%2FGf4aru8oN%2FsuuySTwnG1kMuSANTq3jWRWEo0LgwX2lzjhqKjlcKAmT6JNvOYobbBo023AtOO%2F9syUQCJYpTnWkfDET%2BLUFlJ27s3txRpvfkm5tBoFVA6pg1O%2BblKkLwP5pHGF8uxgfo0sWFdFNg2JJZBOhsxuBI5d4RKBpNpvnABDeWn6yM%2BzzEZd0Oy2k47zierI0okacKxExH7MVT0%2FcMJTeT%2Bqy1ciV%2F02wfGLcMmJdWvEEmfU5UrXyq5YuQnGJFJpVtoSW0RgcgjBf%2BrluiY6X8sgGBI3RxHYYHAPKei9cgwiSyOingZGZXC5lAewV6XJgCCIoN%2BQTN0ecfbuuUJneQnZaI3V9vYw0PquTw0M3v79vA7qOGGwz5agHsLh%2F4AFv6CxUTdD4sm1xF6OqTrz2BHn1v5fVbip1%2FclPAlE0IB2g%2FDSK1M6hbRoRlyg%2Fm020kjuUPiI70K3LwGm9ZDgXvFeYGvqc2N7ORKKMCMlQr38sTAGsEmP4gXnfUqPMo6xgoz2u8MlAoRSRS%2F86LhdCZbBCwAqr5j3kxbR26Y0p%2BCVMSjJev6yIJ9i6qr8QNq8AiL4vKyXFa7G2ATrQYWMt%2B1155O%2F%2FhVPa1GTjUtg68zEzoBOwgH%2BgnIOgdeZSp5t8paq58XAqoG7ifvrhS1CWure%2FohOH0RHfBDoKq%2BMgmY6ul8yh%2Bvkr5MQT44wqu8RAKvwcpiJQb6itCEpAMSdUrrpvyARVtbbtAbar9oyqbhmhU%2Fnb%2FbTi9SHlwT2ykoRqtawsXsts0He9sn07wwwFtK%2BLkKrR9SLu9rxuUU5yfTFCIYg30zKZy4wHuTiV20fTZopETInAtvYJjH8r%2BWetf1Z7lDdAebX6MUXXAqB2UNipUJJtJ8Ms6tJvYh%2FFfOIJ0cT8d8oR55VqRbvAS8T8xl3In612MfP4UFwbYn9QEpTnlHvGXoWa51LvRBsRb1eFfVdkkyyqR6b1rw%2BOOrEhCkLBxqS6DdL5u%2FHau2VBiKIMva9lVMtv96PzpEGeHXKj9fYJ6JJVsfO3vl%2FA2eUhiHARBFmGCr2YXYTEIFDSS%2BE1tlI4gsjpx%2BgaTtnRIB7ciUFZJ7WYrygOIFA33%2B935D%2Fjym4RtM%2BS7%2BWSK3%2BESm%2FT0tdhXpjgGusNYi9jIYi05j6w4O2l47to3MsuNiCx8reQXv8thQOf6zm9Q3xCFQxiR%2B61EHWAECUqPTz%2BL9SpUH9kZY4DhAInmGoV541e8fMFo6psYsAkwwFGtwlnEZdXoU%2Brf4VSSpQGt3OueunXrx6l3Gu1wGtKePVyTrjOtLeMspkks8p4Zo49UHFQr0G50%2ByEiH4TjlBKdjMaIRqHF8xCbRzRoQkikV34YVkeG5ujKLKGoN0JAVS19ofQh9tAdYY3SgoULflz9z9ibXKVCU1CRuOut%2BWIuHL3KIFxVZH5mURyiVxpuxDydYpFtB4gctTD0zU%2F%2BCR%2FiIVQwOsW9nD2dRpXRYxTK91B%2FBFzmVhFr34jZUUyZJClcvLGOaSWDXI3W44Vhc3EOTUffnwmJjLj3lCNYqEdv7InunMB2l75M7tooHIZz%2B79BoHTeVXarVGHXI1dvU75bV1A1g%2FSHIP14mOvJ5lxCQwYLOjl1herVAJ47e6KvAb%2BIejufdHesz13CxLnkQSYgyXWQe9aSoRveUV%2FyiAt%2FXGx4C33aaJ9lCtLFuNlSwG2VuDoQRjWGcYWIhxzzDrSLci61DRyrJ%2FQJtec9L67eLSlMjz494R6adMb3Qyf4SDNUC6gULAkVH%2FmS800mcFEzmpe%2BoYQ0BHIuk9PVH6EjOrsS84ukZwgm%2FFe%2BbdD7LlK2VHEWNutGqyqpIewykoeCxDxY9sNMVUh8ddfytOGGac1togKXdrkZTtuLf0%2FN4DE9FdE2IcVOTLgagdrtI%2FBKSIQ%2FskF5sHOu%2Bq3tnClcPM0PIrplsWT4Ykf0OGeGi%2BCTuBpSj4qqV1I3y5ycNcNTs%2BJn43kAJWqVk4VxRY98N3ABrsFBcK37bREQOYRNlycFO7xWiQFIEccKDRPy24z16h1NAgz%2B5EOIVPL%2FkQFfFo4fPu5NrrIZKop8Beq6HzTWSZlnfuGOf41WOuKENFH1%2FySAOMtgnGC6xDfs%2BzzoNFcepba85NuG7RAV9zyEIGteBy9wQj0w36Yq5lmgoqSwBVgBkwuuQfbUw5lFnGewvzTKje%2F1CkRSK2RF6BN76o0VPr3OllLhviDp7FkBZfkP2OXGOmDv6%2FxFo5LpzvU0UPMcW4OU7StgGqBLy8YFCqnxDu2kLkX6ZGkgOGSVrmqwnPnPBQjFJsMcNAlAnAV2NOMJ36IxtrR61ZXCqpIT0E8bU75Oq6XV%2F4uUOx5w7PHEb4BFQ74x6nVcSGjthloVmYm6%2BMH3%2BJX5H631T5qMM3%2BEpIdVR1cl%2F8ye7GnCvLVTX0i51PdspcLccxDqUC3u058n%2FaLuL5OM8PaaAQ6TBxy9%2BG17hLZ%2F3xbwrdfqLvp6WClO9unpuZ5qEo2LlYa4o3CXatCMVMJdNW%2FwgaexrtVXdUd2eZlDPrzX9mDspYXe%2FEMZhMeQ6kDDal1FDuTuzfmBEVy2PrEf34wHr17x2f1dlhC9J%2FiRLRj6IQ9TCEXCgKGJKFzDqW7p5e76gDCbsMp21rHeTECr%2FYxcL321iMY8sazh3EraOEHMvOXO9b2tNKB2sV%2FsrcSdfvz3hmboDJhlGS6zRkjpsfGi3TMZJ1vkZ%2F5VQLm8Usvh%2BgFcNTkSXqUoDY%2FiMoPzDz4qr%2FosTakYGWwGqh9BmkHlEDinugQkgwoeKI5GpIlPU9baxr2F1cOyep4seUPlMm8UWG57ZoLBqZAdtcX763IO9nduVgEGq5Urq8cvi9brg0NqiYp31%2BoMt504xrkG1%2FheIbREDobGiAVC%2Fnvnjn4h3X1KE7PPVhrRww9FOz%2F%2BX0rtxJRCknsUm5oKRMMznurxzxZKHMt1%2FpMTpdSqA%2FMuQglzwd0JTrLtTNvJjmMjfbVPHUR76Ji%2FhZ4ZaQ7OCkxQZ2mnZleYz2bz2c3iK3%2BVFKseP%2FnyVve5ZhoJuWFQzTTeJLGbFnNp2xqLg1LHrrvk0nduqblq%2FFfFnoTdmlrExvFwQ6ypSJpehgKD%2F4agf8RrVZq6olb%2BXo%2FQf6u2lufZqFCaMlA1XC2Hor0UY0XK%2B82xm0kaBiaM%2FgLMawV5koAEBW7WrmJoAqSCb1FDC0cVK%2F6qKEWvPgqiLRqivNxC6RRfuuq6mycW%2FnLHsfktanUSocIszjd8alqxD9ZEUrNWYn8k3l%2BfYQ%2B6hLYdjaP5x3aybQOkwMVZzsUOjOsoLGNxuZhnVug7rMsU5IE6Lbfh4QFx5972GeaIuNrfRuWW1%2BbrFfBfc%2Fdtkf8zs7pzB1YVgTmT3efvqRZCIEpUQTTmkG3jAPw4GlcsYZK8ZuG9smBJyLKCrA26kgeIhXRf2TExzSCirfuwHRLb2TUjadCmMfSj8yW5D00tbmWhKp6F9NwXHSJWlmWiCfSCV7dTdgtxA0lct6wO9ANSzLgAZaCAl8UHfsWIIMrXeoewFU1diJ8CBOduf0S4Q7PaL8Q%2BGCmR3BMi4Ydq9eOKbbaZFSZBLaZbnpJJ3yHw3MCqRn21a8O3ZM9hnKBo6MhTKRyJc2zmpJcxAM7jvpDnq0gO77AD44Nq6M6HRTlnLwWOWaJlAKHRdF6HWtjHTz4lz%2F15cLBu85a%2FYQbwT7No9oNjBqWP1zqU3hofcl926o%2F2HRmJRHYXriFmyXBF3TbcqEfTbFM%2B3KNgod6TmjgILhlad7gCa1Q%2BzeI97c7NY0vPFZw%2FVji9ktzgCWqfv%2BipUQQuFKQsliPFiliR1%2FQ%2BfTUFDe6CICQbvsrazRKKvhSWDoOSca7T08vdT0kmrorDLoWZrdPxmIdlx96h9NKxepIEajPsq8NHYwkywBnV5RPz1MPhLdYPAHCpGdvVaXbkb3gmS2BgWaaKo8%2B6CWcoNifuNVZUbfApreUGM6FVb2UmwF7YVtT3Y5H%2FtVd98mi5y%2FiLry5UBlnchUcRek%2FCGHN2KK91FFydVeRhC%2ByY5Z2FB0HHnOiKuTUKd5wNau3hIeZFx1MZEjaGGPgExyGQW%2FSWYu9NtaSEVkC4XX75ASEqMv4pKeZbbcE3CP15mmQAFvT51%2FoobRbQgS2RL5lNfyavfzzZaDaGCJ4nfU915sopMKEwzirKr%2Fr4OWGvyE%2Fy3PergrqhjdwWkt5Y6LiEdzdH3%2F7rF1fibO6vXTLfi5GHJjtxfvwyUQQX769eS%2Bt%2BWfPEznmNKL5m3vx1nsXBzyWGt0Opfej1H4PTRzyGkqd9uPOC4KSNvk83JftKKDZZnXnddAY%2FELCFw%2F%2FXzkVx%2FhedYc3KriwfVtbiUiBLNhlyYg1Y1MayLkACAsQqd6j0IRiEldKsoItCTXOBMS%2BQm50%2BnJCpygl7PELKwTFQWysFaZ9OVJ3oUenZvp9FBAtbF51%2FGXyGPvF40UbGA8Kf183bQIoRk9TYQ9XW82D1QA5iC6knJH1nRYd7xiCXYbvjdq579UzfADzGe0NCx2e62zQCE%2B6ovHgQ6LP6t9ot3MT8eDCurk3tnn7zNzNej5Wac0On37YjHrV8OfRhncru0wAx0IPyan7T4lL4yizPbEn%2FD50Au4hwIzNq0HpaHBTdWBcnAHwHvNLofUguDZQ%2FArAbOsolVmaVvtq9Cx7MMncdDyjpjZOqfbDfuTT%2FyxnyUDryIY%2B3TrEr5tSCo8S8gTcpb%2BZwHV7k09xpnmxwS4ws4KQHVUUSTD%2FDiS2EiQgLRFA%2BJdpW%2FKrIusxr0abz2rYJdJ97teWodPfIJgFOIO8CkgYLD2USD8PAYZ9MJB%2B8dJasrN7fLbei8qxN%2FRjCf08i6WZSyIqVuaP0VMH9PejOJMIHKoss2g2qZ6c8JIlkbO3SkQ0J5TXss5xLAZameWHjr127yzH%2BhFoqJZ5KwA1QgoOq7CsqKP4iKCN7cTNACqeiuCjtL4Llxkrsm%2Bcw8qolfaxvQPlEbM%2FdjmUBHKyECWDHb5XMKwLVocK1KePaj6CKj5hTncBx6TTxM5v1qN0YC%2B%2BxMLaFJoFKpmBj1S880%2FJZa7i%2BIdHo2WPv%2Badb54Vusp2MVdECwkD0pwuw%2BdFSV9lhBEhnNqDlnaz1IC%2FSLcQm6kMfkLqPZtdWDmCUDM74x0PfK7VPE931p6RIZMvcm2SiDpt9X0umh496i238fV%2Bz5SvwN5Pj0fcsUFAjOf4ZBmZMkVIjilI4D2fQ4%2FOxv%2FV7M9sNBK4UmBp5vY6YnZBCD6YRov1z6WAIeFK9Qnk%2BPhYUDq4fu23c9qVi2HyL2s7HkEcrBphJNeYubzsQZq0lob4ygb7M3VFl8ysnVzOtcdbF43m3QkhUUNzlY%2FukXOv5ULM0QrsvlZEkEw7mM%2BtQkh9VsdWMgn%2BzWfvAcCA6F7MyaflMvDCX9ndQjiQj%2BBa5qrS8%2Fiw%2Fsy%2BQ8zvnxrp3adJ76KGgxv7pRDLMilCYYAgfXiosCRov24CSp%2BjaS9Poh45WT6is7nRuEHpiJtVmDVeSDcJ3HJAOEzgdGfKwddt3P0oWrDbxQIaZc%2BIQDkFaUz7LHNImVOe4ve28Uj3Pyeap4rFBeb1HynAmwAR42r0lw96BOdch5m3cd9siHQWMKKXb0fiYdfw2v%2F4b3AH%2FkGxcUTbSSn26OelY9d5qtJL3LDeUd7radt5bpxlgSwwydthoOKkWl8B%2BYwmHW8PDaSZbHZUeHW9tOW0cT9PyvVZ9if9VDxEyBOWOayRl4feJ7hxEC%2FzlIQTwenonzT3uORvmUQa3eLKRTs1H%2FInq8mzbPxHy63C7wzph7CfmClD%2BAQaAn3iRdShIihVuKt5a2j5Q6U%2BiHUB%2FnxYaVgeH04RQoKXS68bcB7hUiozOKeMeUEfDRZ80yc%2BrPvF5tElnNcrCXwr%2BcQqyoek1%2FT0V5D16XAXranG4vo0EZk97XIX4gtS56jGCrNapd8iKk6baMFKSHF4L0pELhZpJ85sqGboyWzjUz9tGWQKhgfzXG5JKfoHqHFZvYCsisJJsY7nztPszJhaUppt%2FL5y%2BInuc%2BnJXHKcH%2BabK3rBt4J6uA%2BepqUSAlso2oj%2FWidhrY%2B9XeokHvUIY2sPwLm9vZLAnRRHS0msMkoWU28mfirzDBFhNc5FzTw0jp%2FT1wyuDdrIjkeeyO%2BnVjPjYFwPajjMSvX08oG3IM%2FWhBfX1jgGu0aGDWPfoaYJR189MOYmGtMWxCmqKhgB%2FmMLnhyJ5EVoXF11PmWHt2pQJJg0%3D',
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
            if (labels.length === 0) {
                return null;
            }
            return {
                totalHours: parseInt(labels.item(0).innerText),
                leaveHours: parseInt(labels.item(1).innerText),
                notLeaveHours: parseInt(labels.item(2).innerText),
                startDatetime: labels.item(3).innerText,
                endDatetime: labels.item(4).innerText,
            };
        });
};

const fetchPersonalLeaveNotes = async (): Promise<string[]> => {
    const attendances: Attendance[] = getWeekAttendances([]);
    const endDate: string = attendances[5].signInDate.format('YYYY/MM/DD', { trim: false });
    const startDate: string = attendances[1].signInDate.format('YYYY/MM/DD', { trim: false });
    // 日期格式： &j_idt152_input=2022%2F11%2F28&j_idt156_input=2022%2F12%2F02
    const searchDateRange: string = `&j_idt152_input=${startDate}&j_idt156_input=${endDate}`;
    /*
     * 請假資訊模板：
         body: ''.replace(
             /&j_idt168_input=\d+%2F\d+%2F\d+&j_idt172_input=\d+%2F\d+%2F\d+/,
             searchDateRange
         ),
     */
    return fetch('https://cy.iwerp.net/hr-attendance/merge/personal.xhtml', {
        headers: {
            accept: 'application/xml, text/xml, */*; q=0.01',
            'accept-language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,vi;q=0.6,zh-CN;q=0.5',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'faces-request': 'partial/ajax',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/merge/personal.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: 'javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt152_input=2022%2F11%2F26&j_idt156_input=2022%2F12%2F25&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=Z%2BX7PvZ%2BUsmYTt%2BsE3gGi0awFbKnifBmkjiRlItb6f8Xah6%2BEkDjwgN8qqFlpWO2CrmiObhQIdrh9%2BMQnTkJrq82H9KLNKfDB%2FY4pR4sD8M55Wf980BUE0HT9qCj4oqa4z%2B%2F1WQAAJrcEzNdraAnblsl6XfTZ3VaDLBWHGX8x1mIaMLjJ0LciH4M9W3WAGHDIFHIezIlb7h%2Fg7KEr45AOWcgF23Di3xv5rXo3gHvkTNXFBXHONmSJYJrSQ2HpKv%2BBxpFUrO8vJ9yokozcv6EPr6Gf6CpE6YTA971SmLcKjl%2F8TU0yCieuh8%2F8%2FAJshKTXCCrsRgdL5M6NQ1E2nIh%2FF%2BsrNNhtGJ%2BWI8dw%2BroKx8sgDAkvHP7MxuumEJeRyabUBt%2FNAWCVDaeHsokQWaUxYfCuPQpKJZaA9700Uti7n0zxkVMaibMLMMhkNxqnXYd3fhU8983%2F7T%2BJcaUTeVe8Hjqo%2BqmIL3ykNksh4Koo6aavqcInHrPy3v3Z1iYw6RWpWQF%2BvN%2FmYEt8uVoUoAc80LWxvXidgxvvdq6q7jxPNYrPdrAZ6284%2B6RIynUnFLUM6vvgnHefKjmeL9GrrV6mpxVK8H%2FIrEqTu%2FjLNOzXSjY5H1FDYk0zmoQH9spCDNbGpxph5BFcaTOwbW8tRzDhvxhWbAuNe900BfrqEywjIb5ZRVUjghPXfNVSc7ROwhnhtqsX9vn8tSufQtJ7rNgK%2FECFmzgMZmfZlIpXb3VdiIWy77P%2Fry9FWRw0ChW1iFcm8Gk0gdl5S%2FvHGD3mocCjHyzzK3yT2GLlVWeSsE7%2B07ep5A6kouKGjCk7TGX0DJgre6iru4gJz3H2XKdplF5nbEuqaHJODVAG%2B8sLF2lPoDn2obOIz5tNTDPAVTLaBxzXaDjOHI5EK1qjoU8SFHs9KtuvuFcyiEG8ufoQY5U8dVFBnsC17PQCyRTKXHxmEN%2BG2yFwKjwNJPYQ68FgQBAeoG%2B5G88nUiI3AllE3Pv%2BHcH9L3p9BvpXK%2BaYhIVfxcLEkqbHuVJ4X4JNnts6hVpoA7pkig7hOAF9whw8ld%2FwPen%2B824i5EITNs3KZYXDn0xiK6%2FcHVqAtdlt153d2Kp3ithex2gYOBiM7bOPGhQe7zaOSCwpw%2FXaPj9AXsGUbcJTgecwif%2FBfS7EjLStkVdLsSFK09rYpgDAy9IFolif8jL5mqVgIuo9HtWcfiZeCg8PDqMS0ql09QUDO2rVCQi5YV3bAR39I6m1%2BAdxTELmHZG41RJwdkJDLbnqCWOytPij%2FcOotHvCwTUaqGK6cHgq1aqEYXP%2F56p4mU5a9UZdaJl9TcG35Zix%2FQy0mgwWGzoVKEUjqE0sTaP4kTvFIMn4l2W17fJHqX8TBy45PNEYvY0I6Tb4FRTNJMsj9OcDq8JIqGtzo4ypevn2pZIhkP2%2BU6SYRkyfAPP8cumw%2BQ9wJWTb%2FIkv0oqOqOlxkdbv4Iz711FDrgk1dxmDPS8%2Bt5keH9QMDXrDl1CkFXjf1kq%2Bqkp1RXjko1i1STYwTBIOqrFHIQ6VSbZMdhiq%2FU7fN0OnfpTzE2p5Nbk%2Bqkq2Ir%2BOfLVGhlubRy5W6F%2FfTIolOUBeuLfVMMWq9eZmhOaYqkqKiYhb6QoHVRTPZW7rK9iPWjoLEKB477deiOybPnWTv3xcJWfmzs1YgpOjWxMWn%2BFqoayOHBi2eohxb6vm0tz%2FTZ13scjYbkGKfKd8ZwgrZOsOM0z%2BE8oYYNRp0dMuATVQO5lxdVrL4wVofm2ETTbMChRyCa7GXJussndGPYw4T%2FtSHHB6g9ZrZsu3QKbFM2UhrQ54oEFlMLuUx5sgG2cGhQbxDd3qIOeqi9TLRC9zA8bviSyHsQ6NHuMtOeKMIT%2Fkv81jSwlUPSF%2BNz8NIcM1Y18NTs%2Bw4Ad1v2Q6IKuFSoXmm992lnEyB4B1pak%2FAGOCjx%2ByjSZ874CJBLHlKq6zDIOOgUcjHLWKHYBkAnXSEn7ioGmJ9%2FhpdPxMbw93qYxwVdwd5ctlCPyAjjZkf2fTP%2B8aH5JPzixn9%2BcGfjtTklwEaL7vgoHy9IiecPr2LZ9fFlMzL8OESmtx7pHSGkEmd%2FdCFJJJuv6q6vvykVyrTwCJ9IiTMBTIYxXnFvtE1WwwxF9Mk8bUB5owwcwNRch2eE7LLXQcKUkLctxiI3Pk0XeyZJkLYwMVR%2F4yARDogLiiHy4xw8VK%2F46NkH2RoZldvYtX3Yn8SlX20MPhmWDTXy90xvD5GzsI4NafJA6XQpaIV1K1EGE6LITxEfHbNnIavLvGl4vSKd6XeqKdxqzMhf%2FmUIXFDb%2BydAgGgaWtFaWsCofKxRMETEIC%2BQ8a18F7hHd4lsqcWXfJ%2FeWVBQ93FZJ2OKp8X%2FhWiWwfv6D3wpy1Tzl10mI5XwB1bgoC8gmknJm5i%2FEb1K33osGK1PYU73bJQw1Y9%2BV0m6n4ezlFOy0CW3cHoloTS0AG3Zk81L9OfAzr9I9ESAU4nYGAlXPygLlY2HLscuxs7gfBOTwKnI75G1SIhlwHz%2FVHoCyE%2FvQ1ihjrGOlh8edp8CkpI98eirp6ol0Hf1F4LEiNjmFujE1SiocVjxcdNixPQUxc%2Feaz64b4jqbbNDYAMt69SDtRS7jQ7f3wL9seIIEwP9UvASJKd0QNH%2BPjKgVfBTrh%2FNsJXqDJBWQKTfwdUeWHNYKVVusgMwXAwp8Z1HzpysXMdL67suicefAJWAz7sejWe%2Bnx7gn6rx%2F%2BOurj%2BdOD3WtnjYZ8UfrBnPjlQP2rSZPoG91NftQxd%2BVK2lxfWF2%2Bd%2BTdjhk%2B0jslotEMTvq6cQy%2Boy6XCaKa7gJvWj3ilXYjkgm6QvnD%2Buz6g0a5DhCtR4rokgYl3xf3BhCK%2BXGWDG%2Fr25me1gwvR8t1ZZs7KXArYZBneuWiU6IQA2iYmddqiXTlONx3tlKivQY1Jtik24Gkb63wdi9glx5brAv1FwYI9nsV3qFks%2B5qbMtGX2gjsOjoxduHL20hLt1CbAgJSYczBGSXDZOQXNVxZK%2FUXCGdfXmKUFQLaFhn84hMitvcTTHHqRld8rXJjXZ3g3fCyELl1N7PXz5U4lUClb6kRlc7vHOcd%2BpnzJ%2BcBWoqRHgDf%2FTrorRgVQ0EEwMFb3EajpemGfZt0Zb8PERI1iw5G1pxYtn8gf%2FjGVhm3vZCW89%2F1ZRj4bnlCMwUjHGJ%2FBJ%2FTCENugrsZUKZFFZkJA1PvQuot%2FzKQr2sXdg1kXio1ERJEfKPj1gJW4hro8G%2FBZC9CPDNJEUUuE9Wzu7jRwruzRlbqV7GStrJraGoZ1eRxQcXt7%2B3v%2FjAB74EXGE6ubZFYUZCz0QguKZ3oxfHYg5DMqNBacno2TDtM96iMDVBMWblfyfzBtxMZsRLwKnc28jjGJmDJ%2Fb2oXSkyoIEuT25vFU316RMBJH5J4bG7MYOyCarzaENYRI39wYCn6KgjaXt%2FmYI6L83t9umFyPOaGjUpHjrFAteJibn%2BOm83TeNNhicRhjKCdbS3G9ODsyjGIjfJKbEzQRmtyOksGJ5txGYzsIk8RvofMsGugt0yNdtVuzCEjU2NIX18fCAL3FwbGmLZ%2BCX%2FheLoeAtfCJ0ghfC%2BSdFEwnkh9lUtyIMGYuZcGvYfNBF0wG7OTLDpUABFtEStkgi5urbB3VPgFpmALjRV8OeayTE3Nz24HDVTTCtHw7c%2BmgFsJ5fnov8ynRYzx0iP16CdfWdPuep53shMlpXh6iT5r2MY4nwJ3xicdrfHMGQ7wMhOMZ97RP3pPeo3lZWGoUwbndlrfYaiOY2cImxQnIOLz%2B1mLpOiPmFD6M461mDjRv8ZLwS254iFRFXm9Ps1uo%2FgCcJr8PmACU4Yw8jOMV84k7fo0LRKIl3MQax2Z27gAOt0EjJbddiLTUQQFlV5P5o3TQGVGNF5K9X048oEyV8HkEi2V2FoCVnnRlRBEdHMq8O6DAvr93pSJ%2FX5H3m2jdjg2Kin7JR1jB2rqUDeKX354JoE6qBPy5rR0LqAcf0LXFApSGrptNldhDEwiEtqt5xuyeGXd2fMOVIOUNndKUJvJgyeOl8ZSdcpe678T1EYoJ1hB7vhXEclqtAtgYIspQ3efrnBCQJoirkDGdCMcqJBs%2B1Bzss8tudf45QAs61Ll2GewJexwjwXwMDawxK3xq6dPtBbLav366bOR9ij2Hlk%2B34eie9N1%2F4P7HroqWpFRPnzBf1GW0FM%2FN7k11JeVySwNmxAvKWvxHh1ITEV3sL8X6ZlBqZxNyuP6RKoa0A3mWI8xp8anCowSwYrnxBkVh%2BDgmLPIDGKdd20JeWPHGT6lUg7huyZPb61iMTEMr07p09YY3PiL0Zb%2FFHVuGAVTTxgwN%2Fggq%2Bw9uU5FFm9uSn7%2FjESKfpqe5H44CzF%2FXJyB6d%2FSZ57AG9YlCWXs8AzHYcXGWRi6ZYOwAuTIHkD50sD6Uv4Tn2yt1mOfVM%2BnmRefK7oNk0PbaVOgqxWFe%2B%2BGBmZ6MW154ksR85NGZPwxOxOUcXSj1IxzJezFClfOURFJntVORW9XyneXz%2Fhm3sm74f7D55e%2FPCJK4fE0SOmpE73nzw84K6f%2FEYYZ6P8xMIywoUhWCyCPkur56d6IYi60ZV9un09%2BQs5zl847uy8N%2FH9aZPiR6shlXuNR%2B0kY9iLjHayiNZKjNlHhC3oiND7Af8FnJ0wEDHAxszqJ5CYbQa7BynbzQfZ9FxJxe2QF0WYKgHB9A7hTY3CC0eBz%2BikW2XSY5YyRCnqmz63HAQuH%2BSsK2s6vjQvQwFhKF6YjjrPgTbKzb63X9J7qRvn6z1lUaFbFSKvdg%2FhKQ4dNlSy%2BIVKWZ1XhCkMPmBmmgVN2p23lDxwchPXOlFm%2BaNB5zNjaUf3whx0B5jz%2F9QHpVv1E3iAEVmdt0Jjs2mJhKC8gW2dL%2Bms2PFCTmcvLKKA%2BOsXf6Zy7oMb2IgKLAKQf4ukHkbQTo2iTZ0nxaGl9TUVLOG4KXtcL3NUEu1nLK%2BipLgqRcoRGxJAdB0m0XKVKcegt1b1Xkh0V5TVI4zZJnWC31l7eP%2BxxWi%2Bcrx%2FOoLXv5dwtGOplepmQXAoVyIGwc4JmRcGXZH99rOh5uRp2kO7Ckgjzi1SZ%2FZxocY7GCk3JA8bdRqvRxsEVn5AZha7miKAZPkeV2rmwULKEYVM4an5b%2BSLTmJ3oR%2Bo36zxXBl5CojNFhBX7ZGPojEJlm6U2tIhodhwjkgGNJd5zPZGxq%2Bv9i6S7Fint1rygGY3lOMMmhZwCvrYYTMAF%2BUoV%2Bprhm0qWVcbkyh6d%2BqRKP21%2BQI379nYtbvim8yHxxEcCBeHrp8DnBE9xYcufctdNSLzfYgeXlr152amw9FFtxWJiZbt6anMOarjfMtH1VOuC6uz77j0iSjoV%2BKDCXW58hfnWN55aT8T8bzyprzUWgzBWS0d%2Bu46BMCIe%2FceM3Slrkveztpod07AUGx2DN1qH511sE9mP0TwxwmZkIkrrhCvJq9oN%2Fy4YApKIOdChrzGeUKJ4buixZZ8WXqoYnSYQUzuedHM525nuxIxU%2FwL%2F9jUXK2642N0xsiip8mzegNXXvdD6Q6rY6mBvbt4W6toRfftyLHtgbm1zx0xXcCAKK2h28P%2B7sqI%2FSfX2vIv48uA2%2F0U35QL5izC0nyBRHNO1bfJ3AWVbXwpe1R01rOxx0%2FKR8j5c0RvD3IuGlue4ivKI8hBMOZM1ORbfP%2B99xoof%2FY9Wv52Qi9Zr8BJAo1QjiDcpnzz9ecsB0aMmBpVbFCDfeNacYbRlzIQYuUyPPFqvbesiPr2zGb5cIjMtcali9fSfR3xyfl8wRmc7q4DPExVyBPWJONd758CLGnKXOvArrUl5E11ENwnnQuD1FSYdgMicTui85WvK7FE3VkhPb6aboWCf8%2BV9jp%2FH7XpkogRVRZfLo%2F%2F%2FX0%2Fxegxyb6BQXVbgOFc7tePfpL52Rpcf8AU2sBMlM47z%2F0s4UE%2F%2Fuf4ySDD8t6GaLdU0d5RVOGWGsYi4Vuob5U3qEf6b3aQ4D9CLulfiYy2Yh8aF3YnytZpHKdmakLan2YZg0hM4xFyGcwqs%2BPPT0cpGEA0pkjvHGwliLfrVR%2FjCs3KtMjLl5UAoeAqFQm1JJ0EP2iy6dW0Xko4QdFGxP81GEQmgHFft5z%2FOsWD0Z7se7eaD97v839lXIIkXyppg4QtjqyYIxdVTBKzD0DOuq3gDlmyT%2Fh98CCKLNRBCvFpdz6oZOrBVD2N067ktkxM6vPf98hmy%2BN3HMLc8ll8qg1HYg5o%2BILy9CkqR4lt3%2BOy3m3WSWQ5KU1ybq966sFtpcrxhwdloAgVnmqPVxSJKTy3KfJeCAUkzs1vU%2FIaTys27NLH13bsIhoaPeZG5n6mPELeKSucHS66fB%2FJjIUwjMcHJIcWvP6rvuBtWGci47C2062zNgE1Hfy0B0n2JSI4NzRNPw5CFTNjTe9x%2Bptj05g647cmFWhLHHGKp94iojbcBQEKeHswT7bNBPLgEKnUd%2F7GPLTrWZGsTbxKNvz%2F87G47Ue0wLnNZ8jAfCYQB7tMkyRU3Oe%2B9P3XvfjkdNaXtO7bIhmhnOsDN%2Fxb3L4D%2FDQXkVZcDFDzQgWlUW1kz5qG67wS7V3fICzDhsyrwX36VrhTCNCcAFffT8m2PX4RUnQW%2Bdct1IYfj%2B6dP2YvbcgCJAZJik%2BgcFUa0dxj2JXKFeiIpeqSX%2FVaRrf0yLU9TQdLTu19EnLo9LJNG02bDNnQfUyU%2Fm61CJHsF06SeytJVah9wiNlpKY8QF%2FPeudbH%2FXgxYWFaqHG6ykaphsot8kDqhiNfjk1tP0GN7EQrMP%2FSf8J1vBpjpJu0nRoG0G7E5Of6KOfsKirCLLgOv12FotiUlNuiaFVt83Ei9QA%2Br1XnKyYVMmpjuIaspKzaKo8uR8qokOVQ%3D'.replace(
            /&j_idt152_input=\d+%2F\d+%2F\d+&j_idt156_input=\d+%2F\d+%2F\d+/,
            searchDateRange
        ),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
        .then((response) => {
            return response.text();
        })
        .then((body) => {
            const leaveNotes: string[] = [];
            const html: HTMLHtmlElement = document.createElement('html');
            html.innerHTML = body;
            html.querySelectorAll('.ui-datatable-frozenlayout-right tbody tr').forEach(
                (tr: HTMLTableRowElement, index: number) => {
                    const leaveNoteElement: HTMLDivElement | null = tr.querySelectorAll('td').item(3);
                    if (leaveNoteElement !== null) {
                        leaveNotes[index + 1] = leaveNoteElement.innerText.trim();
                    }
                }
            );
            return leaveNotes;
        });
};

const showSignInNotification = (attendances: Attendance[]): void => {
    const currentDate: Moment = moment();
    const { signInDate, signOutDate }: Attendance = formatAttendance(getTodayAttendance(attendances));
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const todaySignInContent: string = formatTime(signInDate);
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
    // 打卡最早只能計算到 08:00
    if (signInDate.isBefore(moment(`${signInDateString} 08:00`))) {
        return moment(`${signInDateString} 08:00`);
    }
    // 如果打卡時間介於午休時間只能從 13:30 開始計算
    if (signInDate.isBetween(moment(`${signInDateString} 12:30`), moment(`${signInDateString} 13:30`))) {
        return moment(`${signInDateString} 13:30`);
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
    for (let i = 1; i < attendances.length; i++) {
        // 國定假日或請假直接不計算
        if (getWorkingMinutes(attendances[i]) === 0) {
            continue;
        }
        remainMinutes += getRemainMinutes(attendances[i]);
    }
    return remainMinutes;
};

const getWorkingMinutes = ({ signOutDate, signInDate }: Attendance): number => {
    return signOutDate.diff(signInDate, 'minutes');
};

const getLeaveMinutes = ({ signInDate, leaveNote }: Attendance): number => {
    const matches: RegExpMatchArray | null = leaveNote.match(/(?<leaveTime>\d+)-(?<backTime>\d+).+/);

    if (matches === null || matches.length === 0) {
        return 0;
    }

    const { leaveTime, backTime } = matches.groups;
    const date: string = signInDate.format('YYYY/MM/DD', { trim: false });
    const leaveDate: Moment = moment(`${date} ${leaveTime.slice(0, 2)}:${leaveTime.slice(2, 4)}`);
    const backDate: Moment = moment(`${date} ${backTime.slice(0, 2)}:${backTime.slice(2, 4)}`);

    // 上班途中請假不算累積分鐘
    if (signInDate.isBefore(leaveDate)) {
        return 0;
    }

    return backDate.diff(leaveDate, 'minutes');
};

const getRemainMinutes = (attendance: Attendance): number => {
    return getWorkingMinutes(formatAttendance(attendance)) + getLeaveMinutes(attendance) - 9 * 60;
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
        leaveNote: '',
    };
};

const getAttendanceByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, leaveNotes: string[]): Attendance[] => {
    const attendances: Attendance[] = getWeekAttendances(leaveNotes);

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const attendance: Attendance = getAttendanceByTr(tr);

        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        attendances[attendance.signOutDate.day()] = {
            ...attendances[attendance.signOutDate.day()],
            signInDate: attendance.signInDate,
            signOutDate: attendance.signOutDate,
        };
    }

    return attendances;
};

const updateTodayAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]): void => {
    const index: number = 5 - moment().day();
    const todayAttendanceContentElement: HTMLTableRowElement = table.getElementsByTagName('tr').item(index);
    const todayAttendanceSignOutElement: HTMLTableCellElement = todayAttendanceContentElement
        .getElementsByTagName('td')
        .item(2);
    todayAttendanceSignOutElement.innerHTML = getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));

    // 定時更新內容
    const todayAttendanceContentTimer: number = window.setTimeout((): void => {
        log('更新預設當日下班內容');
        updateTodayAttendanceContent(table, attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_CONTENT_TIMER, String(todayAttendanceContentTimer));
};

const getTodayAttendanceInnerHTML = (attendances: Attendance[]): string => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(getTodayAttendance(attendances));
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutTimeString: string = formatTime(predictedSignOutDate);
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');

    let innerHTML: string = `<div style="font-size: 20px;"> ${predictedSignOutTimeString} </div>`;
    if (predictedSignOutLeftMinutes > 0) {
        innerHTML += `<div style="font-size: 12px;"> 預計 ${predictedSignOutDate.fromNow()} </div>`;
    } else {
        innerHTML += `<div style="font-size: 12px;"> 符合下班條件 </div>`;
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        innerHTML = `<div style="font-size: 12px;"> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+${Math.abs(
            todaySignOutLeftMinutes
        )})</span></div>`;
    }
    return innerHTML;
};

const getPastDayAttendanceInnerHTML = (attendance: Attendance): string => {
    const signInTimeString: string = formatTime(attendance.signInDate);
    const signOutTimeString: string = formatTime(attendance.signOutDate);

    // 國定假日或請假
    if (signOutTimeString === '' && signInTimeString === '') {
        return '';
    }

    const remainMinutes: number = getRemainMinutes(attendance);
    // 顯示超過或不足的分鐘數
    return `${signOutTimeString} <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (table: HTMLTableElement, attendances: Attendance[]) => {
    for (let i = 1; i < attendances.length; i++) {
        const attendance: Attendance = attendances[i];
        const attendanceContentElement: HTMLTableRowElement = document.createElement('tr');
        if (isToday(attendance.signInDate) === false) {
            attendanceContentElement.style.opacity = '0.5';
        }
        attendanceContentElement.innerHTML = getAttendanceDateTemplate(attendance);
        attendanceContentElement.innerHTML += getAttendanceSignInTemplate(attendance);
        if (isToday(attendance.signInDate) === true) {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getTodayAttendanceInnerHTML(attendances));
        } else {
            attendanceContentElement.innerHTML += getAttendanceSignOutTemplate(getPastDayAttendanceInnerHTML(attendance));
        }
        attendanceContentElement.innerHTML += getLeaveNoteTemplate(attendance.leaveNote);
        table.prepend(attendanceContentElement);
    }
    updateTodayAttendanceContent(table, attendances);
};

const updateAttendanceFavicon = (attendances: Attendance[]) => {
    const { signOutDate, signInDate }: Attendance = formatAttendance(getTodayAttendance(attendances));
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = formatEarliestSignOutDate(
        signOutDate.clone().subtract(getTotalRemainMinutes(attendances), 'minutes')
    );
    const predictedSignOutLeftMinutes: number = predictedSignOutDate.diff(moment(), 'minutes');
    const todaySignOutLeftMinutes: number = signInDate.clone().add(9, 'hours').diff(moment(), 'minutes');
    const faviconBadge: FavIconBadge = document.querySelector('favicon-badge');
    faviconBadge.textColor = 'white';
    faviconBadge.badgeSize = 16;

    if (predictedSignOutLeftMinutes > 60) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#737373';
        faviconBadge.badge = `${predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1]}H`;
    } else if (predictedSignOutLeftMinutes > 0) {
        document.title = `預計 ${predictedSignOutDate.fromNow()}`;
        faviconBadge.badgeColor = '#006600';
        faviconBadge.badge = (predictedSignOutLeftMinutes + 1).toString();
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
        updateAttendanceFavicon(attendances);
    }, 60 * 1000);
    SessionManager.setByKey(SessionKeys.TODAY_ATTENDANCE_FAVICON_TIMER, String(todayAttendanceFaviconTimer));
};

const getUpdateLogs = (): string[] => {
    return [
        'v3.2.1(20221212) 解決取得考勤彙總表參數名稱異動的問題',
        'v3.2.0(20221209) 顯示忘簽到退按鍵',
        'v3.1.0(20221202) 解決請假導致預計時間錯亂的問題',
        'v3.0.0(20221202) 顯示請假資訊',
        'v2.4.1(20221111) 修正 favicon 無限增生的問題',
        'v2.4.0(20221107) 修正 favicon 失效的問題',
        'v2.3.9(20221104) 根據不同剩餘時間來顯示 favicon 樣式和網頁標題',
        'v2.3.8(20221028) 下班提示訊息和畫面一致化',
        'v2.3.7(20221026) 修改彈跳視窗「即將符合下班條件」字眼為「預計 MM 分鐘後」',
        'v2.3.6(20221024) 解決過早上班或是預測過早下班的問題',
        'v2.3.5(20221020) 顯示「符合下班條件」資訊',
        'v2.3.4(20221018) 顯示超時工作的資訊',
        'v2.3.4(20221018) 清空重複執行的出缺勤 timer',
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
    copyRightDiv.innerText = `ⓚ design © V${PackageJson['wrep-version']}`;
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

const createAttendanceButton = (text: string, link: string): HTMLElement => {
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.href = link;
    anchorElement.innerText = text;
    anchorElement.title = text;
    anchorElement.className =
        'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only atnd-btn common-btn atndreccssBth attendBtnCss';
    anchorElement.target = '_blank';
    anchorElement.style.background = 'white';
    anchorElement.style.border = '1px solid #c4c4c4';
    anchorElement.style.boxSizing = 'border-box';
    anchorElement.style.boxShadow = '0px 2px 5px rgb(0 0 0 / 25%)';
    anchorElement.style.borderRadius = '4px';
    anchorElement.style.width = 'fit-content';
    anchorElement.style.padding = '0 3px';
    return anchorElement;
};

const prependForgottenAttendanceButton = (): void => {
    const toolbarElement: HTMLTableElement | null = document.querySelector(
        'table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content'
    );
    if (toolbarElement === null || toolbarElement.innerText.includes('忘簽到退') === true) {
        log('忘簽到退按鍵已經載入');
        return;
    }
    const forgottenAttendanceButton: HTMLElement = createAttendanceButton(
        '忘簽到退',
        '/hr-attendance/acs/personal/personal-acs-aply.xhtml'
    );
    toolbarElement.prepend(forgottenAttendanceButton);
};

const restyleAttendanceButtons = (): void => {
    document
        .querySelectorAll('table[id="formTemplate:attend_rec_panel-title"] .ui-panel-content button,span,a')
        .forEach((buttonElement: HTMLButtonElement): void => {
            buttonElement.style.marginRight = '2px';
        });
};

const removeAllAttendanceContent = (table: HTMLTableElement): void => {
    table.parentElement.querySelectorAll('tr').forEach((tr: HTMLTableRowElement) => {
        tr.remove();
    });
};

const restyleAttendanceTable = (table: HTMLTableElement): void => {
    table.parentElement.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.parentElement.style.height = '100%';
    table.parentElement.parentElement.style.height = '100%';
    table.parentElement.style.height = '90%';
};

const restyleWholePage = (): void => {
    document.querySelector('#todo-bpm').parentElement.className = document
        .querySelector('#todo-bpm')
        .parentElement.className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#right-top-layout').className = document
        .querySelector('#right-top-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
    document.querySelector('#anno-layout').className = document
        .querySelector('#anno-layout')
        .className.replace(/col-xl-9/, 'col-xl-8');
    document.querySelector('#check-in-out-layout').className = document
        .querySelector('#check-in-out-layout')
        .className.replace(/col-xl-3/, 'col-xl-4');
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(
        async (table: HTMLTableElement): Promise<void> => {
            if (table.parentElement.parentElement.innerText.includes('ⓚ design') === true) {
                return;
            }
            initializeFaviconBadge();
            resetAttendanceTimers();
            log('出缺勤表格已經載入');
            const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
            const leaveNotes: string[] = await fetchPersonalLeaveNotes();
            const attendances: Attendance[] = getAttendanceByTrs(trs, leaveNotes);

            removeAllAttendanceContent(table);
            updateAttendanceContent(table, attendances);
            updateAttendanceFavicon(attendances);
            showSignInNotification(attendances);
            appendCopyrightAndVersion(table.parentElement.parentElement);
            prependForgottenAttendanceButton();
            restyleAttendanceButtons();
            restyleAttendanceTable(table);
            restyleWholePage();
        }
    );

    // 待辦事項表格
    waitElementLoaded('.waitingTaskMClass').then(async (table: HTMLTableElement): Promise<void> => {
        if (table.innerText.includes('特休狀況') === true) {
            return;
        }
        log('待辦事項表格已經載入');
        const annualLeave: AnnualLeave | null = await fetchAnnualLeave();
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
