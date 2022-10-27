import * as moment from 'moment';

import { log } from '@/common/logger';
import { updateFavicon } from '@/common/favicon';
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
            'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=RkYK4qHJVGLcxNOaZfrobpRTgFFBWQbyUOrzN07TVT1ICZTiCej%2B9Exd2wmDvLyTtgc5ID8AkMFx4w3b8vXwkBXXJoZ3o3Kj1YAL%2FpiMhgdvPVhbLFzRqIo8FXFmo0ixrUKwSLmuYUD1GQl%2BIaJW9a%2BtJ47ehMGdgkU3Nq%2BxpzijSsb4mjfyFbz3yx3v9wgndnU483PneTgNkzXtaKbmxsmiKXyjy4uQChoNaUG4fkUQyfVv1ymm6uCLeqlHg9ETk8LUNdaocecBmzaKzBlpzpPyOXPOipUQ%2FYDfTNVv3TtkKm19NP9Ys%2B1eHHq1%2BVrA4UshoYzE0CSIS5fGat%2BMSQMZTrF41b8wchMw9zmZk%2BMV8pX0Jgzj1%2BDS1LwNnwJSGcA8tYJv4ro8FwQpWSm1qdHFJCJHk9qXa%2FKfw0HHmXGNVGMC2N1ynibmvlRTJpm%2FoMuxycOEKJKKBfn%2F5MdybYUHNrW2K2r4ivJBc%2BD%2FycnafgNtlpappGhZBSJDv0Gsqvb43mHK0k188a5S49FWW%2Bd8J3KnMONkgv3zTXxlEJEoAJeN%2BJrbS4jkjlj6DsYaBoBC460c5r9UWmSj7wg9gMqWRhfpiD9SNBJHW%2FH%2BYhM7VQlSNaiY2wC8chKpyDTPKMePIXQdR8hqx6Bo6dPizEfOtNS1Tjgr0xU1f4oKjt1JXFUb6pbxAqvnRqv5gdYfUN5h2vUWMY%2BwPPCSM0II1yAcOliXS6goJ6XMHmKh5rKGTXmekNWczvtejOHnKmzpcmzpHC7Q86B4VdaJoDJ1cILfnta7yMFEbLtrFL9MNc19kJn9gw38uxIiecUNiEO1efTMUaPGrIPsBAXHj7gAZkKXYC6dTR6Plls2bQL3A%2BtLVa2IzL1%2BLFz5hTe%2Bt83D4wKr6gSJ2GyPQX%2FFC11DJFoaYrVcWbcuoteyr26kQm9Gw%2BZRyA3x81fJROFpouxzhPv3WBzwj7CD85Hb9DGjRx%2FOE%2BuPEmPcsbTIkuPE4NBkO7vvQazgwLAmfOQ1Lh7%2B0t0U4AyqCBy0xP1likiR%2BQ93emYkghlUguu9rxidIVLe%2Fg%2BP%2BV%2Bm4QQW4ZWFKySOpAZ7cW2WVAqhLaS%2FNaVOr3zCsJTG3S34U9%2BghoB0TUCcBkdIzx2vDVxpNBtEj29bFSQ6V8jGfsf5ewXAnX8MQ4MIc%2B8FOBGVqS%2FIVNiPhReK3NQQ7nKEyqLaioGbO%2BcbeCT%2FMI7omvDAU8EbBweEbuotJg2MgwgZRe0694iq83SuYlesf%2FjX%2FGFwdy3%2FR6aGRq50XninBI%2FFODyiMeXUg1k46csmRwiMlIaNFYN%2FB5OUWPxauzrmnoV7ZjBVlYggvexizr5ap%2BMCmC2CanexwCwqcR%2BOcr0MP5KcgJB8SsXgq%2BkcA1UTUIjK9li0D2phD1f2gQcFUzTlDpQzRQA%2BYa2JN5rUCSop69vtw4KtN409RCcD1E0CyPf8pwFZafPf3BiywTl7C9Gorzjt62ZaITwUe0IukispN7FHBvApWT6S9PMvTWoo6MbuVZk1h3%2BZEuciO%2BTT6mif%2BHA9QFOFyZnU%2F2z%2FW9HwdU9vyrVDyj%2BhF%2BgBupghz2OW7MkqeC9JE7rSkaP5yZqH5kfZtu82t4uQmJL43I3rgfs%2FrYV%2Fg6%2Ba%2FlquoxmS8n67qUuCmgJ2TkEwhmWX6m6r8ox%2BvEzlGPisOGNr3OjAiXt1Rohk7W%2B%2F20601GXJzO4XP2cLv9RR69APenKN5tOCLfVtHjPIRaxZvPlxsdDA%2F3rJdoxhjTWvxz4QyvBA8p8F2ZUy%2BTH62fZ2E7JKLxTBPU4IIrYk7uubchcn0g5k%2FxShpp4V5e1Kmiaurvu8pImQ6ztZsBK2FrMt6axMKkr6C3iS6RpV7h7nP1hUy04lKQIGpM1SENpyQ5BjLKc2%2FMvQMLN1aqA84m%2B4L21lZME5kzChK%2BaxIS605%2FRO3pn%2FAXkxeySpXZew1urz5Akh162JWixsQubdN7YJXgxyAxOrTG5wqrbIjK4m9r7ZWct9Atgs9L3Dk8RObBNKQRCUzb8KCZCFHfD3QeNxmQy%2FNQ58ZlGI4jvAUWYl7InikY9xgvdRxRgI4GtOACy0W9yOjHAW9GhaBr26c1Xp5qBNKZJxdue3WavhtduXlnJI%2Bj58HS8n3wcx3xusgAhp7s9nGJsZe0Ic1vbbBly2b1D%2B41sMBEM0W%2Fr9%2Ba2x%2FO3DBap%2BD0zUu4Cv1lnqKmEHFY%2BMCPUhz1xJ5jO1zeT6%2F%2Fw%2F5xZ0P6hH%2F5jsdHm6t%2FZsYSjB1wBgFEj1UEKsYpvEwojKDZATvvDtjvfE9iFTUv7IHBp3LB5pUe7N1tsFGTY5wKiMa4nMYhyXXDccwrus0nj6sO%2FmZz3V%2FYsz%2FtB6kHXM%2BKesiAYFBAqHG%2BsxnxdmdyQOnjGaAjwT66Qh293MQ3uZ0jkprQDAlbxulm1DLSKFdKIOjB%2BwN9rt0m54vpUz12vKznDxhIRcmdHNrL%2Br2v7U1V4pJXkKIFqAR49tX1Gpk9eZ7uASReMTkVsMYPES3ihm2HHqdLQPObJB3HOwkG1eE1z%2BAEXYUePF5cO%2F9VWF0bEqTP7QiTNbMHOY%2FrCfWNqowT49YwAUwteBjHZleVgVsZ6A%2FVCFFcZycaAqeozqx51jaubWCXyoJdqS85VGdj6p4oqDcTs3Ip7DGSLBjo7bhcKHuYl6TaOgVbnmukLBVJMtPxysxfPGZ6Tzxak15jxn10BY51%2FHRcM0tgcuhnGuuIoESW8r04XW8c%2BOGn5BVvZ%2FgjwuE8eyof1N4eIi5Vt4HSTNav%2F23QIjSRuP8qMRHPmvi1vXWH%2BuDTYlk8CtV1yDzLTcEFG8aCLF%2Fp6MKDcolXaLFEXuC4zcdZEa%2Fk87ggPpDLjUevWI486qKKsqk5RV2I1%2B0HJTRi3J0ne2SErR%2FDUmlwBrW6qqpZfUiShH6kNUAyBKqA8i0HsagVmIxNIw7XX14FxNULClBLYOCOlLq2TFenJL6izOkeysNebPJwcp0bBbN6vio9Bs5K7lN3DbsT%2B50FP0tnezHN%2F3Jsg9HOF5Jq4b2K8hj64E5JEFuDX22gc2yTGSevXsBdGB6McjJTWep4Wa7SmzCaWCfcqEvasaEhZ5wwUqqQGLF9QGKQpKcx8nb%2B3UEEgn6GRPRyTwdBexzFbrBtsCt%2F1cVOwJiJTr5wdww7hDTncA5IruYXFJCObmuTtJvRpSbk%2FcbqH9FYKDFAKwtC3xGYZUJiPhGoOKLg%2Btj6qypNYaGQ2KWu9kPmdjqB%2FS%2B056%2FhktDvfVFr2qWbEdhsAlc8B28zfYuraL5sWh3X1d8aPE5BmGfcPjrge%2FJO%2FHxixo4r6cEWeDgEasHq9%2BANCt9KoKJ8oPEB1ypGXi2SgjGJNKx3UA4PgRQOUDznkH1oW2vRneYwnCwj3a0ven%2B0prEnCwIOsWIBnfTxtWzFOuN6bNOg21CIE8aMSgztVNbzgAXTPQ6%2BVjyk0PEB9MGbInQjphysGwrmv3FmdOEGjGqtpnETuFW9Ec%2Bdkkv%2FlMLsgQt5eW5EIiwPW%2B5MzKoOr3lGX86oHc2jbm2j%2BNTOQlxueKVocjrmdo9bJMFcZt5vIHiH35GL%2BVNTiFo3Fvxe0yG01ELjCZnAqY0G3FJIpcMP9mHjJpfGzh73CQCkZXKjwhwuxzrAJhDoquMAMvSi3Cgj36Ypll7G3RIqzfed%2FuMa99x1R4bTKgTmPMvGC1WZCnZ8%2FTuVpzq6j4VjPryD9ysQpRpfeseNemjK6TmlauyXYoydv7MhwtUQ14QyYil%2F%2Ba%2BYRfZXMfmMLYdmSmP50IBcke7a9Pt35d3LT%2BJ1WAy0VcUPkuVls25tk5WLLS6hVl2T9bQab70qPd%2F9k%2Baqwla6DWWrByvRdqxVDnwU4pkbfA89TWZa7Ysdno9SWQg%2FIOKe9OXcVUErJrYKd1xefWW%2FEThLLrWfVlBWBa2%2FmkY4tYkX9XSzvk3HdM12zCZLbh3lRZr2FwOEy5OnlNYhJd4NT%2Bulkl3r0D67CxklqwV%2BvXHygh53bRPpMam%2FklvoRyRIrHPys1mkJ6Naw9iTZ%2FSmBDRz67oqNYUB%2B%2F00p%2F0TC0E4WiABatHbiH5vd0Y%2Bsv7d%2FflOH2vnUKzt9UDRz5alxDyJV%2FiT%2BwYgVrg1SPVZFVmR%2FvsOhveQ6X9JxvpRT51DAtFqw6W12adYRPU2pt5NMt%2BiLEuBeT8%2B%2FHVBL8Q2cA%2Fy5GOox3gpXIuLon1WF4DKRwgaSmDPSL6Zs%2FfKm5xUZiLUM6PvzB7LPL4iCgdC1rROzeIEbd7XmBNq%2BIWoM9ij4pBGgm9LL30LgnsUMIAVe%2BNhiS4C91KnB5xvhh5VsEOPFScFSHiJYZW44oKKIUJ1n1IgND1T1pfS%2BFqd71FgErzwCXxiZKcYs6IJqT2m%2FQ211WMkheE5YNf85uE2D6z0kdG6xgMpVFlQfpzANZ2Des7ot%2BPzk2ygt9eOEpHgzP90HtqOjDVWGNj%2B8lIdqebr%2BOosp3hqNVWb5oRktsXuCd4NQHH0xUk4CUS0HRrvZ0DecKyV5xpt3sBi6OGHn1vjnmS2EBWPdPxdj6unh%2BBdn89EFPDJk1dXDEjVvg90LD0EsWEZZh4geypnEgeZLdo6ym2OMIAGAWAOH9LvsQFYoehMC1D6OkVB4KnkToqCH2csOTByGhSfHwBdIUdJPfF1d56XV0oX8jdYZV619zog0%2FgyS%2BxqX2DX950tJpMxEqiWkRdDtaC5WsTcAYLKeoiKJhPrxvLttMIY68prlSZ3enj4Vpb%2BkgbKR2i3QwwaO0rBkNJQ2szanubA70PrP6jB8KIt3hGisYhYUKh%2BMDVrARc%2BrMPELYVFLIpbXym1HGmzd8msrj1zkBxj2dQCPqPW3NMUTL9kxfHJL2lF11BlbEo2aChSbAP%2FG6oK4S5wCY%2Bf6ULHKEuTcDCQ07vPvS%2Bs%2FtTP5bddFbu4uPGP%2BdX9IKH4xxPu%2Fwxd6Br%2FKXsWNI63FsK0YraP3MMtYdwJjpWFlWuAUzqQQcxfIzDiBJTBi1hq6ZafWC8LEQkf9FwF0cgOWBOdGkizJ07qBJLJdpGt%2FvhssEvYmOEazzVeDeP3SrgdaJ3M%2FzKJX%2FtJ4zuUJHITzQkLhJRXPz%2BSjXax%2B2KCPuTknXEHv%2F9AMp2qXg6ot1CI9i85nq68cmQTOAUAHVpON9RtoLsxRjJ2%2FeFPNgVj5o3CGo1zCwwXApQGeSZML%2F4q0eW2iv14%2Fymow8w%2B1Epm6uMMje3%2Fs2zqT8ko96Zt%2BPhLq3xtglM%2F3g6m1ZKIonmw4FhRuqn772YcQ1AQ7e3baC6yWe05rlKFDTd%2FcUSfIob5rPlz7mrmT9y%2FJpgiBpqGRluIVYVGz9MAxKWcZ3HADMRyTwHwz2Y3gG5FxvkfxLhv%2BMiGTjMZjMyhrScBfPriLiwcIlq3SZxYsS3mvity3WVf%2B%2Bti7kTVK6UiDMGSD9mZNDEKt9heWnNcBFrZJf3JDOJ1KRKNvXmdpStrHOoJBh0NTAcfNKF2xA%2BA0W3W1IxQJtOuAyrcpJZBbl8j7OPM7sLfGPUyo1%2FtCJPZaYI76Gd%2BBvk%2BaWbXpHQTAE3%2BDERm71qBIZyxruCqrS0RCgxszXj%2B2Db1wh2sgt%2F3iii0f0dspA0sUCmeaTWAGhPjjdFS%2BX8lFTNVvuP1zY%2BfUlyrK31NDnDwv8qCXgL3Q1uyFPAMBg09JrJcTNqI9KC9gdHm%2B2sf5ivGjN52ME3FW2exyUjHdgKEDuon%2BBi6NJ9yMT3jpw3DmYCM71uBMYjcpUcOwf5nW4vWW%2BYrjeKalANAuDsocrrTxiFC%2BCObPS7Tf%2FcjQc7BWnK49eDI4tliHDddJdH3N5PeuxhlWuBnNfNPIl6pi7ofRZIAtdUYis1F9iBfMl7poUxkXkmvHggahi9oP%2BXqnj%2BWkB2fdRoMdbT4b8BSqGXtKmbbhCWXyoroG6De8lLzxrdabakgi8%2BZd9iRII%2B9fEJQr9LOaIsYE7nCGpBojnASQR3gGDeDswdoEQ2kD4dCnmDwnA3FASWLAkRcmCPRrwYC8oJX6LoDMf0Cxwm3iqoDwLn9%2BHqhevsV7f6CZF8L%2BH2sOHqI23TJIV21uRtoSh2RTQAQ5cg5W7TkPGf2Dob%2FJoJk%2F1v8DaXDeKRTZULT3SUbhiRuvSQNJLSgkJkbse2a5e33O6KdW4WTFRBWvLy%2B7CLj4Kpwm34HuUI3n2y7aiSe3QW6lXhaz%2BrPozXR1FcHcRKoi23mvBb0LHvdRaadkO%2BeNuex53ujYqx%2B96DJpXCOOvxAvSIZ4qOLB6l40AeQCyGH9N5b%2B%2B2Xl8VXeqT6%2Btliqg8mgMez8N429so3D%2FOErws12iHVv%2Bsqsm4KIfGFUplgaA5RhtsVhAUavc4%2BjIWBybVtSyDXHs2VEHhrJLNBMyAeEm1VR30trQG%2Bsw3NNU3jnbNwaeRznzObwkCw32i%2BBjjcOIBEuFqMzsJA4G33N1%2F9JPVPsN7BPQomzPLVws9QyjBrutmEvAJaaMMHgaqZh2X9M7vwBzZBUHOQQwJtalHm8sIswdGzqPMorwNJpQqNs2SxlO51jQ4%2FOUEQ4VGsD%2Bsezb2U8mb3IvgNTN5Q%2FAcqiI8Nf8aKHv88fhqPtUWyOGtt%2FJ%2FqZP5qiNvIdWRgm6tpfRIFjQD%2F23FxsWL5L0RckWvtpTj3m8ujyKzZeGDDK5hqIjroknNekN6brixB8eM%2FqXru9UzXdthcDpFQH6tcJ5wCig4xRRlEaIlw07cyxMsKfGFv1pdZB27BZOI%2Fg91yd%2BTQyUS8bpi1Npdis52ob9XWXY8otEYNimCgEo6k%2BNzYS3EAIWdH2WMr%2BvI%2BAVAB1iPviZfvAn40BLP5BgcZShI%2BRG76xJ9xZ9bBrJ9Ba7fr%2BmzGREymGdKhiGFOIpN2TqfvDmWNxkhHM9%2BAXTcH8iKNOB8B4SK4P15q97Bo%2FV993FhLxwx3Or%2ByL6opRF6yefKcFwa2%2F81ed%2FaRBHcI%2FjkHlaoa0GQA3U%2F865uPig3FicyQ8MoUFuM3O37oP5KJ%2Fm6yim73f%2BJKfUgHiIYQ8%2FcA0oydrJdQVjNCazTsFOYNf1eGFk1Lbtwag1CobHmZBdgsSWjIio4dhZoHnL7%2BC5jkGtNy6Hol8rSbNfrANFXSZ44u2AoNCh0YRh3wkGb8rHnSE1dD2Pxt82375bbDcI%2BgY2%2B8SHtzJxxUq7zHFwqx7rVPLJ8D70YkIjGSmghgW1W48MX6Zxy%2B5fvo0x2hNR7yUgeuyngf4Dnw%2F4Q7DoPTRbT4%2BlYifzaHUaT%2F1bklEKVYLzqN%2F0Kx9l3Jd984HFoopBozxDNdt2S645lQ0%2BerQk%2F0dppEZUpgCh4vtuDx6uAV52h0b0cTkvgUDsUNaj9dkKc%2Fs0iK%2FQ97JWw0Eds1opbwKitFKszOgWn3IztLXCIEtqtu12oQEuodbTRBVTt0FqQxS%2FRkvrO8K%2BE262WoSrInv3G0fF%2B8bhQ8EbuKVsd9yJRFOeF6pCrHQKqhrSEF5sVEdPVQboNIsq1t8uvxuv%2F5V%2Fc4lH7%2FNZFpiIS%2FrarTeZL7aB4i4lcsExyweysg4m1Zv1iSJXl1C3DZZ1fiFjlrDFWiDTPf5JXLUBFz7XXyHDv3fTzhICDL%2FUBARy7nCM4XEy2YdxSyAGBmjU2QOfo4qBH71%2BunejnGMChICiRAixqB%2BzjKqIhV%2Fo6xcHPYi7AtztkqMLbCOwZZxB8sYxNeS8f9g5ky6Pc4W44XWyCEBfC14j4XKwHWbhklWP7cSfXxphQ5w5v4pZAvhaCtFzEA4n3%2B%2FOyZkcDRwkxtBeC8DYJwX4D6ZCstOXX2GLBhxlUIQXrBHGvtVehWQKzEChC12sB%2BeqROTk1Kcppubn1NUbwQHrNCdIiGAynimulatir0mGwiYygJbRr%2BoU4RM%2B1eC1F%2B5d2i05QISLZ%2Bwx9omsDiRANeKpyP%2BsJgQA24ut1e3lsRsXEOEX2uMPaEMADbjdR6PtdbMatuRwuM6wwXfRVHSS5%2BEVLT3dxU9N0%2B5uU0R%2BJ4ydWjNTZ3%2FtKl3J6yDJ72zjWOG1Ofr2IY0sbU8zx15sW2i1D0WZXdHYTfDdT8STmlblWpH%2BsaAxB%2FidxFfY%2B1McL27JUYJWizSi1gowOGIl4OdB3tPpaBDryM2qhz%2BRpoiu4PBRfqgoYmvgIgPbTKKnDOX48t40JDo3NJw8rhS4PINZtDVl0%2BKNzmRaod%2B%2B4qPM%2Fajux5I6Tm9vol3u3zPmsBTO3hM%3D',
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
        resetAttendanceTimers();
        log('出缺勤表格已經載入');
        const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
        const attendances: Attendance[] = getAttendanceByTrs(trs);
        updateAttendanceContent(trs, attendances);
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
    updateFavicon('https://cy.iwerp.net/portal/images/chungyo.ico');
    main();
    window.setInterval((): void => {
        main();
    }, 5 * 1000);
})();
