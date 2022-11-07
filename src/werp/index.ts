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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt163_input=2022%2F10%2F26&j_idt168_input=2022%2F11%2F25&j_idt176_focus=&j_idt176_input=&j_idt180_focus=&j_idt180_input=&j_idt189_focus=&j_idt189_input=0&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt212%3Afilter=&aply-data-tb%3Aj_idt216%3Afilter=&aply-data-tb%3Aj_idt218%3Afilter=&aply-data-tb%3Aj_idt220%3Afilter=&aply-data-tb%3Aj_idt222%3Afilter=&aply-data-tb%3Aj_idt224%3Afilter=&aply-data-tb%3Aj_idt229_focus=&aply-data-tb%3Aj_idt229_input=&aply-data-tb%3Aj_idt233%3Afilter=&aply-data-tb%3Aj_idt236_focus=&aply-data-tb%3Aj_idt236_input=&aply-data-tb%3Aj_idt241_focus=&aply-data-tb%3Aj_idt241_input=&aply-data-tb%3Aj_idt246_focus=&aply-data-tb%3Aj_idt246_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt690%3Adlg-leave-aply-vac-table%3Aj_idt694%3Afilter=&j_idt690%3Adlg-leave-aply-vac-table_selection=&j_idt690%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt747=&j_idt752%3Aj_idt762=&javax.faces.ViewState=UimpHmPpiRBU2HiGlV0NYCSJx4EWBl4vJOSvIvQBGG%2BeK2r3wdztlhQ05ThaUAl%2Ftl2J3P3zeFsbBaj5N6i2DQDrSJfvo5AiYsp5x9oRGQ3Qt33YNi9RGeHT5VFa0zddmuMeAzS%2B0L4QQS8eg0%2FEtNsdRBXs%2Bc%2BAr2bbhiUY8aZyYQ1uP3UQhbC2hDXe8tZmDjtPVq%2Br5hfWOEWh%2Fz%2FuVpNWLgYrG85xvRx9tDHjMjAA7p9Bpj80%2BeHy7jTGWfHIX%2F8vdbS0%2FR4Qm2LgszRV0sOEsFx3S0Q5akMlNjhhEbvSoVWezucVlWH9WYRXXijtVKxID3usTDriziJ7B0TIsD7O3G0zAyDclO0O92fW9huh3L27jvv7r09K0B0nE3ldNM3bA2FFuH4BKxcXGFZ9EfGfJskghSBAiX7ZFN%2Fj8ODdLWAjr5gVzp3Zx2JT49HS9rrr44qZNH0h8WZ%2F5do0xLfTgjWhKloPGjaSLnQbMQcbHqA9jIxXTNvjNa5hnDGXcCSHEFYpiaG1%2Fl0iqUQFU94ga4EQvqWZYsmgM%2BcBiLUIVO3Kg8Q1fgVdiSMUj4dQGePRxzoAXJ2kn0zg8dypQFavUTWrl0dHqctJdJ3hiIr0XVokvXA%2FgANXAARvK8ImbbHghPqrFwlZ2lkZX%2FcAYnzWuExjhi321ZASr0iY8JZjLkJigpACl8E0KqarjYAyzoENc%2F%2BEbF%2BnFx4xAg7OMZGr6Aq%2FIrxse9qTpwNturt5ZBns3qWVuHvWSZj%2Fqb91BPMd3a7%2FVISONYXIIP%2B73AQHpuPcQE5sVDiwxs3kftQEysKKAUCoU7afBadly3FRN56kHuc4Ms0pGbEzWKgx6VOoG7DSMCPVCMIybGjIpwZoul0uDjZpitqPbpoFhFM1njtfBKPxY6O9ApLnMBnT5Z4epcHpoRlAPLnv%2Bjbqm0IL%2FOnsVrVtBYhHhSwYAQ7mUa3n9LUAUcLU8tXhE6YSKd0rQzUB7b08lZ75N%2B7EQXYT2w1xu2cmMhXIGpcUOVPdpMwC1k3lQ6yHyyNwrAfNQRj75W4esgB75L%2BZMdz33v6qUHHcEyhyfys03wEmfxmYbOo%2Fb1pLVnCmE1EDuIVXUYli%2B8%2FVC%2FD7s5ip%2F9euiufB6ahP3WnyyD03awmQXmtBSr6WW5L3Clhk0voVbaC%2BMidw5p1VxEXE3PHmeks9zt9AD1XPPewyjRz7dE4BkCcNwFtS2jU01C8SoQHImDrVbr5xwlSk7Ea3qo%2FGFAOjmtduYHTHEYMscQEEqKD3sT%2BOM4pBfoBX%2BynQzlelMDkuxygC7k0J%2F7DzZbR5Y95G3T3Bgbo57xysBov9Dng%2FJfN9lKMvk33uQkSjOcRYJ1e0DJz18E%2FRDaKEGlD%2BIZRAVPmyOEssL2WTyxQ9bp3p73iuDxjZNZ6l3fzIk19qkbjLtrxBMmQY%2FaZJSBnIlladOphmvUGz1E435UHwzoXyYWajpnd46Lj7FyBy5%2FSDm5P72vdBr%2FhZDSO59qIXAzp6UtrFDdJLXMbgEZGc%2Br5Kp%2Fv1yuAnJqF%2F8ZujceYl%2FhamoJobaKtSmSmlB3GFF30JdWQ68RFhD2wBJED91P720A7ZfrRDVti%2BEg5R%2BIwQdz4e94AjBPg%2F1%2BA84RY3bYU2Q7pfpg0XhwCa1MtwGxPtDAjfPUVaw2U21OxPzKvc%2FJJUFi4Mm4LuNemdkL11kVhC4liNgHxtuq8zOqTxmyP4VUaJZMOtelaYgmAbIGW%2Fp9h%2FURr84k0rTJ%2B%2BS2LWGmUbzuAWKTP9HFKjbAj2sfgKKuxP6%2Brzlz3KZTYwXvQpUTMaPMmlljZGM1pG8v04Qu8BmA4GtvjG%2Bsoe9ecxMsjDBeYiQaMpzopGGUOONWbpK2Ecy2RMzBahxhSyJfFKCkE5KBt0g88SwEmBdRUndnpHmKvmqfYTOMSzn8wh9%2BYHrRDEY37%2FIoijh3t1C%2BKbFC3r4QViFcQnaNeYintXrqcxthHBH4eNp7Pye2ZqmBnfoYbmKyh6QIvyWq9HUe%2BiJxRcaJc5qG%2BX6WVk1qZUpi6zYHmf1kUor6FI2zgb%2BIoUhw0wZ0icQC8m2z6JzBsFuIwLbXQrgeDUkfFz5IPcJvMyefxPVTkqO0DmiEVOYQdSEecAr4vUyNI%2B2l3BHs1kSfwQjwOdCU2TT%2BcpZKUs6m5GCO1GHieeD6cQEpWMmBxJ698MdLrBynd1s7YH5w%2Bm6aSIpYR2pHCM837cfL861SNGotbFXD5T95qzC83NzAZesR%2FlPS7kg%2BGc5U7wS1Ap1GgFeAUEH%2FcMNuYfPSu4QZoQE89aXwjL2l3ZPmfKH7%2FoyMbRbhLQwdemq%2FyqN2XC5gLJe3B6ra4fsHKZ%2FFEwhZz3Msf99dQRAy5Sbeq%2BiQWao79z6AeGtioS5by2C9m%2Fs8Zkxkjg57A22AyT6NNli3o%2FcKO4DDFF6IowifPyB%2BxGIx3isXE4xijULYwCj4sw4mc65MvJEQzwE9S%2BFhE6MpO2SP5da2rYc3CI4SqLL9DMlQ3b%2B9%2BaFNdj764mo2ScYT%2BAWQwegn%2FkvoHTgSla0i3JOqPflzDjgUJ61kWEL3cQsDp66nP6kO4OHhG9ilEAVNNWtKCzSlRy9iIIRQ5VHd9iGD0eM%2Ff%2Bm5PD5WtkqhcSJhSgCt9xIeHm%2BoIHEk7upGvcqrc00MyU5aZSftUpCqJJWDXzCciW8M7zxFfrkyPyIvqaBjqMvfFGAdaLPXHtZBYxKB6U6uOAkr47B4UR18V%2Bs5GblI4QFsghd9tZnFUmTHF8XsFl%2F2QjRE0SCln1Am7%2BCjOETKfxW6qAeS10YqagCDJLc1EZ1Bm1uXlJ7CcBazTsGtOCoiSRpuRczZMxJXZiXa25KSh%2F9c%2FgQQKyP2fnHLigM9nrWPNDWjFNgzKZGgvDrsWDF%2BKKdsoKCBEiWqf33vfzI92t1cIGyKHcaEMAA7h2J1ibXCkC1eml%2Bsk9V%2FEvN%2BH%2BToVD91pLLU2M21DuyUd5OEMkkrp6Ms%2FOZ4rENfT9dEv%2FrzYcve5y7r2%2FFXvqnvxQNUD1CZPgYK4saoOmjt%2BP4mLbTCR3bPy%2B%2FOmZneJB13yJsKnd9v%2B2ndS9k%2B77pKD8BpyGXEI4XP50j4BD4bDDpF9EgT%2F8YSZ4UPjV5v5i16w%2Fydjs4g1WJuFttFZHMaadmBGE3%2B2FPFjzrS2i3vmdlltpdGVDgKmfNv7ORevz%2FOIMnYPXkf%2B0fj8JRA0wMSIHzclSJMHdbFbCzQtGsAila0428qa3NLzV0m6GYAIgXxsOI%2FlVSiE4PgoNcU1jVlPbBEZruE62lLwitoSY3JtzrpA7pFGfK%2FanjLmEq%2Fdfx%2FK9i2r%2BUNmFldWeIedDOrRlVthTBad0ouPbiimpQPF%2BE9DjCfh9e4ukE9EU3mW1Ye270Zi9oFxCc%2B8TEfdA%2F5HUdZPkcNPtfOp3QJwgH%2BTb%2FAE%2FkFvLLnNzbELbID9l5HpBIHMsFPdFISzT5e%2FKeX6jAocIKY9ujSP3wr8mf7CasRQPbqmrpFPlZ9uhmQGRx3n6AvpdmDXRCxGWU9qYazu8Ybyym9u28nUMxF11WOl0oN4jRYg6yL8HCK0Y%2Fm5%2FefEE8gz8If2VnDBDxtPVPCbG%2Bv26Ow58Yskj4weTzu9C4pT0PHzttvSEbwKm%2FHlzEhA3uLrvOCIaRfxDPwoSWZCi6pO8%2FR16z30PRwZjdgEOtbInJzuJz8PxFmeZnX55uk972rw5%2F%2FUaY9UCBZl5b4JRzo%2Ff5pHVIPZzJFE59fGX1aZ9OQMN3ErX2Ov7z41SDdt7KikNqFEF9BIwwczrNPUzvl%2F8rxJr54sNE7opt%2BYNN%2FsFSP165c3AU3a%2FNRwPMVfdcO67DammStZbL3PwNXOqHoGQYMRHH4%2FQX2g0RZwcBdH0zijslAWjTQ%2Flv1hyOMz7xeFfn1V6spOTfQlCquQLt99xUVCvobRr2HcJl8ECqO6Y5yWPO9GckfzP2aVwUnesd5jK10gd3ySwZLmuzRRkFaeACiGvjF2hSqQxPJ18Ln3kVTihuRTfmZYZ70%2BUDjrygYW7FiJ7PG01zJr0uzhLdiwNfsvO476%2FOFlb%2FPZCtZoVr6kz1xGUQ09qpOy0rfovoFlRY1%2FoeN4m1%2Bx8jYIB8gOr1a89ar994%2FN7l%2F8JEHUKLRhnHxFKRKCg5zh5V1l8p64xYKMXufkpB6BlDMuL%2Fd%2BAOW8uk7wPXJmmzpjCuwH2kMq1uwnkRsCrnVx%2BWLC3S4Gqaz0VlBd6QxFLDOkA6MpfsAgkOpcYybxzxIP%2FOLC3HdP1e1PAbJQAOdAgvKoA%2BNpwtDq%2Fy2TZFbDpjQn24wnf3biCjitI53MvM%2FfOmtiTROsMRtMrCp9hNbzdrO6QapZKANQKjKSz4me%2BkU01GY8DEPrLyup8u84EzC%2FhbrR17SnexmJdc4EsKDptSiDBqyD%2FLY9fD39iHPORsLc82JB%2B4dOR%2B64wPMTRMAcnz5fLPScu9POnPY3caY9McYRMfKgI9ZSLB6%2BdqXSOTicez%2BcVHfp16NpFagzzwZnQSYr7UiWkDDnNnK5aAZ%2BE6JsgZP3uMDzBQaDUKs4e39ZrT%2Fx1cA7Q%2FD2Q7qK9Omof0TFw%2BHPqhZRJX2TvyaScL6WHuzFIndN0GFGoJ%2BEeoClxv033yxp1zWqF4JsMtWtfTPvLMuWCKXzLImjIRbuYV7NXOTE9Inf5L0iB7kjlFJZOGFM5tmT7xDZjfs%2FBqJQYkno1JlNj3gcwURuW8anGMpmHGyEr%2F5sLInQ%2BWTpeytXezS95GVzTJ%2BQ7Z%2FKACgHNyBs4uT3dT8tsaWnA9frSXlzU3JmtczF7zPzyqvkV0tuDmKbdIxPnuGfbazxoWZw9Qe84fE%2FK7Z8GJnIueo9cqg7sQPLG2YEnX4ZMW4Vca0AyRVjM3fdYgbTS283VYHQiAXvxBar3lc584sRUFiYBU7VGffsizEtSm8kz40A6Q%2Bn%2BQRgS5viY4jV2vmHSwfaMVdTxRakKAgmLoCkZrv91fDSKL%2BuHacCLMThiW%2FRgfggxuZfpkIAGREegpUUeuLM27OydmVUnkDuCMMG5cyDKl3FQmqZrMM00bGD%2FaqSeZuPuLp7UVIaNQXeK4HRk3%2FW0by3HZ0WLGxwU%2Bo8%2FS5lpNtTcNJqoLbsRbi%2FmsqiwbfA%2FzLlcYXYVsjCioCSKF2ve88j75TD6xhOoLiN2r9OMWfVCnaQAxNt4p7Mgvn0HYnRRscBJjRZ8OeeHaGmDTUC%2F6Xz3J3E3kOoUHis19vurT4w%2Fp9%2BTih9RDyjR5Zafxzvhs4H1PauF2IPjXQ6jm7qi3AixvjPGKQA6jyRpzceFVr65ilaLOTZxYpX%2Fnjn2tNnSSXiUcqSvabVY%2FZbs2PDaRTdZFHzuyOIP1YPOErdA65LCD5DqhPqVj5zDWts4xcHCWKLmUE%2BS10%2BByzzRIWQw3xKsEYWpXwX7%2BIkzriGtBGYmf9%2F0K1phG3uNMSQG8VkQ%2FyizoQTBNzgh7DhhsGnM8xNgwTyVpJQQxBUvXLRjkPcIMg%2B9mY2Mdi4VbufjT7gG7lDDjQGiI8neeNQ%2F4tVd%2B%2F9Vife764nQlKvvsNUwrZm6ESAYy2Ge0WJXI%2Bj3rDr3PNiSxRLwULJ7h1FvVzsFcJFXSJbujrl3X7kFrZDgAgUzsSygAZ4eJct6ZMZIsMDlBTJCB9u8eGF6kRvU9t5iPKKfZJfZo2cm04EKCcwL4F8ZFzxpKVUrAbQycMn6swH0KKr9ND9gDBmlAxeLJi4H%2B1jC3Rl8I12tsH4g%2B6C6Ud1YRdy5tmQY8IcCJl7xj0o%2FgvsVAFfB2EeWwqH%2BdoIvEmIqMOv0%2BgfCGbAAwH4AHQzH1AfKi7nTK9wsbYwcZ5nrdEpiqZjfe07Yntz4KjQbeEGSfPij%2B%2FtjMq2bM4Xcm5fDNjV4cSbzcV44G5AuItvWL52C%2F024GIj2%2FTaAgJN6%2F773i5GgcDk440GWPtWctX3cCr58lI%2Bk12wo4HHWDgEiHKfiA8OAFO%2BQF66oViOj73FBfeWprAd1AbcQV0JyT46B1WT1Z%2BqZP223exkXMRDb3EV%2BfUBYq%2B2qOQKE1T%2Fzd3xkPiI4JSOH%2BUMz1FDl4yYSx77ZMofB2tLGdNXJROZMuJwOJysu6okb4qn%2F9j7x1rSfEAYvHv4cq7g7w2phY%2BaVDuzxA2nyHNgL%2BxGpiaeEzFMZUolPp3LcfwX3RwiPWzL986fSxmrt%2F2vrZTuYOSnn%2FLrj3q%2BILc1oGsUEU68JJKlKiCeqH7eSqCGOktZ%2FLZ5B5iQOizn5bvRDxnWabyS7s%2Bu1B3hWXbmBf7%2FvyBXN3AwsFiOSrPVMrJvwM0BZ63qtCfNhE6zFwKYEzOinNhoivrdbpgBA%2Fb5Rgs9kDvu2qocEjKI6nd0S4AW6IcqcINM5q%2FsH%2FLXTZAZZjILC7ZiZeKhviBIUUdyg0EPmnPoJ9AyYCJFljkMIcozFMQkWdnDFlgFOCGTAXWpW7CQWaLxUrU0GsmTjFCezmhQj9vbIVoTEu7QROWrvcZL5zAniCEJNo1dCKyJY9T0zOqIX7cogmJaSYfY5t0FJao%2BmcQ63KqLjJfW6o%2Bu%2F5yj0VQ2jEv7R2sul3806guDoxEEbrLxOSEztFrmsVfB0nyt1JNS8Awyj4X3D3qVg%2BEW8CUavtpozdvBvxqcgBB%2BRP1PvYpRGSjwtlBzTgyeAiApIiofI9WcVBqCpS3eOnXGDgugaLYxj3i6ENnAWzVO6e3Q3pWVdMy%2F4CR%2BQYaFvkjDMITpxhexRJYjKQ%2BeJYTM%2BlC2II%2FxWnJ3xYzKPRB2tObY%2FMz5mNWAXeiN5niDCDHBogafdIeginXm6CWkKHfqQM96m%2FwDCW%2BT0Za6ZhFb4WbJw9ssiT4iHWgWa1VDJVVu%2FPXZbs5nMBtoboEBX5Zgemc7zLdpecOYsDmD9cRThgZ22PWYXLwvN64MkCeLo7V09wz2TyqOt4eo8aWga4Tx54U5O2A5pTQDz7a8lhrbyw9%2Flp7Bc%2Booejk8WseHb8eNSK6aM3D1zq4bbdbwVLdFs9d6IsHpJgLs%2BjAusHdzoByh4KdwbadziZq%2FXIAG9hOw7tHW%2B78cExa72nhmt%2BmsDhqodTovJVZLhWSdYXNofwI4gBK3Tb6CA%2Bw4mQIxBBV4M60dq3lEO6ni6dlNwBTUmTP2ehJitxF4upwIKnueQXdwIlIC7SUODNOQPOgVVvtRBpBPWy0uy%2BffilBes%2FwF%2B7YyLlY2MUNsskrzqOiVhBpnx4zc2fISMXepxF%2B2dyykk9a%2BbBu8CE%2BZldNRPS9Z5bXfM68DYDVGToIs4vPVKjNXyvQ4h1FnsphMJPkMEQgZhe5dCTCZZLC0bHr5nT60809Wgfcd59rUFpdW9HTtQufvejlJ2SIfJ7TmaAQSGkqeWpslkPZZP%2FnU9484pjjmHZrJH4KD8WNBWtiaFTmJI1YHGTE3%2FUZGUUPA2qvW34pUamRqduhLiIbXo%2BQl8EG2GPIMx1U2RZHUQpb306AxiAPP8RnlXigHdlGlqxjgTBf5AmXTyxHkcpLPK5%2Fb2rVfACU%2FGMF11xOb4BW%2Bwl6BeszF6F5ykkhG0%2BwYXbJd1B6XRgXf0PK9%2FGRKKI7jwOa2LzNikNAz1C%2BE75ydgkDrmKYNJXrJjRYcMgRDD77AkiYhzu%2Bl9dDSEd1Cx9brKGAO6Xd%2BWLrcPsFDZqmboeEC%2FTCKC570TjLa8f%2FjxhCOLZQbZ5nJ4cIKeVxqPd2HLTmcJ1doawgsF4glPtP8EIKvS29fD%2FG6NajfOQ68DtS%2F0ovEPp31hTVS%2FVQ%2FeYEriIN4S19eO5VvzmUXbEvOGzFRJFpLR7xFl8sFpsfAD2GY5Q6448j5Kmr4ipF9Z7QwjcsFSnrKy%2F%2FqzlRdaonha8RJnhyOEeXSQr1TlQUvRDRCPc0jFHU7%2BIb54E823%2BGWugWwLeh3UIFZsLP7B5jgsAMQz6RT4SXMjEV8SaE04xYwzhSOnYc7Yx1GF0zL%2FSC3Dkzr4K4M6UPHXXeKNu3dC09VSp7UdS%2Bt1ZEusGcSWpxysQPYA9QG8elPCzsvg0Sxcz0wpvmHnfYTtRxyAdldruFloiV5bm%2FTeEk%2BSfoaz7YBmZ1Poag3Ngg%2FuCbHlnK02LCo8j4ZIEUVq98uox63Ha3LpoNiT8att73MYjzfk0ddy4Cji0WqAgTbJjk79gudSFSZbgRUivs9D53m8D877N8CtIsYnXHxDBKttc4nfXsO%2Bl4tmfif82EhlXC9oPr9HBWrkXRNiAyTrMohg7s4fHY%2BM9aRs',
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
        faviconBadge.badge = predictedSignOutDate.fromNow().match(/(\d+)\s.+/)[1] + 'H';
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
        // 初始化 FAVICON BADGE
        insertFaviconHTML(`<favicon-badge src="" />`);
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
