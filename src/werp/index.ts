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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=pAjN8TrvVk3MlUtiJUxVLG%2BtlKRl24pdo7nFFfQtK92ae3dO8T00mdSb%2FvdrFkjabqEKjwk5Raj8TBv8FVs7mFQh9ugi3sHO4IRA4hstG6CWgn40kWQtYJnFI1HxC3UoxrwqRutRX9IWTesZSbq3FGVF3lbQys4uLHQ%2BuE12kz6BKGws%2BMneKrOpWoDhnDMkCknPTVe%2FLkyxacw39eVI9k4TwuUUFJw7IYEgBB1NayyPEbm8ZLbyzU34%2FHAVggBmJWCwhpVedhk%2Bv%2Bs%2FdVGns7ew34KgbRrCukicfd3m7nNTtHf6qhOQiPYfwYEU%2BQnbYvGqjqGSmAkBy2CMwC4I6Daov0yBHAigco0ZNCOUm0gFU0TF7rPl%2FXINgQwhZCK1QWlCS2hQdrHTWxlNx8ho0kMFUUdlAcBjdaEwMhIlPZ2ZDaStzjNtDGFGDFPP8xkzJlFM5n4F6CuB%2FVJQHQL1POgobUdbBYbwajcansuadUOFzeq6QSwVskOvOACXztySVJPrmZYaIRNFWO2E%2FFtOZAL8VbVCHZt2U%2BniGWNv0hKei6tDHjdC0O9tLzDpN8KIYw6vSK0xwHkAIv1mjt%2FKnNrqKE9qlWVYrsA60NvgQiJgVtdlHIQu5mu0aLm%2FYY2u4n8ZCLKXwvJ2LRRgPEQ1WRXplBJ71cxSybhDnx0%2F17U5BwAv54RtQPBTZyigtttinXmjbbQ7C4EfM49btXHHY0vxa4EmiqmVMAvUkjO9LS9qXCTp3DDzyDDsdeZioACj7BORxOTafu9NNeWoUUjIIZ%2BnrCu6VlqkreWmN%2ByUXdRGnPfBB2h%2Bg8Rho4ts7HHaLqVtTjw8%2BgaSkfpGgmMPUstN5DUj1Ny6ki2Bv2i%2FXR%2FkEtZ7T4a8eZ7vI8fqjDRnvcklvTIyIL5W7xdYYqK%2B1szQ%2FzyV3qGcAOd6F3rkdex4bsHnMPY6CCoDW0Z7zIywRkI8Ba62XopeGLzrT9Gak3NrscIA6EImxF3opL5f%2FIovbmHNxihEIAYaY3kl8ElA%2BgayFgto28bgekAS%2BZwdYFhP0lWXJmrzoc7bAospoal9nG3U0CMBsj7uw3JehSjmnIW9vr%2BfMLJ0SfmGEE2OMtHFZEUhUAnkKm0wRRImMcnjqmr1QlvAPN8H%2BW2s5dRLZj4nDQrykIfaQBUT%2F1JxZzVUFb0SHGRCClWtBQcAHeuz6OTLHlsFcapyFWB0iEWxLQ3c%2Bx5A7EQ6ZK4Qqd0PM49r2iy7Rb8IgX%2B2D9sy7ItBUEr5PlaYjqUsE%2BufKUvYIAZpuMUSdqOZOmU%2F9XVNwhu5uk2veiP0oOWRN7FeiCjcKFuuwiMP7CIeEwQmfq%2FFWuhYOfDMarYaEJhfeB6v8eDgUYg3dFp5oPKe3r42DF06VD9DJ0c18MRPN4bjbfAd9ue8bv%2FlJN3%2B7OfIYVNRqUFHbjw74ouQRSLbnuG7kB4BU8TGsJSq3V0dNmS52dLEdk4ALaoGwoJxRK6JQCK1RFuhjOda%2FhDeY18XZ8%2FWcaXZi9uxDkSGWui0INtzaYXadOiAkTy3SWJ%2FB35SEpNTm9fZZf4CCIPofpp6LO7T9wLP6g2xLllowMyECB3qpBSdAkkavH7dZTnoSFhRbzRczgw7VjkliKG%2BtJPoKIY%2F7EbPSmkQ9OkCrqNpw0xgP1Dahqs7VLommUdwqGoCSx2chCgEFsuCXtYk6Xr1yHGSeXE7OjbCyxLW8W7fPDSpHwUgZuyrzUy67CaizkNxln7wFaZMsaLelaXNrvumL%2Bky%2FMua%2BtqIXNLkrlRw3nXjxera5NkfkxQokvfdPbliwZFj9qSYFEGduZHdESRiH3Q8IrP0WC9Cmb4LjIiljB8JnUm3DlAvnxwXZOzLI4j9oXv7pLNhDO50uxfJLx0dCa6661XfkH5i%2FqMcPu0GGewXBGno3iZLVYr%2BpqHjcbeR9ZyEBVld2eJ54lXHwMDUYtkF6DWdF5nNfGxCfPWwcLfSFvvkut5KO8O2nu%2FZ%2F%2BJ4VFEX6l2t1QOyvvq4lsVHYk3xydugpwxPnDFh6VhXKRLIJopItWhsAkdV5cijFRn4fARD9n413YKoc0D4RpfssjC6cKby35c3abd1UUmRvOXbCFS4OEc8%2FGVJRGLVUURMI7Vo2CNoxyx0lZrHnCJcDvwSCAd1dwpYydCOAY%2BjqkasPh1e9fqW8%2FdcPlgLJPWwDpflQB1DFNRNnWq%2B5UVDdq8blc2DIkFv%2FAKrqgMz0tvctKO3KoNu16ApeMyL3y4yX1%2B11f7%2FCClai39z7Bfa1PtptfUH2wBJaQniHCBuo%2BANiS76K5yAdAKZj%2BePHwe76vUWXOQOmW5R70I1BvnjyPKsi6CdTt1oqFhsyumeFwszGRy1jyjzzGzvuLLe3ET4xQkTk7xdbLImQkjx94swrRu%2Bfv6Kkf1bGuoZw0JIddqZYnPnCG5%2FuCXcfgXiBnCuNwy9PSBcAzeidOpiZweGltz%2Fw2sIcw1r%2BW9xVRAD7q%2FgcckJ%2B1XfxhIaon0%2FMU6Acjy9hUADxsy4Sz4VG20stAzfvFBbXo%2FDPXQO0lBr7PuqPKRT0KA75HixQhdya%2Bb%2Bpl0fMVm9TgJoyUZMSeMwayTu5yHlD%2FRnotqoau6hOoWUyHG2f1ECcF5WEOXEbElW5g7g8pj6lVfMtWRJa0Ys%2FngzNIF8WHCdXv5FNWgfSM7Nq%2FCgGTBuQKfeKM7caN%2Bq7z0ADnwIogbkwbG2UJVubtAK4Gg3EjZciuWLE89cEfv1pFc1x1vH9rCUM7%2Fls15BxuPhcD0mj%2Fq0%2FUtFw%2BhYdAJfxTLNyUHw8WhGhDA3OtBMiLt9rgU%2Fbc5SyXxfpMPBdRsJAkqUF7bEJnSbdNJZMj9g4mXDQNI1Y8upfcvgW%2Fy3eMwUPva6R4jWQMgdevGKz33weYNWAfWd4Ucmy%2FzTCY2Np0EC02dSvE0%2FSaU%2BpKUk%2B5AAMd4Wxlyi66yRzppO44LeTBEK5qwSvNOgb9nGC5EcRj6efzkUA57aJADec7CtJo2SponeKPdfn%2BQm4TlPAYFxhAhEq3%2BVqUSOYPea40NWbfKDYuva7C8pqucsJ8obUsH9AanLW1qmLJicKw2yhSaWMpJxXU0TgnkIfysrTz5Okoc14bljvvh2P74A9K8er9IJ1thQEGfglfTsDugxTn%2BNTS9TgPm3t5xoDRfqJwQRYSpmah1nVoZjTR%2FPTVmJuI%2FpJBpGVGIQT27%2BwRE3Yz%2BvN4YeXaBqGFkyd7BeC0iwxI2sEkfOzVuBjFC%2FkbzO8bZKDQAw8cJpa5hJM0wYFEtE8FIc4Tb8QaTTGiNUkDhk5OeL2plwnnlLDI8nuPR7%2BvMGWurLDw4B5IrpgJD%2F69wgJ%2FQaKkD1n2n9gmqwNf1KLHqmBGNdcdsS%2FTxbEfAnBw2CKVRTCtsbizDsGTgKR9HfN0ZmYB9sbg1qVwhqmkvp8b7eVeppGpDtpxfQPtXMTxVEJbmEtCXDaq8NgDN2I6mTUVvB%2BCoBFrfhMrlT7wXVroh6%2BZf8uoyt0G4KMdUYBLUjF6fDOg4Y%2FCgrE%2FTt22vaeET7XHsGt4JF7NuBkCXD%2BvpisyTgJ00LV2o2d5YsuvnxqHcl1cLLmKcFozwrzsdiu%2Fg3XddF2n3oXWfUy7ePkXI1WGhc78CwnHXy5na%2FoADjBSn7sMDHfkBAJ4c8K7u0azT3%2BVV602x%2Bma9Ir6UnW54WrV0e7T1EaE85e1Yb1kNIQEPE6HC04I7XR76DWNSc7vcbbHBVUJJJkmuE%2BvwRPGt9HRlgKKEWOgQdQSZV3RY1438usqAlfCAmvggoHu1ojrNdSQZmLNQXhc6sfvDpHtGiRlnPkKMHkd%2BmspRYQokqejpLx7B4nIcSu1PzcuqeuSYRScNpULjHaaycm0OpEAISii6%2BkoXj79JR6ZxHfZOluFgqvkQk72Q86PHkLLbcal8yHCO7j27xRTbs1k%2FNvqHXLV6D7NU2vuAnHC537zKFsZpchVrMUIhmrUj4XdWKtyP6oIBAKP2y9o5iChJy4Oz%2BvIPs9kef%2FwUpgO1e5bB2LVCnwuUQMzAXtlYthLcH%2BNpxAxctq5VgULExZMYt8K1keOcPgUcCf7B%2FgDL1jMjh5yXyjeTTyojYyFniMRz9%2BctG1DzEgsM5P7JS4Et15toh0p74LIyd5JofueTippqnYK%2Bj7JucSmERUxAlMEWKUcqPaw0K7o0R4RS96KZ3hb3Khw7uRQaMg45XsUG%2F9oW2815Gv57%2FCWQvshMo1yRl4tJUpyOFqZBC6yjfiWPcp5wmu8vLNkVL2%2BuTIOAPtxEGNvhXP79AldgJq2ONjULv5wJMpdI%2BZqLhUHzpMPhyHIxfXxN0vrGEb6fgQbf9DLVTKJjas6EkHguTY9g7i53TQOP6IWgoWdiP1RBJQKPzlgPzsReNoGrYlByjQDs2eonwrevnk7j8pHrCTVyoIMc6Wvc52yCgO7lVl5vgdpZYseIDla1h3jidI4fpsTsEUWC%2Fdl1tqI47vuYI7ZxCHNjYel3WVnoARRo%2BhfhLcG5OrvklINS68plp2vHZ%2FukWXCEKeLEEV7ukGqFv7dLc%2BdH383jYVC60J%2FNJd%2FpDVb%2BTA%2Bb%2FYed5x5wZQ1C6tgQMZIn27k%2BA%2FgC6SGTOmHBfA%2FJfYIk2oyCM%2F6348%2FwPgjn3LA0nVXD%2FgmaEToncURXRtuNHrDsXTMX97BFjNSa%2Fa5bWWKVtoxROnXFKnpqh29%2FDEqG6CW11Mj37G7xZ3B8GdibEUeMOBGxjHxKw8V%2Fp5J95IWqFvLkbq%2F8DlpRtR%2FPJEN9cZ%2BcGMfJ%2B4LIPMeSqzwtJ7alakBBv51fTtqVGlM8ClhDfeb2PMC7FteFANJ%2BWv3cdbl3l9EOeGiNOSWWHASTRXBlSWT9TxIHqJvMhPqRa2Q870OS7oLm8MhAEklsi%2B0WlrTLMfE9EfPCa1gdTz%2BsRCgfwdQR0OhzALh%2BUhbsmf5CGv8c2%2FaXn73XkL%2Fr0OAVoTaURztPdZA5VkDjf74tvZTdbSJ6RO471qZtNGMkBM4h2VIph0cfvZ7JVhZqy98%2BX%2Bs1SGYlJJ170eDebtuA0O0DPj%2Bnfhv2nwlQu%2B5npTgChI35QoQk%2FRb0KkhOZ7M8Zmg6SKpt8tlc90e0f%2B75KWIGmutAQo0GBCPzzkKg8YlbKaIKYl6yxG%2BSkPH66Ty2iqIIngiZQEGyv6tYjKpEpdoWNkOOC7XwL%2F7EgePwcvxGRSSn4HUO%2Bq6ZP%2Btv22jqLEQxXPzDopaRWNJcc1pj3bSQewT85%2B5E2Go1CxDCX5pJaXE0penMaZne4dOvPAfbICfHS6GbQEPh6xYEyvGK%2BhbE9r3lxYnUAzciPjKMrDsvZISsVM6Zv0RHIYS5gvIV%2B8y2ntYFE8Oal7BlHcQYsVZjbANy7alAgYiyP8ZYPV8NQSl4g%2FbswQRthqiwoVtgavYcEVhJLSLnqr9qv5nnpojGGiKlCr761zMEoXsS%2FuRROcT9VxO2hpxCchjYP0XhmGvTEmCIczVaua4tI8MSbeyn4tunlj%2B8%2BnM%2Fkg1e9TIFIAzgxNfy5tmn6bPVG%2FqcGjFPKJra6rOjzXv9Ow4cfioQwWjrGWODJXmOWNubaxo4dvOX87q%2FpDMYhNCn31yq4whBJkcCHycW6eRa1Rx3Zxa1TRd%2BzguMvAV4jzWQLb4Ey55O%2BBPx789JbH0YgbrPff6LwDr1imxDHX%2FZVV8BCqqgPlyArse%2Bc1kKFvDtimjorsUvWG5GoK4v9mGtvgNPEnpdytRTCkdbS3GP4vT%2FJgfPAU%2F7sHquGTGrudg4UzYAFTIY0bJdO6C1X%2FEBUdZUaEZGNUKRvzqw4bjQPfzIb8Pprap6dt0aWw8kaIz02%2FiYe6h6ousBxZG7f80BGKv6aAUZgGaiujCg2CgYQpQTuarJ4sqgRUxzBxDxpVR%2FAv%2BlDsNGiWnRXGbnFhRNltbvFQOmH07wpwVVd8OeWm5%2FJIozjTkBWMAImR3MbBdVzUZYU%2BhjQvn%2FTuPIOD5CtP9jNRog%2BKfM52N8WusT5yTWjshcjMdv9nUj2lPLXF8pWE%2FRW3UvIHmPm1GSovutPrbkVGTP0V%2BsqBDOglXaRmilEEiXy5zr7%2FQFFx7p%2F%2FHp5UVyNs8Y%2FKxzG41WCI6s1wAyVmM03CG7b%2BvgrcoQKMUA2fGbrvdk20j7zNht7uoXHFCGsLQkBa9NbN%2B%2BgCdxrhyPqthF3zXPfykY%2FsktHDF39vuR7jynOOFUd6qTXXCiPf8h0iQudoajXpw3f7TvmnSXcmKNS7rpwwaO5IDZ%2B3fpNUHTyfk6B9G1ONABE54a1q2TSvcoQ7PQm1JcdUhRVuFE3RgqjG6PDbTvhT%2FHjvgzce9oGGolOhJ9N3fArZAemNIFgVDaEzqZT3Q7HZRqEaHr9C1dSCmjgx5tHsZOG1SrlRi69LU1gGqLultSJbkxJmXCR7jSN5be5TvFeN4v%2FberASkq8FSUSkp3DQ7bVLyiiliOYwIWW9rRNbvjSeXJfmWEcKU5bJ0zqHQZMk7XXvNLPxhFlpfh%2FO0%2FnKW1B2aBkeCPKPrjwmNoH3HpOwmpMezb3TW%2FOK8IAJ%2BtAZ%2BM%2F83b0By5Un2SnwARaivjwv5aL5LTfMUdl2pElaJbMTO7DIZ2m%2FKHMmy27nUa6VWSBrQ2uGjQqzyeeeFa65Y5KmdMf4%2BW0VkW9ykEdkDjP%2FdiCx%2BZsrfyLvFJ8x859zq2GSDUjbi2kRJGPygd5RNUFp1SeZ1HHUu9wWj%2FoqQGmMDc0gG7a%2BVHN2oXkeLuH%2BxvwY1U%2FhhZm2oZtwuH8T2KbKE%2FwhTO6i1A3PqZV7dP9keFCw8ABfsJYPzzrFLVRwsTKqXY8SpIKAAF0LZYSUV8j2vo8Z4d0Y3A8uqqvDrwcvrHj45ilWuYhXD5%2B8Avf3CqvE2J0YFVZjbxy0aq3AEfsGXfWHi4%2F%2BDnPG4EJJ46SjcESghD2fabVDLkjI185vbQax2Lohj3KdJGKjYfbZAODGL9p0bmO8WXDyMHAr4zIyQHLyZVfi6d2HGK5mw%2B%2FKodSVRDrxMHQH1rlTWpZQQkIu%2Fe8oSro%2FY%2FcU4PX2WnTr8Psac3nmyer1RyHnQePeOGOBsivbLvRvCaU98VfwuQQyA0eZNjTwbq%2BAqqm%2BxaTp8FDV2wGYeMJ8DV%2ByihwfT5a1%2FdqGD4ITmnOj7OYX6ReBcT8zTTW2TWfFxBlp9%2BESS3bAXPzhzdsNPLxRVTVVauFoV9AMIsZLFGOshTlJ1GrkyAPRIhCmPai982s69xvxEooFTkyf37y%2Brn4%2F2e8ZrD0K%2FXSa6q7E%2FwgG2g1eANUADTljyVKrdN2toAWRxOVbQdMaKhZ2TKhA4R5PlIL%2BsgHfKkgnuvMfM3QFfZLzOv7QrbGrxdFjr416lXaAlltgLyA1sIyujPaAOHxoY%2BingBNzR4KlpjkC92A84yBA9ezL6k8Q0uig8F5V9mZv8txcLfv%2BAOJoEBwNr%2Fqdui%2FtONb3SuWr9xu%2FgDc2N%2F2puXIB68nqJj%2Fyo2s589UUwTvHYnJoe1I%2BTrbmCARCROWlYiCQ260ARypxhHGSBJnbrF6%2FsPSNog%2By5XIiSW3FpH6wjsDt%2FM%2FX%2FI50lTCVyO%2BTpaoq%2F6nbNw%2FggnYumjcb1XEtMYr9YD4rrMIDVVe0znnXjbVXOnQ3kLPOo2%2BglYWqFngBzsZkOpiOa%2Fehb2dPhT8Z1d3twbZLgEfB1Jqh3Ug6Wc2gYLf1ITixUNgl8recD6PyJHQW6ZaBhHTHg1f7ZY4GOl5NbklzOtlD9aRnKSJXonH0oj%2BuR%2Fw5Z%2BzZ4QzPYwv%2FfAhhc5%2Bjli9s%2FjH3NH7bZpINVJ7%2BMirLrhmhEJvkEtYnZaSsclv7p72S5U%2FH63%2F7R2LiGwvG6NXMqmYHKoYJsbzQvScofkRjELpMUCS1WBdz4WJT7twKBfOYz8EOJcQRc%2B%2FsM3k%2BReNApURnCdPAaBX%2FEUon8u5gmHCcgRU2ifjEQJ6oR88eSgT32FicoWhU2P5vy4Gx8KwwHbwSrMqyRbE%2BB6Vc4wDtSJKwF87%2FmKyQVRzYBZPF25q1ApAKTd8nP7Nm7mYphwhq4oNfMQaDCjmNSQpOqPmOK%2Fy7RE%2FX4mAR6DWiTxAyEtJWPk8fmTUrAhl2kSuPlQrG58QlZw4S7nCOVf5zbcw%2FbDphHzHGW6MOMuDKNUISQFByhecilBd%2Bs7beBDH%2F4mvcvVeiNKE9ZGz7FZYkFAlTSdUDjWxOzuOYPJFAL7jbymko0aR%2FtvujBcYQSJe%2FzaXCBvoLW31hULZQ1wo9uNdRCco%2BdAridFJcXzUHUBP3C1Z4xFfAcAuKgERLYeKs12w1H%2FlAHCXVAiFoHpttiGvTEtjF35jtTK%2BLQ%3D%3D',
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
                body: `${predictedSignOutLeftMinutes > 0 ? '即將' : ''}符合下班條件`,
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
    if (predictedSignOutLeftMinutes < 0) {
        td.innerHTML += `<div> 符合下班條件 </div>`;
    } else {
        td.innerHTML += `<div> 預計 ${predictedSignOutDate.fromNow()} </div>`;
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
