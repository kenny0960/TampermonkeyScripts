import * as moment from 'moment';

import { updateFavicon } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import SessionManager from '@/common/SessionManager';
import { Moment } from '@/moment';
import * as PackageJson from '@/../package.json';

interface AttendanceDates {
    signInDate: Moment;
    signOutDate: Moment;
}

interface AnnualLeave {
    totalHours: number;
    leaveHours: number;
    notLeaveHours: number;
    startDatetime: string;
    endDatetime: string;
}

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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=%2BlLN4mMQcoVJkF%2BkCrwCft%2BNELQ26q6HdwXFaDE8U7BHQ6ZRV1GdWYrpZptceKiOdBPWAOgrbc4uU9xZPJPt3Gp85AcCoJL13mq2d4EInpoTyJ7glsdqNcbrY0vNHR30dOpIkMHCvC4ujNEo8bmX5YMq%2BlbS8qYuqpAwOb0WypbuqpwGo86jW50m%2F8ZD9sD%2BPnbw2q9tJ6g6TeBC74c4M0dR8l5AHKkIdeTQQwnZvIBB1zonryj5NhWYdPMHdQ1xUXmXFpCVkqKwIOd9QmTpGo%2BQtPMKHQfh6rfAmvH195q3gWwL9I9nF5YeJ4tDT336Pf0sM%2Fb4AMGnIJkRjJZK1%2FnYvxIOQ9P4DrrexVL31rHD6GFCwow9qVMIUka52mliRcf0%2Bgb97M17jhzHPnmufIfoB59AfQ0dgiwv3%2BFQRLmd%2BdN4kNHOC1smE3hbIikEpMDswQzk%2FQXhVk2hXFex0TSvTRQIyXPfoIl%2BG79SpGZHLKTL9SvAx7kcuijbPiLPFYSS87eeNeHcnjj0GChZGvOt9%2BS8Pg4DEzTCSlwxZ7SeEIIUkE4otSTmALOYnsnAyEQIP8oNtP%2FNSh%2FwxdlwFZDHNWnTAOOruke8jVCDhf4siFYh%2BDqNzLNsQ7bhYl1pOHawSJ5LUQzHn2XxAz%2FvwN7Ce6IgU9hedLbVstwbW6WcTj02d9x5hXr6GpJMfa4nm5RIzm7a%2FzdTG9xWVn%2BMSfIEt0KW2pRcvWH7wlfzchWW1ugFI%2Br9HRyADSjcSPZl2o0ksNdZ3IQcM0Pn4btqBzYGxR7wk7fxUlsQa1rWOyKze3q0GhHsqEcIbU9YV3anAb9p9DKxOMOGszEB5AF8sHT%2Fk9YDpkFKRHjtl3y4TqfFpSnhz9rlzi7MeoIsuqMkplfkW%2BF7NKal1tNmyOxAtH0XLLoNvh5laFtr%2FXm2xX0VSurJCHfr73hu7YjD%2FSLFuEFNmzTC5OImIzpO6GI%2FtUzBS0H%2F4Omefh3hgAqkxqUMlYrnuW7%2B49Pafm3xK7yj2%2BCgXGB4BeqMNBtrXyI08X52Yf5Kd0EPK%2F15F4ezrAFls%2Fh0CYzj9%2Bzk%2Bs2VTtVVPz2CqJ6ZvFWIsVnjWDveLdwLsZEV5A5xgIv37UJWIC9kHd5U980fe5uc7HGtWa4encIPRrBwmwAgzZuJi5G0jH1N8S4MFGud73vk1y%2BsB4OaCAPClNg7kATbEYsxVaF8Appdar3hY4ECywD78bNERtP%2FkjwGbcMQbwAzxZYne9G4SScSm0T8Pq%2FMQdJgUEW2gzyRTOI7Z8hP2sqn6qO%2FXYul2WxEYUrDtusDKPuBvPwk6R1UMQx4oDQgHowxogEHRK1sfWoN1A0p5AuYcWvNZ%2B67gB%2BPomtzes6XrJ5V9jox1s6BneO0yrxzhjNSnD9xUqHOQ6tjlW2p2DvZfPAwZ9GfPnSgp%2Fb3s2zc2QE2wQpaNoRd5qpXfNW2%2BHTjxjuzzYniT%2F%2B8F%2BA4dcz9wTsvVINVnFykdv1rgfl1YrP78xC7ze7VmZCkbM2UUuswfZ48HAINlogqrCAW6DIWAgLjaEWE%2Feznc%2F32qzhQDrZ%2F7%2B%2FA%2B0lSOKuliojX%2BrW7g65J3iprN1UkTErblasiyGLltZM6F3C63cfRzik9Q3G2Fo3Cek0mvXt7CXpVQKSrmmDGyhHRPN3m9yZkg6%2FY6kmZr5QfBmclc%2BhT9reSWbPWI5O2Ws%2F3QAsZLVL1eGj4YCzzdfzBXDfisKhbskj7fJS8CMK52PFt9u3X2Tw1iG9ebAqLMFWg3HKEYbxKa0xJ8IkGe6JMMYmZlJiNVfpbNMl8uj%2BwXKP267OAVfEiJDjQBK2QBcjeAeJ2G21KVu9hdws0iGLYHWWQQTu9OWhohDA6F82Mw1doflgkxout0nT3jwZDnaY%2BI3uvpvFDrJ46kk7hRAZaMwAD5QiTI4fjlbJjWhjPgdAWXCgLHT5KLtlMOMldL509m8XXIpHjsTu3kytkuI1RY%2FrgyXQ7KbrPgfYeCIj7cM%2B0kA3z6GZ%2BrGjEcX8jBkLZPwted0IJPg8PdDF5L9tWXXWINIUEcPDf2kgXRGrclb%2FmcIQEfp%2F76E9k6S%2BCWLxXXESUkz7frEx%2FA%2F7slxJCfXcO6gTSmlzekr%2BMcLMn0TuK5MHa1OEaRxKV4PsCp0kME3DNwO3kz%2FIbB67rzUzYLYdCKFzeDAg4jTXVjSMJ0ouvIugu6V7vsUUSPfTw6AfrDCT6dW5qM2lMfRU3025um6ckAwwtEHxVl4UaxhiTV%2FpOKK3qIzcFNz8t%2F1bZTw0CKDhPPGRXr686SD9VuxupQUyUQfGiuHAenelAQh%2Fz4%2Bh2QY0QY5sJFT%2Fwvuach4QjTi9U2Edt5pg2PX1kNlORCipXjXY4K8uvwUMgfQkTHl2b8ej%2FQvmTf3tG0r%2BsKAr5mS%2Bm2N1lTzuBnM95gyPzTgdlO3o6vB5sBWkXna5XHmHUpkN6MW%2Bw%2Bi5ad%2FWKLKdRiSf7hj2NBJ%2Fzhc1%2FvK6XoizfVrFI43cc23BpqY3ynyrtGzjLISsgVQWweFDYPf5AuPhUqCRjhEA0pApz9OVaqVG%2FScnbXMZ4g%2BI6oMOndUj5AtHyKbQ06boxe8%2B0MZr%2FwaEtXBpTueDlZbzVv6OFTynZPqC6jRfGU6%2FimOHkRpUuTl1l1QGuvCVGvNU0Gy3XQTohoMD3ehahjfZKS2Nif3hcOtZQrVLJuq5gOkwZxd9kzA13v%2F0hC8iH2FadiKajkeH%2BT2Mj4sA9RvYU122ZT1WRx3GINSiaBkIBlahNLmXSV4HvNxhNNhkXiC%2BkwErWY16yOC1Ilfcpxh0P5xZu3gaNL3IGQl3walpPvRLrGnKENLI8Wye2MZJjl07PbTtskKCelMQscO9PM71EShg7QqlrpnOw6Q9X8q7xOtyYPaL%2B7wFydYZFZDTM3DFK2fWmdaqNRECgwgsz1AEFCPke%2F0%2Bf6lqYPymC%2BTPDL%2BUINa187g9xSkbumuKNTxXoAuKb4HqDnT%2B7b9S4Lwrxq6OGxyoKxj7NPUwkG%2FR42epH2SIwmFLwncWjyV0S6jHra1E5ySxq%2FRVyFQz1F4XLyOwxaRBKmCEOJwhldm5MalSkkH5JzwVVwc5JpuGPUkDOBuF%2FT8CaoL%2B4LuBNs8uHJyARR8qEsHQ91gZkdXMT2E5mrs7eoA5QXejnAo7%2F2vPZIfqEEX0ACZahAvIg%2FV9%2BKWbYbiBk4Ljfxf095JzeHZHOLvzk02%2B%2FEvYBit4uo0d5faKWr7rmiw30WzskDeFj3DBaCdtD1kdq59E0PVbe3OZqPV4XkMSvThdhOTxexdCzz8xdAGUAnaPg0%2BmzMMGTwWfG34CV0%2BTNLFb0HaC%2Fl1OtOTh%2BJIR1c0m6KPZqFaJcBSJKHTEhaLkRwIo1UqBcScgzot%2Bie64VClyErT6%2BxUa%2F2N8uLCsuXMHmwc3zgG1AyTkRxBLmnJP3%2F3SRulUBzVQ%2FCd1JLiedF%2BNLTDiKJMvZ3fEVVDXnh2OIQbjZh9DDSs1HO5vsKj8dJ2nshO%2BBksKLgZPa%2Bj3lAyEWAyn6HBFlI0KzZDMl80lU7ycsBEROHzRzI6aSp3bI57nXBnqVzPuKYGWLJvHRnFwhSiK9ArpwxkIR8VUNIO2ePz%2FClYVfGCS30rh3W5A0pPBMPfnKXN8K03tMGUDjnY%2BblMONH2lt8jOYodvvuoedvxnOQK0gYQnjVY1bs7X0L%2FX7mqxNnByk4dQnYRtTF0Lm%2BQjEbTMDUB%2BTyrq7bpQczTOBUAElUiuDDmY4VZ2Kq%2F2MW%2BqBcdOIQzvEvmFWL9Xwlftxm4wOPDLXLIb%2FyAvtRMueDR%2FMXcW9XarLHgFqhJqvCSRNF4gL6rjdKsyojsq99sfp%2BiiNFyJdRYxyoofOjqiMYOqGBOJAtk5xkCtaGRE3E9SmOJROxorjkbmxvbmJBL7gJEltup7qqE8ycpx1n9VXZy286caYNImccNnVgO81pz9ezBaPGSXC4LbA3EXe7ZHiNc2BoQ6k4Waivi9n9r8nIMmn7uq2HBYwGx2oQpMtx23TSYlVCf7MS3PCM%2FTNmHsgeRJK0kMF7MoAefrECbASlAzhmQX06etwFXWaH6qQhGlEFgVgWian0Y8kqg76Lrci%2BdCUXiglI5qJk%2FKS6z0tS%2BsERSYxUGKyWuWShkNTWay8mDDPwc8HT%2F6PyojfUjr5TAHj5GA%2FAKTJomY78csL2dElPYBl9VPfa58N0Jme%2F9HfWweVgByDhoGZ79GUYnF0rn8RalDnkf9sIUZ72SfLc1azbKrncsgkMdZYTjRSFAf0cpjGZGE6zz9YM8a0ljaTEMrGyUEiGzHl%2BdP%2FE9JMKeg5s3OVOg8ew9X81Xo8pY8mWQZ77ckLhZIQC4M%2FMT%2BVj17TlGMEiiF74jsiiwjTtbP7CzWCp3O%2FJ500BMt7cPn0Ni%2BU30YiIFIC%2F3rCoboaJMyAgkuWwgp%2Bciyaq%2FJmedjNH4w5O3R7FCqNnwneLtg3TG%2BKecIZBBOZLemXvbLiWrR96wcntXd6PyVbFFR9Ft97vlrmxA7qIM5ErNlMXE2WhXoRGeYzqR008PjmkOWKjcdnBBNK%2Bs84T02X0RZR0CsJP5iuSluEqnSJCdXfrJJS0nsXd1BJANpTGae2UUOp4JFig%2FCF6o1De7f1sIj4y6TGn52i7GaJ%2B0AjQCYo8akWZUqFl1M3tm2DGcidj0Ny3pyO6rnCgszouyv%2FngKxC3XI018WFSjFOyLB7ydt8heS1%2FXlaTXamLvonrMoo5OiuNcSzR%2BU0%2BPaZyF9UJ%2Bsa5fHGSi2yNZnGzZCAXI%2F9q29k0TtEmvEcp0RNfY655Kp7qENHf%2Biaa21krG1fFG58wwsxrsA%2Bvc2IVIR1VdBYifzt8Z%2FrSjayJsW2Aiamm9YWisIHwA3QkFCx9HVyYfwXcD9Bbukg8s0gt%2Btmk7y2h9PfudRZJiGntaxYech74aWN7zD33a7fHrDQ1H55f4Gqb5U9emiAMPX1W2FZ0XcZeF7ZnHAS77SkuNq9gE%2BxsdEA1b1EcUGik42i%2Fwpxtx%2Fyd4D7gPdP%2BsMn3Olh%2BDGZTbdWxkqOElsaEKUGE5yT%2BBV25SVuPErTTSiDNKAzS%2FavhU9rMeLPXRwqf9LnlgYW0n%2B7PIgx%2FULWj%2FCpCIDYM9JQXrby0Zpwdc3cC%2FRmh1jTj2Nm4boLmkxFmKlnRqO4GUchOeRupFmFtYy8Txv46vutUml63rGVUBRm7fq97Yxpo5kYq9G80OROAV2e7B9ZBhdcWwM9b8qmVMtjhACHlNuApk76meVTSoSQ%2FtgCVI4x%2BKLz5sWfkkwyidVrKXSdtM6DIRKSNvjaQmkvcu5pkeKNZ46NplvorgPu871jutRfRKtrVyWqJT%2B1I6TeX1ITLDh0N12nUhfBkuL5zsEM7zih3PNqQZK%2FSCQFtIo11wRtPl6KdZet9u%2BnqIKFe3DyBu78fpCcxUZBIFN1FGsA01v1yiOryEuTjYuEvDxUtF%2BQ8JpeprW9dlcURkuo4JFyA54QKQ2snslYzbcKM0QNshMARAPK9r7ZnOTDlsjFiSDh4FhnAexv73pyobA5U%2BgnnMguXcI6Cchybs8lOp1QmHtH8AF%2BaNhoFur7OZ%2BluKds5KvPqQcX6B%2FLYb71o4OLkdmGdwMP5ztnzrwsyVVNRam10QfTlPQMkvQNWG7qx4%2B9rWfMKLcFcO0vHjddzJ6OXYyQJe9CKOJ3gBQqyoA75ling5wquXwNLF9Q2qSalA86MZBWmeU2ZChyJhejNG3gI1mEJ6D4VVaEwq7yBOZHl%2FPWzS2nR2JhQFm50y4G6bolZiddOm8aM78BOUBzbAr9IWde1jGIAL8PGqjvoNLGIvt%2FLYOXjHBTio1743eYjkxk1xIYQaiFKjU4tfRQCZUvgp6oLCBAaOiiYRwx3saVdMBwUFTmGqKSHdOYvVD0FEptm3GtTH6D5fSgsPjx9Oh26VhOfC1ILE%2BNiUAuSN%2FKCNJgUhIElmioMabz8B3jYz22zMhBZ%2BMOrWit5xWnScwM8SagJWEQQhoZji94vzNI0ZhPBqfU8MvtPtbSEm6foCOQHND0ALF1ttE14IKQ%2Bv3f7xBcJw799lXs1vp7jVI%2BK9vFX%2FxP%2ByV0FboCrEgenHSsBlz0CyRoTLD2Eu8mqqjBIsQF6aYX%2FwAjPovjaC5L2WjEVWkNTVyqrD7ZuX%2FYmlwoga%2BbkvtE1AqA6%2BxxSgkmIcSpjTeFGJCyw5dD84l%2BygdnZD%2Bh5aHzeGMZgNF71fe3xcs62zzs4eDZQzWoHlEutuLRLWMjDbXTYt3AhWzIiZNRFcWosnNSkGFmkMtZYy15M0UQXzcxs2JYXhhak1xL%2BtbE89IJE9vcdpFj9wz%2F2VAxNIaLh76vCj9uuNruabXGPgwTHfmYJ9PfRwjFro7AUVDJ%2BfaZ%2B5W%2FgY49MLwm3xTs6Wyp6aku0N9i64mhjVHWipJ67AADYkyEo9nxRC%2F%2FmNkW1Gpiok8IV1Kjwt1TzQkQ%2FBkJ%2Beb06woackeMrsLibPRPgCKuOqoFHMnAeNbbtj7oishostlSwsed9BqEKnHjoBBG8zpktrA3kjQ%2Bj0F9qY3aRDAxNMGDqL83%2BiSU3T%2B6wRjuekM2I1TXLNHIaBOY9rV8BOrPtUAj5leJkLTvV1%2BM8QFne9kfDTGr36T1u8odW2eHjmo7Pk1s%2FyJwwg4%2BqqTVcRQWhwkPQ%2BxkbRfluyQBkwOyG%2BRYwak%2Bbx%2Bx0SD4nKk5wA%2FGz%2F2fM05%2FnK7YG25ItgsIE%2FdEe9y9YXNAOF0dhNC2qxwZjqaFO5Gqw9Rg67CytvoH%2BCV12QiQsl4B7PdPenMjYtlwxAXtMiC6AAFdIHS1h%2FyjtjB9XwWDpMOKC5%2FUfTOK%2FbYAJfku87TEDLDDdgAy%2BNSHpI1MHfS6HsKTAXnhZ6QPZMqztQM6VSrDsiLKwPgeCnO7l9%2BBKcl8IM1mh7C8uPziMRcdToyTE0XqF4CdZhgL01AYs75P%2FAT3DeV3qixpyg0q7v9%2Fk0dHKyqBT%2B3VkLnGlr1vgZikZ6WR0n75ihedxKb9FID0Jz9CX7T1pE7UOrKGjluoQh9Z1mHIzOQwkYkOBsSXI1bfoheeyzr2u4w%2Boy16oCz5GLlwEbdqITCNgiRY3RPUrKSCTyEzTvNqN0NpWv7C6DTmd2K%2FQCEKko5uy7%2F%2B8ev4RleFAGOLisPbilLwZk4CRwBTYYigxDgUcnDDAMrunmhOHO%2BLRydIfbCeOk5MXhtWa2upud6Vuxg89Iwlwff8%2BzkgRUBbjJvgTD%2B8wVd55STdx%2B4SvzZtVDJwcvCWLcUqaqRR5FS%2BZkt4p2hgxw9vHcy2UvQWyPdWQyHqTjNSfQd2%2BNV5E%2BVM9%2Bd4DWzIOJ6WyAPEiAgh3p1Gnxeh%2FLwlb0IiODvo16jbpLpA2WoE7Vtjqcgu5VXiQ0H%2FWwHpSNFJUTwpf7xxR8JRlpeQ7pipZ61ZR3NyaqOsQyw5Ff%2FGdsiNzO3OeAFN5ljY9iQEtWLaNLtEnyk5jKMvkyR2%2FbTuRVBREUFgFse0s8PgA1Lh3NDCJ%2BX566%2Br9sj09QQtAdDzEGAJ9PsEmUUFcBmr%2BDbUEvYBqIKKBuqwEKim0Tf1zYwN%2BG5YTg%2BmH09Y2wSHUUI2v2FaP7Fy7Njw0ywyR9OIay%2F2Pw5zopaRHmvcAScwIA%2F71LhUh%2BQy1RE40GcKvTq5FhGezw5CGQkXilp6reLAkD5LIQf1uw8lGKN3mc%2B6%2B827NPw0iPQ6tsq4mLgPc7q9bfop3nlXVSmmJKcW09DxZXg0KxPDLVo5KfCuIVpQ04UP%2FLHyjLoN%2FqPAXCBQp0f2NCupli31EvEBVoQYwsq9%2BVhxkmQog3Ayh8wtd0JE5pjrRVX2s1six%2FYID%2FJ7wgWGE%2FZ4WWlEOMoZ6ZEdp8xITXFVWRn%2FlZcceVx5jIwTwUS5hPrtNgRN6rlhFn4YeyfFlhAelEZ98iQHUBPStYNG%2F%2BuAQu1Y0WpLZCEt%2BlBkstz1Y8yamxMw%2BzStcE2Dd%2F0HstUjFCAkMC84Fcs6jWfCDM6LQ5Wanc1EPap%2BOzZ9YRZh9mH2k7OPTA38D04Tsfm4pz%2B1UTtWX%2F5g%2BeQCQ3ZQTQ1JynIodg%2BLnHRTOhvFuHT5WmHTjXA9IZ0UUlMj%2B9UdhpUwNpqKfgiTv8iqy7fnDYMVeoPr3AcdebfSUpMbDscH8i46uElcUSVhoCg3rPsqskP89pesupHDl%2BAzYQAw%2FNtcQfGQlKnfz8OocTVcWG98qkWkOVY07oWkPe6FM0B8SVtttlDntRgsw%2BF2WNvMcp%2F6Q%3D%3D',
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

const showSignInNotification = (attendanceDates: AttendanceDates[]) => {
    const currentDate: Moment = moment();
    const { signInDate, signOutDate }: AttendanceDates = attendanceDates[0];
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = signOutDate.clone().subtract(getTotalRemainMinutes(attendanceDates), 'minutes');
    const todaySignInContent: string = signInDate.format('HH:mm', { trim: false });
    const signOutLeftMinutes: number = predictedSignOutDate.diff(currentDate, 'minutes');

    if (todaySignInContent === '') {
        const SIGN_NOTIFICATION_KEY: string = `${currentDate.format('YYYYMMDD', { trim: false })}_SIGN_NOTIFICATION`;

        if (SessionManager.has(SIGN_NOTIFICATION_KEY)) {
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
                SessionManager.setByKey(SIGN_NOTIFICATION_KEY, 'true');
            }
        );
    } else if (signOutLeftMinutes < 0) {
        const OFF_WORK_NOTIFICATION_KEY: string = `${currentDate.format('YYYYMMDD', { trim: false })}_OFF_WORK_NOTIFICATION`;

        if (SessionManager.has(OFF_WORK_NOTIFICATION_KEY)) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `超時工作(${predictedSignOutDate.fromNow()})`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉超時工作通知`);
                SessionManager.setByKey(OFF_WORK_NOTIFICATION_KEY, 'true');
            }
        );
    } else if (signOutLeftMinutes < 30) {
        const SIGN_OUT_NOTIFICATION_KEY: string = `${currentDate.format('YYYYMMDD', { trim: false })}_SIGN_OUT_NOTIFICATION`;

        if (SessionManager.has(SIGN_OUT_NOTIFICATION_KEY)) {
            return;
        }

        showNotification(
            '記得簽退',
            {
                body: `工作即將結束(${predictedSignOutDate.fromNow()})`,
                icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
            },
            () => {
                log(`已經關閉簽退通知`);
                SessionManager.setByKey(SIGN_OUT_NOTIFICATION_KEY, 'true');
            }
        );
    }

    setTimeout(() => showSignInNotification(attendanceDates), 5 * 60 * 1000);
};

const getTotalRemainMinutes = (attendanceDates: AttendanceDates[]) => {
    let remainMinutes: number = 0;
    for (const attendanceDate of attendanceDates) {
        remainMinutes += getRemainMinutes(attendanceDate);
    }
    return remainMinutes;
};

const getRemainMinutes = ({ signOutDate, signInDate }: AttendanceDates) => {
    const diffMinutes = signOutDate.diff(signInDate, 'minutes');
    if (diffMinutes === 0) {
        return 0;
    }
    return diffMinutes - 9 * 60;
};

const getAttendanceDatesByTr = (tr: HTMLTableRowElement): AttendanceDates => {
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

const getAttendanceDatesByTrs = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>) => {
    const attendanceDates: AttendanceDates[] = [];

    for (let i = 0; i < trs.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        // 無需計算上個禮拜
        if (/\([日|六]\)/.test(tr.innerText) === true) {
            break;
        }

        attendanceDates.push(getAttendanceDatesByTr(tr));
    }

    return attendanceDates;
};

const updateTodayAttendanceContent = (td: HTMLTableCellElement, attendanceDates: AttendanceDates[]): void => {
    const attendanceDate: AttendanceDates = attendanceDates[0];
    // 根據剩餘分鐘來更新當日的預測可簽退時間
    const predictedSignOutDate: Moment = attendanceDate.signOutDate
        .clone()
        .subtract(getTotalRemainMinutes(attendanceDates), 'minutes');
    const predictedSignOutTimeString: string = predictedSignOutDate.format('HH:mm', {
        trim: false,
    });
    td.innerHTML = `<h6> ${predictedSignOutTimeString} </h6>`;
    td.innerHTML += `<div> 預計 ${predictedSignOutDate.fromNow()} </div>`;

    // 定時更新內容
    setTimeout(() => {
        log('更新預設當日下班內容');
        updateTodayAttendanceContent(td, attendanceDates);
    }, 60 * 1000);
};

const updatePastDayAttendanceContent = (td: HTMLTableCellElement, attendanceDate: AttendanceDates): void => {
    const signInTimeString: string = attendanceDate.signInDate.format('HH:mm', {
        trim: false,
    });
    const signOutTimeString: string = attendanceDate.signOutDate.format('HH:mm', {
        trim: false,
    });

    // 國定假日或請假
    if (signOutTimeString === '00:00' && signInTimeString === '00:00') {
        td.innerHTML = '';
        return;
    }

    const remainMinutes: number = getRemainMinutes(attendanceDate);
    // 顯示超過或不足的分鐘數
    td.innerHTML += ` <span style="letter-spacing:1px; font-weight:bold; color: ${
        remainMinutes >= 0 ? 'green' : 'red'
    }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
};

const updateAttendanceContent = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, attendanceDates: AttendanceDates[]) => {
    for (let i = 0; i < attendanceDates.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const td: HTMLTableCellElement = tr.getElementsByTagName('td').item(2);
        if (i === 0) {
            updateTodayAttendanceContent(td, attendanceDates);
        } else {
            updatePastDayAttendanceContent(td, attendanceDates[i]);
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

const log = (message: string): void => {
    console.log(`${moment().toLocaleString()}:${message}`);
};

const getUpdateLogs = (): string[] => {
    return [
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
    copyRightDiv.innerText = `ⓘ Kenny design © V${PackageJson['wrep-version']}`;
    copyRightDiv.style.textAlign = 'right';
    copyRightDiv.title = getUpdateLogs().slice(0, 5).join('\n');
    body.append(copyRightDiv);
};

const main = (): void => {
    // 出缺勤表格
    waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then((table: HTMLTableElement) => {
        if (table.innerText.includes('預計') === true) {
            return;
        }
        log('出缺勤表格已經載入');
        const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
        const attendanceDates: AttendanceDates[] = getAttendanceDatesByTrs(trs);
        updateAttendanceContent(trs, attendanceDates);
        showSignInNotification(attendanceDates);
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
    setInterval(() => {
        main();
    }, 5 * 1000);
})();
