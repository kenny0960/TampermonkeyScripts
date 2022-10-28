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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=HMXFrQ6E2gokBQG5BacyVUWhGbrEZOy4RQhct2Kgom3I8wa5oB%2BECRleBAL0ysxBmQgmDNLLPQQfS9zylxiXCa%2BhF1NazUBkqEMsSIoIAvRpZMj8%2B68mrT5xQl4pqR9FNbcjEO%2B4yhpUGnuB8VmKTD%2Fa%2BuBZbf3s5oPKaaGteMcdTrH7lHs8xhGBzki4uHF3P3KQhXtnPRpqS6u%2FlkuOskodLUD5ihjDAyEaUcFG%2BYR0K5vY8ydjN8CZS6Kq0FfM5ZYl36zbg9QLMFiOv6SXkajLwwQobcNh%2Fp9wS21Cxo1CIy3j%2Brd%2FHKLAAewygjXMh44NtlmBe612M5IkNcH5fAlukTVZpuHN1NG6V6pWT9Tx%2FxAGNvNMD3Ff7PAs0QSrMKxkLpOybK1QYqOhsz%2FFxVC%2F1gHo6%2FaQNEvHGfQRTXfUA2FvF8Jt%2FwmaIv47NpsvCyC61umHEVLiNLP837dRA%2F3mLEuGtDCdukY34ZFGlED54lxsHVFKLWvHJeHZppqXIgohvr4GD7lDi9DzrPViDfO13z%2BGL1ow2L0VuMZQytWysE%2BPur1tlnN%2BgRWAQFs50%2F4KA0DeZbqAUzEWbB3VO%2F%2BBLzmgwmYymKTF1q0yeVWh23POEtbzzQDujUnNqY5mGcngXYeT82rZTlvCuaJ6rbmtVSMc5oUXS2HWXjz1N2qAxIR3iftuiVsQG270tyqQ3MdsTA%2BZXIY%2BJmGI6NvcDDRK0jWmVB67JdGvvIIN1iY%2FG%2FilPciqeagNXiMjMWRfahb102HG9SmDQbUC4nvcdpYtxQO%2FwqZB%2FL8QSeMD1cyw7Q6nDanisvmJIHVXiuPpL3WFS6Lr948KXLXgmuoniaUu1FB5jruXyJD%2FzpgAXakouBJHmPSRbv4QAit9RkyAoQdg8tn4potHGQMWuzu8nZnsu0Hq3Lv7xfZoOZqyQoDnL2PZzJVlk8I9UgRX%2FtIW9wJOgUfMOEBHeNb42XDSHSVEA8DKV32nwV9rzzMfQrAMCBD%2BFuTzWQGlfPCmCDN%2Faiwgo6NOuLUft%2BuIT8fmqCIEAfwr8L54bv84lQUi94SB77Is2MWEjCF8wkoAtr5yMuFFl5KIzmthN3qJ3THW0UrmtELj78hP1RpcoyxDGKV5UiOciJ29h823d2CBcF5m5aAuFJ0PgJaxtfajk2djbhdqvX%2B3eHIam5N88vXtx6cY%2BRLMx0rYV%2BpSTvDy5DafSrM8LCZPMdFhmWmiqk%2BTxziDjp3Sj%2BYrmQm7LC9BP%2Fji5l0T7x4kiGzMpkk6Gq8nJBIZAa8NMa14Ba0kc%2B1jRNqQBed96tHZOsV4QWVOA1CYQHBjfWyGboo35qthIbtcdzogtW4iAkUiHlPV07AHEIFP2xgm000yiL9FXzzdq%2FFJf7ABB5OE1wFINLOolN5CqrzU96uOq6G90%2Bh%2FeLiLUeNaqKn6KgY9q3CHFsA34SodKmt4FqI0OTGfqXpkgvrMHruTO96RFQjpFW%2BJvk78lDas6iDwazkFtiIUFywHlinq57H8VwclbWEXWx6kWi6ePjrMrX7WgAFqFHoojUee%2Fp2bM69fI7YMZYsP2UyUKZovo%2BIFasFs3Q1%2FB0nOwNLA7PmSUgZmI0GSeAH7q4oNvZQD29CgH%2F4nQf6S4H0jaP2yy5snUuMbsxD%2FUHxYrGpiSOwZzq9a5GVuMMgpEnB9wHufuuCRpbogQNGsH8FbYoiV7UjX79ZvBMgGVy5p5bet2ywFVjQ3luYV38lSGt4osGeu1rlnnQcsH3L46fPHYjKonP%2BW8GcBGnatDUK1W6wvjtFLAUNWB76SR4f24KJtmAOEtwxokaNCa4NMvp%2F1id3kiOLKQw%2BRnZLYABKM1TQYDdrxh%2BiQNs0MAwPY%2FxL2tqoOcW4%2F7yjBnNFsacbzSzEGRiq3jrd%2BsnJpbC%2FX9KxJnQ8VPxP31Bxo9%2Fap8SXcORImsa9C%2FbxsLm1Qejp2xVsC4mDznMk7pqw7sUBsLtDWzWqgxvZWjFNujkeFm8wu1YouN0NwSrM%2B%2FMHKiIKJIJJenY23s9fLZNQ1KbLKAQqqx%2B74OWoRX2MUH%2FfYcJAbz2q8xx0iSeDER12jNp3XqzuJF4BJSH24xOwzRBSuwAWrnjfblm2Ay1C4cCsJm0lPptj%2B5M%2FLlEwxJ%2F1Nblc%2FSC2kBHsZGeEB03iqx5FNwSPO4q%2B2PvFRLKSRqpNwwqeFgmUs0Z9q%2Bo0njibY50ZPL8xkJ3kkR7LUFUVzUk12VmO8CXgP%2B80Xt3qdpnsoWH3uaHYwDDUPpeqjbpRP5fyHGgr0MVL48V7RPpqH9LUdYDoxaHlxwc1GZCpoHBlxKUBLEgDcMkucjWv5Yq4DPDRLyqjwmWlcpWzNIp4h2%2FoRVpDm%2F2FReEoCXOr9JvsawDp71YYnHIX1%2Bb0q%2BCDdyx%2BVTgGxXZv7TlHqrMSziAfmSasi9D0qfqrLaots3ADiF3LnHxXFxsnKuxR%2Fj3%2FQciPjNah4lcC20z9fLV2HzF%2BfEQLyeiXux1SbHdYj9W%2F%2BPEN7lhNfH20QzvbH%2B7GUlx5vkpct4cD9zCVNv5MX8RRD24YQY1NdEq1CKGJ%2BAN2%2F%2Frnno%2Bx2RJsnnLLH2lPpqy9RYLHC7D%2BFqGSREJGDhmTl1FRGutM23JV2YH10H5PTxy3b2TOXwRd7yJrs7ZvjHxN5PJeaDTVNTvtZjVEi6g2r9UkQmRVrlENI5w0HtbhqY6KMstLsFn1mpwgRAO4iXjCePqU5Mc9Fpf1hmjeB11X3u7NGFmxSGAL5YqMyUsjlxIYsxAsdvyaSstixvmSFnbpUlYrEEHuPYhi13OgXDAGUVfq1je49psinwGa5icwa1gMvxz%2FmWwaFjPcJXtkNiiR9qd%2B7UAmkTxukn5h3%2FT2Lm7bORzo11AyIWft5w6mJuSgfbBSxe5CdH%2BpdbX%2BCTJXgnyqZymXYFFwkA%2B%2BKNmeoiuC2zK9kBgEJilPP%2FBrrH1rqXHCRcFxwWsoBUSHFd9nHzHgQkSsz9PrRdbN5Yav2I1kP9a%2FRP7O4%2FppoL%2Fc6WN4N1qWQ%2FwXi%2FI5rnETd27WQb1i8jDJTd%2BqrHO8cZ1WTMwz6crp8v7VfiJXRtjUNzqSZIzgqDhtGLJX1Axp2jYNQdADH1uRjvKDsP9nXikDO3nzPyFsTXcrMUk%2FTbDHP8%2BLGYrEMsbsci%2BWpnHh%2FBKy9%2F2Ms%2Bbpg20bb7KvU2IZjT3jJ9qOEpqaZgeS7JORlsloOZiy9py4CVHC1nwGzLwltBo48H2EBl4tEq6aSr5nv0FMRn2wwsLobUctX71sQfr5kQOCxF5nvx2yYUI1DOJAkfVPtXQnehzw4Ipls0Lk3MgVTztydtBASFPF3NoSmhqCEK%2F6ajZsclSYcU6sTq5o9Psi7C9CXwShRJk27SXyY7Ug%2FHdckhcSzF%2BXea1aORf7TKnTFOuPHmEb%2F4Wg6iijuKeKjKptFGNS1v2b4j0g58u8kCZmY9OxxPJdSC6Jly0dYfcBX3hursVjqT4MJ6DtV2OgulXoFf5OpwUvu8oQoE%2Fxafz37WJyYH2va8HIP0zlWsbet3wAthXwbNiL%2BaPB44e%2BaWQKt%2Bwm26ijrmO75g9WVy3nHHyXPn38YJ21SkHE1%2BKBV8mIwVcvNtZqnCyoOGPhXR9%2BCr%2FiNhwmrx2Go0Cvhle%2Bso6tuAxtTvCrynZwnVAVb6ZB2D9JfK3wpYIW6YZhUPw6%2FbgQJev2baB3we8moiyC%2F0NFlqinMBk44A2gQug%2FzSeG2vJBfAj5PVeqMKnYTmYycyxgvlNrx%2BSk84bGJ4dQjcNpUXgBKyF5CeN6FcbqllkT3HFVoqsvWqgnBkRONpQVZqVU4cVozR4vIl0lhw98lC80ntL4oYwdXNOB4YxVk73Uw%2FtJdJ%2FpFIDTG8PPez8DNTwwU%2BRUBocibzyMt8wk4Q6GrAmdy6UFGMww1Jk6steUzgUg9NWgZWSbmlEg8oDpxEMS2JdgJgakahMvpDHeuBIvYLuOf7Pg7Eh%2FJOUU%2FsAOIoVt3dJe9muOBZRclAdOmM1NgRHMnYrtJStJdEf9%2BifCDo1WrYNHDTmt0fxZ5O8iylM82khas%2FFRYF3K%2BFMrrMrgxaK%2FktNmjacuY2e0XbV8Qr6NUnnrqtgR40hVMNVPqRHJC62H3tVmTLD0hS7KG%2FkyJvuoFnTYhcTnVpr2RL8lUpWCOTvVg8oUAY8YuYUzwaiPcp9zl2SEztGYkFt8E%2F7WHpZQkE86V6nsI2NgZ2JR0zyx4IqZez04gRr1J8BUb%2BbWrtUtAqoC4PcpRUToJRhuFQxvGHcnDwJRnaPgX76do%2FDzDJ2FPGoK0wSuwuObZyrC11MV4j%2FuHe0UKKAm%2FJgmdkLNyeZUAJHpRZnAc8zlPO3C39QVClGQaadSCLvdkZR6wBXIfh9uGRTvxbXkrcLsakCMmUuJ7tJpPfvJ37npBeAdRzI5mE9An0DAbdeHcWgN84fZLumVxhoTG3jwK1Ye%2BKalmCf1PhyScR4n4tddLfDqa8R8GgJo2kbje4NHam4HrfWD80NZZaJBeMZVegh42mQRd7sUcK6nswhC%2F0ea1P8pfrj3qYtb05qSVKDylHmLoTVdUvFPnNUIG0eXu%2FkB%2F%2FsXhCCXYFrtL0sqHQ8HQUQHWrnL6TcKczz4m%2FhJhPGj3%2BuuFkNyFScSLnHTfFIx1Pxxt9D9zTBdKYFSaFuy0ZgksPk%2BUvR6ucbPvZ4v6Fio4K6KciuNPffOJ8bXueOgwY6PtDS5a0zMsUWN4CYZwx0EkCLN9KUJSc0dBdUrB38PvVoTg0IhfvRkuj3xRsXbqT7rFcjpEl8y%2FJ6g9i4nfrUky0Tqm6TBVfk3ok5hVcl9fn6v99Tju93eGOmJEk9Ohm76GQSyjnq7YSZZ6XPr6%2B%2B0MvfHH81y%2BFZTseZlVVlQIQGjzDhEs7%2BuSpE21%2FydgF3y0nBs3yEVYBN8Ltic0F%2FUKp3nPPUL4Bzmi%2FC6GF%2FPkdF3dHrd13wyAFe%2FjsQfBM52jen1WcTPJMVbWT4iIQq1pnvkIt2GaY%2BUSweGr8dCz6VjRqOn44MXKdQR2Uv8HQPCATYMUBoQlzfDy9gUJC98%2BlvbfPKrsURPqhBzjTH7N51l4tIh%2BkfXZPnsR5oc8O%2BpKPMLPi645KS1vHwid3QYh2KTTJIS8R1b40NoEnvtHrlpa6hmqL2TYhQQEu7GXxaCFYG1fSSVqLlm7awrbUHrWxHB6X7ovCONgxN0lDg2KbonPbRoGrpihXtb5XRcX5bn1GV7MUV5JYNSTgip1F1KezOL7WVMQmTKs2Bdv5ckeopyHu4WtDi6EzvsZ3zR5%2FdHeqHwdOsjftRFEEtyDxa1IUnyRr1oNqGtdiBTkm4q9jjhnQCeg97bCEEawbTrr3%2FO%2FrNVEKiis1QsfJtsAepscnoMRMh%2BOOaTP6z2jLNIyrEmaVPXPpnBgHjASGwbTceQEnNfSbkv67P2rcisNDlu65bDD32s%2Bm9pyHHNUJQVSRtnW90ijoTICR%2BZsGtQbsX13b7dvx543Ncan9xZ9Gv67LEyMFvPk5r12iHZdtEGi8W4zLu1TBYE6K53sGLHGsFuoB%2B5uNGZQhm9aPoIdzShZD91vM0ABFmlFISCyZOg5Sx3M6M%2FES3qaYQ2UK1nBuW8kaTjhU3o%2F6i%2F6e094o98FGe%2FoldWwTb9H9CE5dOKq8jBin7Ah%2BzE37hQ0TLuDyDRMB74LxQYGldaBJrdizm5Io3cReTgjPO5O%2Bd3mzWTuh8wi1YJX0FoULJGyX%2Flrn0OJ6pDXgj4N9BUnql5QUiesDwOvGcCqNapLUFcRw2%2FUiOuznInWesCQm4pAH77qH3efK0iOVGsxhUgEd6%2BxL7WyQZNy3hOFw1Xuu%2FieFprtKf1tRlAocXZc2bPIq2TvP%2F3SNmzWQ34XFVNjXR5jNMOiju5QStRKgrKoTfsRGWdQdSis%2FK1jtwZeqo6NTi3gUfT13e8GRyPYA48%2FKlGQW1rpIEW%2FyLBOuyir98jAkGSycNYmvbWUWKIFla%2Fmk9rCNdR1ChIP1cCDtbPZf%2FIHgHY%2B5Ji8SK2adqlFvdE0%2BVu4ho5%2Bt1xx5N0SAZyfMIgXL2quzboLtVb3bMPhkPUTsMKVRu171Z7e%2Fe0scKHpmeToowy7hViie68Al64MacM5xAjtHW12UGV9kvAntP3YSnXN%2FoJarkFdpUiEuS1IUBp6Vpl4vyG5ucDUBIm9xEpfFFzgGTL3FcVS0uf5uKwKLfwU8zoBr5QH26FHClrUflVUAWfkVAnZb5pMTjIQ4XN9nQ9MuF8Jn%2Bjej8Hw%2BjJ%2FSDLpjUT8wg8sgL%2FHw98eTIRdu5DYiT8mQF%2BJdmRZSyf3muDR2PyX2AtdBQC7T2v5Txcdc5CC8M16fKzzVoUFn7%2Fv8vYtIRcpr8s3vE1WRv%2FsyYfJhdWiiNriwYRR4o8WDBSZZD8JA%2BneW6meMTczPz5FDSBX%2Bz0Na7w7GwtK467csrOOd1TbajvOKmTbikbE2ep3bAQAyYpknAgFzhzT08%2Br7Yd80th%2BeAuWRU4of2u3QfdWYM8DKQcqGbXgUMOoJk2w2klUyWBV097HsTYoaUTce5tswC6a9AuOyvHrK6wx73ra4o6wYUbZvsAMKhojcfdFxHNoZSgwgtYvm087QARBSxhv8n4c4xXr6Pr%2BO0%2BshJfC%2B2gNwZ2vtbHQ2ZTAId5IyN3NDK%2BNyc%2BpAJ1O4dDzck%2Bp%2F2Hea%2Bt0T38xSsTblnQzuBEb%2FkS0L4s8o195Dkcmo8SHU2uLuPyIOWhtv%2Bl9vRR69ywewNwLG%2BMOTN2aw%2FFpbbqRlU2yU2yBr%2FR6tRX60G3DZne%2FKK%2Bd9cfXUU9YXkMeAYus2s96h%2BLMSuJtq65fmy%2FXNfbRJKnL%2BecNkNXcJZ2oKSofjd1DtXAm9ecsmEKWW68fGbUyFs0NQ%2FeX1YBMWeDhKQEsqGv4fft0z1XNIJoQObqNejV0eqH5%2Ftla9YboiAiYy4ChULfGGUe%2BLUjDQTZHygQC9P%2B%2FPymmRD91dQRv9xV2ct2h%2BPdub3TFvVDlaVPIvxVSc6%2FZ0uWcTIqMAmW2dWNWEdat9oRBD5UlDRMfFgRjH7b%2Fby%2BCPuNnPPHt%2BpghH98h3AVV4cy5CyS3A6ImEKcjCIXIPfDvSp%2BozBiSN8hFqtuqFvw3uU7av5lS9Pxaa%2BD4Eg1aQZSN%2FRG%2BtS0zVdgpsOcAqND6VJaSycyfk%2BiLYszhfYWFjXovCmwDW9lXGxNjx0CiU9QMUWHUfVmdqQ2vhocEBj%2FkP4LHuZRu%2BPA9efmij8V7EnXkCq0Q6G46s1R2sYVNxFLItgYKRMj6yRIfvaRmbd%2Fv9Ae8O5QyJSo%2BZvwA0e5dLvOps7WpuiQ4Yg0PqHQ5b72JOD69av3c0yBEiyV6Y7X7%2Ft91FMSTGr%2BkQIp08ov1zy%2BuyLsEHaJrSjo%2BreMNOL39AOVj5XxQe9GO%2BKbQUg%2FZ85ysf5jiBmck8GNXSdrszP017oo4sjz1vURuLPn%2Bbs%2FdjNEdhBNqJYWnFln4jnMk1eWO1hMBSMOpxty4C1aH%2FLn8wkWDJzSXZ%2BqZ4lcVTA82nx69YoC45aswqIks4%2FHgmtnbCrZgaKIXLxWTogAT4dzvGJ0aXjlj%2FnFvUCOvCqVgP4a1CvQq4U3AYXR3UuBS2JHGQHsNSVMAwpllNQGZU8JyZ7RE0%2Bx%2BQKH%2BlO2R1gZ3kLyRePnBI0I%2B1UzANuS5olJWSMbGl4ZWaBOq6vTRvYzLitldey7vis%2BMMWe98suoLULsxw2Ocedo2wJUD9IDJ2Yyxj1%2F6gh06Qqhy8p4N7q1xnRxxXhxf6VqsN66iF%2FFBgdxV%2Ff2QfmMrZqcqDARwBvJ2b5IRQrBdbt0nkXDKMcc5Y%2FS9uMVXLQd%2B7Q4GrVbpRWKoyrsfvbl7lEbv1ibRuCwrnvwmEHtM0soVW5o3bI3o6LEN1Mm3vUIi7gxloIwEaeThXFfVZe%2BZ8IUG6RHu7QVwX1Yk%2Bn1IhY8Dl2pNAze%2FaXfO18L8gBaicP3gFPrcIZCqWdT%2FpteClHUKLt7CdGt7jWJaHJwudRYS2XAYvRMIoWhe271g3eYbJCBFNOEu9zqKuEzWD9i4Fs6qXnb0xDwTJozoPKIoDClhd5uGn9sy86AKkUmjxs%2Bg3IstpUvvmSXaCVdl3WRt7Q79aJ%2BAo3e3TMqTvSrOLPhlPdny6hzxyh8KZq1%2FI7hGb%2BxAbuIQmA1EBjHeJv03uDLlla69lv6rLb8HHCwPbf0P6wqypTunKLoo7DocWydHL%2FqqyTzez8XX8GaPP3yCxck00X25PrHIac7DR8dBhGeRseAkBSnPTYpNZJhiY1mV0tAvw5%2Fam%2F1p0iHRn5I',
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
