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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F10%2F26&j_idt158_input=2022%2F11%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=2DnbFv7Km54N77Ec8bJqDF5GlY2DJtfpDvYEEg5tRifvtvb5PagTq6oRatLKXXpfHWcN6fRkIVvSqetaVKcTYRgx6qj%2Fu1JwIx9f53bA7NVdxx6%2FBX9raXm3LVlNvRhY8RPwl%2F4alrkPy6jt2LlLL%2Bi3dzlXBwF9jHrnCitt0YA96AMd08hyMkg47sjQHdARY%2Bg07%2BMZliWrD2ENpzkG3DsFg4j%2B2Pc4DsT%2Fjp6xo8tfuPB%2FWR7Zf%2BDXVm%2FrPCva%2FmlpT5bI1%2FqlWD1KWLatxcIU8WalD7m9Gf1WNSOTuavZXByONgmT53ahfodR7Zbv%2FVq9xNRwuFY5Q%2Blhw2yhc1h8uBaHQlohh%2FLFHoZmvoAs6bg8u9V%2BPdsGS1nV0ZJn2Z0SfFcwFgHt50vWE3XaY%2FeR9aa3r8kLqGNVhl6GiXMYN%2BuIgAEAGSQjTw2pFHdJ0mUr12GHbHsNKcbyPerzEAhLcDrizEo90mpwp6YsIhjgPtAP4axyoRLm3L9OXmnynCDKury%2FxAOBfTmra0iRASTENbSanOQILmxu%2BnUlovvwcL7Go2xuPSU2VEHRhFdbqQ04eq5Dy%2BupBqqxLfvO3%2FIduFIIF0nD83SSabYX1ccwO9T2h7tt1kAhh0sYGGnQzw%2FI4aqcpOADHw1Pl6r2q29I8fdgyXxY3l9vVNexwZHc2dXJqxbJV9dXtS%2Biz4z%2F4hVObyXeu3rWNbtU%2BrDgqGyzBHMxZQ83VdWF%2BsbYak6WJEXnSsc9k%2BsbWdhXtY00OgGNGI2u4nmT9Pl9fNaO%2BsOUEW%2BPSR8O8xBsiVBxPD%2B%2BvTug%2F5Ai%2F3OnJ6xujdNUW2R3NB1DTZtTAqoLWv%2FjoRoD7k8HSVR7QkN5%2BsOeQG8WPr5ddWFmnVSkqaY4ez0o9JSKFxmreukWghaFiv%2BIZlSotQtZcTS6txc%2BBGVYEdw16ScjzYAK8oxk3RfZGtYcCC7yPXE0AWAGJdQDdljIO%2BcuN6H7vWw1Glx3SHx%2F82bJCSywB%2FrRcRi3Q%2BRfSg3UKG1kRV8MtWbbQ1dLRWb8JtZubHZ6DN8pyJqIQ1t2dVhksfIA359zH4DCoFyn%2F%2B0P0whE1qBG5gQjUP%2BS36r73lop38wt3isZtyakdjTyj4xdeG21xMMjNOv7ZRUzLxVhIEtG5duJ8nmaOWfNBIyHYmn8KS%2FtnqvTLE212e%2FYrL0SDz6fLeX4%2BzHuoJILHJl%2BFnS95xua1Akd2FFFmPrrH%2Fciul3xOb6guKZYDrrnSiLbwfaS%2Fa8m20v2tnCg%2FeK%2F07lJBuqGUYonPxj7UKfcJrOTLlGZLj71NilUj0CJf%2BHn6OQTkh4jq9K3eoTPxsLjwjDbEu7kTO1FK56mpKUqhrYU3FcB3NQpBRmMwMNGCKzANJuPSuEmR4vSgS1sd746IJDy7nbp5xQlUL24yTeJ3oJ7ddDPHjk%2FtMkPqNa0bg%2BlL%2B5zTZj%2BdFtQvaDPyyQ%2B7yxxNg3UIUavZAOL72OVgp9uS2qfVcYBFtiyHBfFIyKVrKDqdQSPp%2FE22OrOWScrAo%2FRPvFCSbM%2BGqnDpdrF0v2vwxmsoRYLeKhQyKXB0I11A18pbgooKA9pM%2FVkLQdQqvMOFSpMEGc19A49LnfbOWdntoFBEiH9w2uEmQCCnkJ2lvOVakokHr3GmRmf6SmFaKsvhwDkifPwRQ2zsx2bHXxooderVI2MBWOojDOhV4LLH6gmswW8ZqHocdrPCfFlo1tuMac8sZ9AE8xSReSp7QBn2NNHz1hpFVDu4at%2Bk4uFr8z4Ucd3M0bwBLYLHdaEVq6GvKPL0ySHXsBoUwia4P2qMw%2FUlKBe%2BP3R33kQRDJHEiJWDGSua7VNpXTedyKnxmaYzpwtEEtgw5XKOS5l%2Fn0J1RbwgoBfMuYt2j2cygjC5AgYuCnhLCBTL7Q9kZoKzRbasd%2Flgh3mXtwtg%2FTqlywLH%2F4lrAJpJazbcbxNx2dfFoGc6McLvLbw9CR733O4uPNkvzzKFykjtDueu%2FXaugM%2BROsopVZSUNk8VvPbhWiXTZlaxhKXEEv3C67k3basI%2BoPapY0eYswjG1xV%2B8tEV%2BvTLEWz99Qg3rvglYZql0s1UFPJiV4b%2FBruf9ZJNlJ9SLTElDdhlBikC9qiO3ujv%2F6enSJcuDUfWw1Ka6oreNMq0ishLZNNGPqcuGUzdBDu5t8sHWZDaUregXswAqWdWnzaLcah4DGLMh9lnFH52rtbJwEkNsUS6Lruuor3mIJ2T7q%2Fo44UKWLL95kGFb3Z13ud5HIpdWk94kCaluJAKh5xTP9k%2BXIvvyFVziot5lOLNlWRGtsD%2F%2BizasKJbtgR1Ppkqd%2F%2BACPQuuGH%2BeFUMgMtqoV%2FYBmC10XUQIhMQSk0ctAyP1vFhOxD8evWYjuZlIjAmwjMONPW98JzY65qqZmL1Q1TPaTVKg6hTo8jNMwpbdXlP7gmBPGAVhfPO5wvtYcq7xmXXomZhJAnzvjeOtwJQXY0sYeLCo6WXgm4VTHUJMbudLdgTQPbMwW0yVfz0WcTOJsucWcp5ZY7XuxxUK6ZO%2FrFCJ4AB5jEkir83PPsg%2FivAh4PcypP9u3YIC7LQrxK5pI%2BZAOp9F20bHkQ1YSVbWPPy%2FYj%2BK6NL3PIGRO9KuZp4joISmYWaNrklbOrjJd5hARaziMIR4GN%2B9sPLsyU%2FcVPZo8QsnLjzLMqtD1b58o3%2FQ%2FEA2fyggNfpgGNc7YpDwIUN2jE8ns7FXBtQoYIKSdyMdN4hD68j5jnp6T1xiUedYONarkxrW3VtzS%2FwPLrVviL34se%2FdjeoQ3PIIjkXG6D6D3DppYxRsR6VWsy7AmMtCKigzpLxrSwZybOIOO3xvGO%2BSaMNxrImO%2BKw8FnMrqUGGF6%2FNjJ%2Bec4gvTjuMvcWlWoSkxJfphH%2BjWTktev45kZjAM5vbojeazUmJVNsS%2BrPsI9EjCOLTZx%2BVe68mNrvdEwh85EI%2FMFFRa%2BlBCKtnMprzAVNhu3AfcRkGrOHYczGxcFgjCWpI4mMgyhsZmOWPLXAkCV42DAivseFEj1t9EXZz0y5kTzmlQhFJlUOBXIG5oy9N%2F6m%2FX5wcaVCITLXINHDzeVSy5dwPwwhba%2BAp8a6sgC%2FDjEyJVeMdLkJuQ%2FJH45o0DtHxtu3FXeYtjK5CdUI9xl5tdVWRjleR85HDzkfuFzs4j63OvzIAvuWlcMHecYNnWtn%2FuZl%2BJQoCTlTNp1HbwzO36feSwkgcwI%2Bygug8SazVTYld6UvRlV0GKDHE%2BUPyT46XG1xWMWshpaUuXJaXDyl3BklkM%2FYegGIOKuwl0c8jOwE26R9RGSNx0wMvSm0EHXWcj2rP13TeUP%2FLA53nOEKPtLvd06sYW6YpugI9hmBZra6sRatr2ozqpn9otrzgy4pOjo2xHW6m3RNxH63WOs51poR9vl99ZyrWNsAmdLYW1biXwTZ5%2BYBA%2F3ATXbS0TcWEexEzdQ2dSFw5RMiKiXWXPKbt5R26Q%2F1lkTHr3ULrtSu5DaG9aU8%2Fxo1LjsgO1Rcwly71TveRByK9KhLeeC8yUq5z6E54qzESuCrBSefea4IGRY8TsUvBLzoEmep3d8NMbZZmJfGNMixbOkIgGteg%2B0CBC8b%2FfgYmxYSn6t6D3NSSqWzjG8dMyQ7KooYnxZlJuVaN%2BGZoVNZGAAorhrrGjqoBZd8eP2sQoE5H12Igg9%2BrbhpjtVLy%2FBYd1rsVlaw2jekf%2BfILxdjoDiAm38I%2FVZvnA1gBv%2B%2FYedESQpbTYKNfyT3MpBXKxWAiWhMiAtdc6Xya0M9kf2uSOfRaAGOY4IIj5KgBn9infomyzJ79fhxosGw5oXr9x73LnKL3jAyqJCoggD3HHdRn%2Bw0us8bcat1n0vuXF9g7HNaqdziL5mMt2nLaCtF%2FSKivqdjJrYzcoIRlq9F3tb5hWgbWhvnuC9nNEmcDuzGboUzv1DJXWwmfVhKrYKbiic9brTsOhDQ%2F%2F6tPAyZ%2BsL6lOY1F04%2F6%2BIPj0wakyb6aeQPSKmLAjsVzrIIOQ%2BfTb%2BP%2F1mQdeAV4jV6fTHKkMXHWnp8qdesUUKpfh5eDDbRvqDpkgz6AvIKR1Xgzhh1xvf8u4z58WJzX5zFI13t%2F0g2GSAlSxlKBLOhNK7WaIJY%2FyYWZSSDwg8p03T%2FdZk8UePZUJixZziLuRyZVHSoM4%2BZfep0if3rFctUPFF9YFRteZfxoVj5p9MTkRCsRSFrQt7jlbU0k%2F9rlVWXx68NySitdEFKgHuu6hpGGQgTRN6izEeSVaM92FtAdF2N53HtZ7BiTCJWDbkG%2BhXBJQnl5kpBHDWhx68XMhiG2XxdZjCeCCMwG939UhQy0%2BnIaIlLXLnCiVz9JftQnXL0y9Gb8Hg80aUI3ztfz2UnW6te6e3IX4FHuIXqGv1PhF76t6EFRdnkAD8Zf8TeV3qfW3aeiWXh6ycC%2Bmb6RHgHo0wpiKq%2FK9SUSZPPSEhub4WfuEIx2v5mx7AOYMJtCfogVeBaM32AjZ2hxVngVDZ0basYgHqwyFHFCD2bVxMigW%2BYE2366IM2X65FuN5nsmrpE7SDEOlqAyGR%2BaVfaH25AUfSqRHuVqJXx8bN41wSsmbB3YSfyxLYJWoV6d01t8dSiRRq0PgNvaSCqQY91FH1YnR0Spl2Y4iTAJAcmxNXqmMRMSGH%2BR0TduqffulGlGmWCmMjAF4NZ5y5%2B17hAKPw5xpsNHOY3WHeOnNRwaI2CHa8NIJMHp2uNr7Qz9Uf7eOhbcZXizq%2F4Cgn5WS7K5AN08LbRTfrVxDKTO%2BN2M2qBjqhGqoruU0oRU1G0ocuQgN6rDNGNiu3fHyaMgSeK77q7%2FDKxgZyhRkEAoAGOD2s3xLHtEN340DtAKXBwbQpSYLNSVybjoK60gWxqEUfym2VnZG%2FjTFlVRaJBZOnV5v9kIxOAyIUJ9VZjjjNDBrNpt%2F79OSzMJe7XHBfZgJuWQlu15tSYkGgpbV8XbsOVfmSmBX8LviSpxql02IgNzXLoylr2WkRld9vltgLdNZ7HFXpAE9TIwFf7VUESidGcLe5itqgocuMH8OQDh5YqSSh4fFsoSGsa3NppZaYpKnDzCg%2BOPaGp%2F9Q%2BbucxHgTVuzVkeePTPZWz%2F%2Bd%2BiAnSCbe8g237rXlSsMXalNXeaXh1VdjoWEHyNHISr8x8ZyWT4lpeyxC1nWIzmsNTgK%2FibYzsXSSxRW064oDzK4yo75dabU8fgp4sLefvQnlUKRAMyXyLt4GbhL2mnfUA7SBD3O4XlUsqnSxjcp4mdUpup%2FZEK%2FlajcwTOd7Eh8kw%2FlKXFE9JxyLhj8ktRujiU4891njWKMMsOmtk4PDWj82CRYnMsT9%2FHaIfGPtdRbLNUAUcTBugd8fgg7qDmbRiOvc86ISllG2tFsApBEMBanBYO0lPu5AK3srRMffS4GtvrJ8fj7njQ1ZFI2APHb1HgchjgahxGa9Juow48eLEGsGAfFeqfi8p0PIW1eah92aygSg17axkjznqJgbVlbQqfiX3aDflx4mN86ocFIb99hvWQlVthVzWZuP95unrX6pmF7nBAdh%2BAgeJd4qU7K6goFjpRmvs9%2F8Kvn%2FsH9ENyarcpe1SWBI9VJDeRCpp6oDIuqCJNnBB9GgM59dW8Ywa5FRyRUuAUgcR74QYFbVYvMGmYXQFd2ddk7YKhD2o2Jk5qhHJKRh3LAa8sAPDmhgthdXTeZ3qckLl7sAzVxUTZvhjYN7J1i06gQLm%2B0rGzRSKIFIES%2F5yuKa9vm8iuEf%2FbnXA8NYNGO1qznntwz0ka0%2FIUMjgXkIOisAGEW5rh5XU1Ku4kFGQbzml5MJ63ErFnfizOqfb16rkKyB%2BnjN6Ih5cFMuZYOwhT1PLo2QAazhCvMErsj1mJdB%2B59WZpD8g7Syb4i4HlcVzZBGXNI%2FhyRbDKCvN79wZ2wbrO50UCtoCOkVg03WSnJJQzdeh65RXAeFVokrceMXIml8BZcfWmcEzYeYBM5%2FTWmFH3rdpO%2FXads%2BFBPiCeejBX1BN4vItI%2FNG3olWM0HAqPVyM%2FFLvg868YEf4WNh3Dl8EAuqKt%2F3zDN9ca9VkyUWZggvSgNFvvHiLMFvsEYOPHU2xWaKAAxdyvaANoDQ1EV07Zzs86uNuoV1mfcYhtrGgpEdQTmUokOhoPGxAJAlr8Nb%2BbakBUah52o3vqk3s6FvPW%2BwVquAMnRJ7s7aSa%2FNB7pGkn2pEWEWSyC%2BurQmHgLvLuoB9VRNP4S9D2PULVlPG%2FEkypzRrNRGkSaNgOe%2Bsx6i9s6Nh7omDreoATlZNN3yBqT5%2Fcc3%2BtQMbcMOGDNXD2V0X7fraT2WYdd6FCZMIrDqO5qDXc61I87DeEPeKnFT6TSMhKvS7v6HV6MoRKa%2BHOtOUTuL%2FhdJOxBRyVX6uC0OcV%2B8y7ltuJ8JmDQPrI88q%2F1%2FBIkeCu0Gh%2BDzXBtIqaYeqq2AD0BLisq72ZoScBRauykhwFL6X2BddG3NQfmgEwqQNcnJ6QeKJlEkn8ujHUqH%2BMoVlb7kDamBplo7Pi5ealh0sTkfOg4d%2Bx4z46NSvumyWNRl0Lwq8PyaA8sOr9ZviJ%2FCa8ZQSTm5VgsVRheR2ECSbyt19EuEHKp6ZO1Tfob3vPSPZI1FjG7XqBbrv5%2FwAv5sp6vrYON3d96LSDlJQTt0A6z0rVXnnflVzXJXPSl8r7KFOGcsg0ERsl%2FPcT0FA0awinPUt3T8nIJVKd9a041o6h6CywZPG2Bek8UvlP3HYNGJWxpo00zW2sbi5%2FzY13flq2844Blt6WpKwTKhbQ6MvXZTn%2F04cRvFHb%2BNdDdEIq%2FPL8ZlciGothrh6NC3bd5d6Ex9WVvQYXQdaDEew12GroiwDA%2BYT2XEXiS8NznOPCJVQOS2XFNvGwN0PONRTGKjasLi7p8huCscwh3TkKB75DQG0FTRg2USrjsQ%2B38tsYhYSmt7H7qNlv%2FtFmyEkZg8KYxjjRfye%2F0uwkdLo%2B%2F1Y4GmJl7J6ONv5gle8UZbdt2zHZqJamGwkijRqhecv0aFi6ro9VDm7YRq6AfYbtTSbCAnizNk4ClQ2bnyvqyAuBh8U5OUpwPaBNXUoxYinBEqvrG4gmpA2bUFh4VMAvVJ5h3PyjpjVuNC8Ti%2FsCcUlcNds0t4g%2BjRT8KpbBSR622L2WGGaiKFu4nbS18NyhOqFPwRXbzoL5%2FyY8Utp%2FIR1opfaEAimnTqnpm1DHLBZAmjCX2QBnwtwNe1FozkXHhPpAqfH15g0tHLqsW0urMjP0QSL5%2FvCAdOjPDQIm4QKuGc613hgxXdhgr%2FUe82hFrfNVKufU0%2Fihf1NcuecBmmMdiBwsa18%2FUjr%2Ba90ZeAXIt0np0ihVJuIXPrXk7SdG8RR7CHsCcxm6uS9wBXcjsda%2FjtcZ7dsBgevoY1C70tYAVYmNwMPZS07TVSL9AkdenkTLWSLnYRdSew9HK%2BKuVdXKwJaG9MRL9TUCEyrFb3aH%2FBiu4aFD3%2F91jybAnCowqWC76VbmdDdJdDR6TF4vg8dT7R8zvxiZoM9P6wdZoD1M1Zggm368R%2FdDJOAPjE5wVgw9824V4oAVulUHh8aL0%2FLDkX0xwdCq2CwzqXhL02tCmPx6Rcj9udjM8J2CK9elXSZmCmyCTLWMs39ch0cTuiKVEN6GRypx8UUdvB2Xo26%2BgtZyevxEfAgzEp7mCf5bkIfY4sDTo2%2Fpu3Jv2s8%2B1xhrrF8Ytu4My%2FSi2LX3T97rShm0bL7kfNf0BFrkTthwAoVGk4oAoYAJmeU9d56VwyZHLLup6wMQ39Q6E5kOVVj89vW31XoPjgUnEc5dvYLvmZSRPXCLQppskb%2BUs7iGT7G6AW0oU2RZ5l9Yugv4kZA2C45OzvenJaO0Fhq40p%2B9ccn3jGBJQDas0uBZ5R3xl%2FHrH6GBDeVHxaecrOmvMK8T%2FOHiApBzHmsNPncX3TAMupfqOhc3RSj%2B%2BjhJT6zJHZriyGHxXrEre5SegycAQj5D3teS6kWhDOLb65oKs9OGB%2FgUJqlDcGbTIotteEr8vqaJsOZ06ZHpmGkCDxZyzaHjlBnmGuqvmAjKBUaURWUkLGZjeHE1B5VMORky1PsIaqElef1kybB7dL0iTzrdHjL1HW0WvynMfgOgCFO53XOwjW3oFBdSA1QfSqGIIvCYubReQT%2FDmIu%2BiehPAWftgCBc%2BpMEs%2B7KNcufiNka7%2F%2BUEIX6Y1BJyUgfJW0%2FpTVMOYdWqBGHzPZ2BgatRP4yL3Wjifu147v%2FHnDRj8clfvBBNS438FghGYwzTCbWvv9M6Y31%2BMpWvu%2F8er%2BTFrMcNI5WFO%2FgdXhAxFv6%2FMaI1kWwBj%2BHtzuIzNvsQQsBaMjMX%2B3k0UKAV2k0EvE7%2FqJzEFJ7gcgjy7wkq51FI0ibD0bzQtMQQPhvierOmyvA7h0uUvWogAYqT6dkhoq%2FZXACKiLr%2FDVH6ZCD0L6R1HQTFMm1jqoPZjyvRYXWZZz',
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

const fetchPersonalLeaveNotes = async (attendances: Attendance[]): Promise<string[]> => {
    if (attendances.length === 0) {
        return [];
    }
    const endDate: string = attendances[0].signInDate.format('YYYY/MM/DD', { trim: false });
    const startDate: string = attendances[attendances.length - 1].signInDate.format('YYYY/MM/DD', { trim: false });
    // 日期格式： &j_idt151_input=2022%2F11%2F28&j_idt155_input=2022%2F12%2F02
    const searchDateRange: string = `&j_idt151_input=${startDate}&j_idt155_input=${endDate}`;
    /*
     * 請假資訊模板：
         body: ''.replace(
             /&j_idt151_input=\d+%2F\d+%2F\d+&j_idt155_input=\d+%2F\d+%2F\d+/,
             searchDateRange
         ),
     */
    return await await fetch('https://cy.iwerp.net/hr-attendance/merge/personal.xhtml', {
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
        referrer: 'https://cy.iwerp.net/hr-attendance/merge/personal.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: 'javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt151_input=2022%2F11%2F28&j_idt155_input=2022%2F12%2F02&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=Sz68q2mLNuPUIowrZsLofjuviiUSuYj8Pbj1ZhaQH0MoDLMNkA3RFihzNC%2BbnPHX%2FJT%2Fepb04s3fV99iIeR4NtkmOH67ivFuCqbA2lgnayTZh24%2BeMkA4U1zx9v9QphqLyA3OwCoDjYhk1GcavljvDvZy63GXoGIuLrrfpMT1hV6QSfbVeAd3IdTl4as0y5CwfEb3VXeI%2FRMYj7CsRFOk7HBpuBrGtDTjDWvZKGxCMMKnccafRNn9S5TItnAYXUzE7yYik8BTSrZIrNOcdyb9fZXktJR17MdPmgWMjoqN%2FdNIQput4koRE%2BmHicUOhMBK3X%2B8G0EzoaoAbHNav8PIrpWzys0gNHjhSefOUC9KQngy0rKOaCE9ghj9OVNetqkjCZ1EjiEYLe0bq5fES1bNxKsKBEHLf8wl0AWrYJ1ETzJtzNNrHKo%2FW12N2d%2BUZydSWCq2SoISS4DpJQIBFjdu0jrcadHSDe%2FOGCAJyXJruP0y4H1j8Pd3P5UC04ZFOT%2B1ZhYCGyPSG4TjEErHyIdxx%2FEuYl%2BErV5KDNegONbTkSC%2B0FTHHZGIeQ%2BMWI912lwxrtKV%2FWkJwKs6E2e5EtR2na%2FdwajlYaJYpz713tcqK0g0Sxh09X9DnuGvzQ29r03VAyFV7FV8nwsREPAqiop24LEZSoG2pu%2BmFJZf37LoKlH5h2rMzFBKJwxMbrjHmkr2SWO%2BqXw6nhKA1auoXF29j5HJdpMZvfpkVCunsvywtX8rf2tmJzYJHB7GMi1R8Y8wz3nVoKj1LOwoKZxNfXF7fCHVcoQ84o%2F48OO1TiCdF%2F%2B%2BzOrXQ4U0Tf6fvsHsmcgGWmGnMHLXW3PAjOGus4UFattti2EdUPwTAYHTMdQQ2HOrwYERUqLcM52b%2FnTx3qx0cz1seoD6LtVvYlL9ERrZZeNhizs6aQPWIHtjbjOQ%2Bq1N4%2FJv8xFyC7M38b4by5GCY9h7%2B%2FiZiut2RKkM%2BSm1csp9mlcBH9NEd6X413H5DO5rbR2jgZBmaJ0PI3n5AU60GUo%2B1GVfnNdyd5f5o3ae3%2F9GaobTVkRvRcidtA%2FvEn5xwYps7xWmbSkbS3LM97MrHeiZ5mQTWtyHBXQyWFPpHv5YjL8Ba1fQ4QnzdLizWKSgwOOIyv2dx2twcF9Zl1ccfJluuv0ReBRgKY6v8RT0BzCu7awIkoft%2FvrTbGc%2Btu9dKlqfujB%2FHKiOcn0%2FIvRtIFm4TialP76%2FR3uEyHGg2lUGe04xhtmyKal%2BnsUUxpXyTC1pEujv6OH2ELz0C9NTNj%2FOi%2F5og9qRFwoSSOeh18g9SQE8%2BfvTEmcmFdAK80CyByZhA5qzh%2FaifSwmKWroX%2BFMe2SekAzMVHHuNs2hyZnYZOyQGp3om46%2BRKGg14pxfMyjMNcalijWAvzRLxiNkJZAr6PILo4Hgb4bE1slGm7KTNV4asIu0ug61F2ssSwpRip5kDddz%2FLVMO1DouR1HoE9lCdTHsD97GjLkNT3eLfHYALc1Z6YM0UGb7qvkRczX7Yl2PeeZy9HHG4%2FY5mBfvdmt2zk5JrK88caU%2BGW9%2B4ersBztWZf0CADlkcoK1IZvaNnbRlD34snT4koybUbIEKPV41lSxhMJYKFjIJ1gbN7uKlOeqYqvWcjgYw3DUri6IinUSQg6cett0ZGgXgTZ1hJkStHJzQfE02aXtRmkM%2Fwn0v1GicXbra9GxPBAfeTQSU%2FwFaOu3tOeNaF6Z5xg8V4NwXVmCZRRoQ46HMt6aBe%2F01XETOU7S4hpHW%2BF6aMqmrzyO3WovfpI6JxQsv7b1Sky5uQKZm7iTLVtHw2pOYZKMOJPniXKzGY4iqGf%2FWrEOPAMmDtLQ7WjsoYAAsMHnie3GguDC%2B7vsvvgKWdCiCYYhiz03WibpeQtFMperCOt43tWfFv30JeoScF120ozrMJICV3OzSjT9zUINfgpLCKdJLIpsglls3YHEHwbinFnOK8iRtRJuYP2DjG8o3OHYtqxVgEXZMO7E4Dsz2f4GIzowf33SqNu%2FRbIVo%2FqY9N%2BKeWSQZ8SsZfAHWHgoXNVlIRxkHhq3Ow0uFOrM3w9wK8ZBd1d8cs%2BwOD%2BUdaOu%2FGE2Bvf%2FOCWA%2BcaYU%2FEExfPzQL44G1h3jKL0Zp5OVuxZc94%2FnF6a3i0%2FRb7vcClVsiAbcotNVAWHOmjtDX3PK7DAiBuAV5tSIdsuCrRK%2FdxkmhMkcJuGJPZRpyWho2515xp%2Btu9J8vm4bueH60fSp6Cm6qCDJrAyVhTdxj3l3kge9vaEw%2FcLG1PcLzpLDmO%2BA%2B1sjDipgXFIPxCSJxAdYGJ3wM3UnuRZ%2BjhYjkjXt9IOi8vTvOolhjjh0DEmYUPD8yUWyhWa980ZDIzlHKlS5q87JdGtTXJ3h3dQuXYiaCf2kxjoo%2FthmTC5symsUUV9OgWLJLtOyzcThWu%2Bd%2FsjcWBTbeBVUdy15KzBM3PcLcw1cRcctspX0eXx6cJP3OsFG6NL4ZqU8JArFblQxxkLDKu41UvdX3wMEacJ3rJDsWJ4ClsugO6zuT0ctzar7Q7ei7TiGXuT5gYlLOIKn3fhFuFuDZJd0zU1JfKkVp%2FMNRytwyWkRo4hid0i02akXuJ2fv6mZNrF5D2%2Bgz5%2FfJqhd1KR20hoQ7oLjAopUoYG19fXFMxvaJenSpbNPp8gIzjVYWP8JX%2F9%2BmC77at8S9n1AuscILAT%2BWXHGUfew9pwWijBtmiuYWlIUhVcHTUMtr%2BYLAl2xPwbiZtGQTe887AALGtTHFlZ%2FAuwq0Eb%2BkVugjw1VS3Akp0L%2FXtQFWLVR5LjQ4YuH7MAYSiKN1jGmbDJdra5%2FgCuYidWZ0mgB8IgFUF89EdYNrybOhOcPQA5LyGMLdQGmU%2BFwMyCZM%2F8lxKwfJ4PDyFsQW8cMHGyobwTi8cV6kVdYs%2FIJsqc%2FUbHcERjy3uvqyu0Nyhvs7T4a%2BLheAwSY2oPcIirJxQHnH5PJZ5pWmXMeK0ayjHucmBYbIae2xMl9%2FyVXcHbZurXx8VhlYVR1TP4KzcSUTmPycY2qM7kU5dPPs1q8JY9rcZn9FChxssmmEQvBieE5hMf%2FcALjcfvKt1T6dnqX8dlV2jrIGufGOM%2BEkqSodJayjPS6k2kq%2FGqXEIkdv7lcM2%2BckSmYefzF8XmcXvatlNRRPr1jJ3vRNfqMDpPW%2BSdBDlj1CXMJOyotNPBkB2X4RI5NwF79EIfDrut%2FYq4qqEBKlJ9SdGvPKeaV%2FlYz2kNEXVPbEm1uEIVZjkM%2BKU3WhoL3avadNpYx4DZjCtqDgHGPm0c2N6wz0vk0%2BNZGtdOFfvfbAFfuP%2B4gLxEyxExfqPVIpiVhE6ni20ag5voXOP%2Bhh%2FJK1VWYwOu9u32OQo9WGGMRPLp8sN1hKDpJY6WM1cKHdnK1hT38gGZLLg0u%2FXoR%2B5QEbFuxUmxE06%2B5K%2FqJq1IKcGLj4BIGS4OmNSL3VJZC2fn1Vi2%2F7%2FxeZ4R4sID70xBKBXBgYGoKn%2FOtKl%2BYDY6tePm%2BhWUEIJNLg7Z7YAVtIU%2Bc7D1KRv3BbSZdqveu%2F24PzZYtWzsUCw51dfqlmghF%2ByHC7ctJx%2F5xZ4%2FCwDCFR7I5o9jmIFTNpA0FE4czv%2B2PBmk9nh2q81mv2f7O3euV1CQVOwezAe%2B9HDDfHFg%2Bmzz6ziSZyIJgOavQKzgz0eL2r7MrHutlBJdk6v207lTymr5qBNWiuynMUk%2FgS4v9X5bRsL73CLmgL62pcevxjLOUD54Vu6XlX9LuiaNCjuHFDdhD%2FdfUVoU%2BrB5MCBWLbfTcFbxqQQw79GT1FY2BGrGy3yFdL1VGllPVGhtu0jXdBvUZoNreCDyeS0c1mKuKoBJMIX2NoIciyFCWohyl5bvySPT%2Bap4zhOINZNJsp2sK3Eb1BAvLcbl5KqLhVsf0HmCV347Iyyy9UqP7l50pkmgzHR3OD%2Bgv8TI8DnVgrAu%2BzykhL90ubvSvubkxQpwOy33H4CjnVPxI1q1T1YXafCbIZ5NzMXNj4zVm5xXyDcddfupPIamw0p%2FI%2FqFYZSQauuErncz1sdxcap4UNMhBIjgs5D8P%2F7zP1lF8d9%2FNXmHuF6XMlgz68ilyXBo91kG8%2FlBNZv119Pk7GXHdRfYJA8EhtC9BazHorFjnyjLsnwRWeRSdK23iRCt5nONiiEzdH1%2B00iAKwJwH9LYup3X9Vr1XN7QGnQkLqivfU2NUtszXggB8fADdKqvxpVRBYSrh78Vyn5WweKqWhJmoajvJG16kv781LGWAWxctqV6WfmSqQ5UlwxXEsL7PENrSKIzqYIdrrMtXE70cWoKmSFf1Ew%2FDSeQZRY%2Bvt3oVRF1sYtnvYokBjYk17WlVkSXlRCnnuDgWfLMSwHys0ZH6qrR3oZ%2BP%2F%2Fj2uGKaHMYR6m0xksVJ1%2BCb5cIOHgGatdo6KQhPyxt2zj7h6P54VTcoWi5pH9j%2FOZSfSBleH1yF48%2FncvuwGWhbf20omRjfcgg%2Beikcu%2FIf0SGOt2HCPo5BP0sWIDVF4fwO9XF%2Fnh5qygdeyqhuYNSy0rGknRcL5uXXsgDClC7OPaJC7U2uWelFnbH2Abk%2Fwd1KiGi%2FTPEDQ8yyc2ykujEIWsQ9%2BXAK9yUViDbJYSgzLMolUouh%2FLwN5ytcwO1Bv%2FR8a%2B4ey1wq1YNJ%2Fw%2F10katAyeS6Zk7G5GSOpdHZ1KoZNw57b0G3x%2FiR2KrQWp%2BiQADBWR0Hfew2bUuwBEJD6PAJYX%2Ba1FfstU7SgYZDqVS%2FtWwTOKBcEU23SPwBO4EkYLjDjzAaoLlmScN7AqCYizIcr0dsAZALscvbpTirVwte4R4xfiDDeixLY4nBdBcraNOVuItJZPDHXNm4ebzkYLi5p0alBKTpYU0oIXb83N6ekqazzlFAhqgJmSMSZouJmlH1LrdU8aXO0Pe4yR9zqAIGOS70k8nVPyei8mzH4bhNZfw7TZh1SJ8uOKRW1b85%2Fi42Efu4qD6ZDBEACr3EPT%2Fwh0EmJ2dMxD1USG5hSba6W%2BwzrAtsG5rkITkIWLyf%2FMj8NZbICaX5TP0F28fkcW%2Bc8Z15j1woW5xiPBNDAQ7W7mAeJi0GxAXj%2BWt%2FHarKc%2BEqRukq6J0pjSFUteRNUK1LNqDEzVc28go3H8XtcP%2BhXw3GZ%2BEhFnNNkHpoj%2Fi8SSFPV%2BAqRsLdDgP88e%2FL%2FQDB5isrEEa1BzHrh7tFoAL1Utyym4ijHGojpNONKCX%2Bty2X%2Fjgz81wb5Sj01TvnLxyw2JDR64kF8XwDcKqEJjttUF61S7Im2wul9pRFCYRGaKus7SbNNNM3sKB1MTeewB8RjNC6pdyUC4iLgUfM1VwJLi85CvEh7xjoal5KJv7tPxNI9NqWvXI1C3ex63EYeJeYZOvaAj4y84NslwddzwDVorBHCTpuPezFO86Q6h%2F8UItQ75YWvfXIK3jfOsVLNiudRf9Q4dO0DRRI6ocHlBkynTCVrUafGU3rQvoqrbEZYNxG620PzOA%2BYmSvZwmplh%2BiyohsX4oTW3OryuhN1jnoFdeAmvkN8sI4kEqyhcgMTd0OMkBG%2FFR65Q835ygOIkzxhwu30ptSXTY71pEUvAIzTOd%2BUECHmXlKGCF9kIc1XbbiCU1aFSads6TXz090C9uDryJaTByWcifBMlAC12kGQjAV8xepyOwo%2BLr7UNCuwEhzCMCxLN2OxIhZHyBEAQOF8qZJfalWWfLRaj0yL87YXSzHLkWppC2Uja%2BpR6gvsMsMXm59KgFYdn%2FmdpwjNzBLagSX5BQEQcGcjyYWduEtjHuOLTpzGe6lUJTOeG9Hi29eFErdfysHiNCVrAmRSrhkyaUjIZRhuStwvrLIKnHeIvGGRKLPU8sANFepOOSPFXIk%2FDfTQ3hJ96NLx1D7bmiZf%2FDXmRrL%2FtSvHusU6dfqvKM9x1uxwdnH6oKyfIwIzKXJLAdhHeJt8BOBiDTAH6Pkg5ixMBy5q3Pi%2FlVJKKcdSzs211aIyc6doD2yIbQjllkPKvMc7HwxfG6QOtWfPDZhI%2FZImwVMJ0PsSE42Xnb%2BHSqwG2t1TIHjHe7gdtAfTgH55wYRszn6%2B6OPDOCabXsYhAwoIehkiJKjJYSnQb235t7SEEDS2M9x8yN6VYCjHZffR2BSE%2FStnUQTYkPfnhcynNOdqsQHa8BRs55286CicEpFw8O%2B9D0u2k484Cp1gb0j7odZVwJujDAgFCo4V1rhZ1hnpUPhmN0eIoAfVcRhdiYyhRHS7KRdbamqWRVgkrEG%2BzWYAg15xKNM9A7V2gYi483X%2FTIOdsfof9q5gp2A0N29m3b07Gqe5%2FhSJ1%2FP1HQTHXTzjp6hHkc%2FhO17AanQxAE9BEdZRlck%2BVX69KIDx%2FAV%2F0c%2FYRnu%2BtcUd4aSpT4vTZfl4ubGVxzVmi76oZ3yTB2KeO%2BHq68%2F1%2F%2B05UreHd8oxcsFmblqeigQ4j3XhybAnetVyuwF8RQdMXw3oWutmPlHZ2bq%2FPXGX19pORI72xfNNLpIfAZAR%2F3khVQSIuE5H8J6jV4gj4cvZpKc2hObJpAgT4fEImEKysz2wYS35ijXZSm%2FPo7j6yInx%2F%2BjTwq5HwBGH8C1zWKwK8UlgJo5030XejYBf9MFiaL1p5u1LGUOGz0iJOh3EMncYGaFRQchG27nPhxdLZEK%2F9urCnyoJRDFiFF56BN3iL46nkVgr2e4Lam%2FrtNmGxQDJbfq4Un5G5DigswbqHJuu11zoMZRDbjsj0CH7kAoAiJyD6iP9VNOfhQryzCQCJCv0NZqcSzPw6AwkDsfjSLu8M9YmqOs8fpkI3Reca00n1MJIFAPLmBjeOcoYSNILNYPfnSf2oZ1KOG1t7NKXLxlfNx8YmNP4DKPFTg91I3tiBFjaOVMcc3ZVdpQIwdwGAqk7oY57JkCH8uJxppVWPShLX4y4M%3D'.replace(
            /&j_idt151_input=\d+%2F\d+%2F\d+&j_idt155_input=\d+%2F\d+%2F\d+/,
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
            html.querySelectorAll('.ui-datatable-frozenlayout-right tbody tr').forEach((tr: HTMLTableRowElement) => {
                const leaveNote: string = tr.querySelectorAll('td').item(3).innerText.trim();
                leaveNotes.push(leaveNote);
            });
            return leaveNotes.reverse();
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

const updateLeaveNoteContent = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, leaveNotes: string[]) => {
    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const leaveNote: string = leaveNotes[i];
        const leaveNoteTd: HTMLTableCellElement = document.createElement('td');
        leaveNoteTd.innerText = leaveNote === undefined ? '' : leaveNote.replace(/\s/g, '\n');
        tr.append(leaveNoteTd);
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
        'v2.4.4(20221125) 更新特休 TOKEN',
        'v2.4.3(20221118) 更新特休 TOKEN',
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

const appendLeaveNoteCaption = (table: HTMLTableElement): void => {
    const leaveCaption: HTMLTableCaptionElement = document.createElement('th');
    leaveCaption.innerHTML = '<span class="ui-column-title">請假</span>';
    table.parentNode.querySelector('thead tr').append(leaveCaption);
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(
        async (table: HTMLTableElement): Promise<void> => {
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
            const leaveNotes: string[] = await fetchPersonalLeaveNotes(attendances);

            appendLeaveNoteCaption(table);
            updateLeaveNoteContent(trs, leaveNotes);
            updateAttendanceContent(trs, attendances);
            updateAttendanceFavicon(trs, attendances);
            showSignInNotification(attendances);
            appendCopyrightAndVersion(table.parentElement.parentElement);
        }
    );

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
