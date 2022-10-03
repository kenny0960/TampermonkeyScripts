import * as moment from 'moment';

import { updateFavicon } from '@/common/favicon';
import { showNotification } from '@/common/notification';
import { waitElementLoaded } from '@/common/dom';
import { Moment } from '@/moment';

interface AttendanceDates {
    signInDate: Moment;
    signOutDate: Moment;
    predictedSignOutDate: Moment;
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
        credentials: 'include',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0',
            Accept: 'application/xml, text/xml, */*; q=0.01',
            'Accept-Language': 'zh-TW',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'same-origin',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Faces-Request': 'partial/ajax',
            'X-Requested-With': 'XMLHttpRequest',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
        },
        referrer: 'https://cy.iwerp.net/hr-attendance/leave/personal/personal-apply.xhtml',
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=N5SCP440Oq%2BgviC6jcvDUxbVsK%2B%2BEbqQllhWUSY7VsItqNdtZuWOs%2BX28tKFQC4bLJx2B99a2F3VhzY%2FMFxvi70vIdwRleTH%2FYsNSUFKfJTZDejJj0gptiMb6%2Bl6Clk5nndDEMyCmTTO90xz9OwZ3JNeVS%2Fjpfj0%2FIKWV19YGCvrLMZ3qx0H7qdlPM%2BXHH8nktUS3HJy%2BRh9AM8DxIzdsYQcyTAYNDnczwNgSj3rfhSp%2BxXbARFLsgW1FbNIMi%2FoZHS7XEp613mJegAJ8fODPBD45tX%2BD1mHkeIVFjaRAN3aaOkqlrms8KNuHcB15y1%2FX0lu3GIKF7F%2FbS0%2BFqayNrDBHWjL6BFqK2rMEDI%2FRD9pWayY0YX2C6J3jGWFt%2FyOTu12KFQbLqia%2FAaU3ZPbkc7H23mfKKc7P2wSjmNW2zDvf9Ph0LkaIW%2BQuU7JrhxM5M3NWzebDgspfttbgMExu8a0c3zFMo8EQrx1hv%2FWZTFXCQb8ob6fh7gd%2FTQpn9pFLT%2FafhxCn28%2BDQiq5y3DadTd7gjHYqTbjc%2FXYtnVwA5Mo31EVTFhNJuHWhF5j7FcKBOEso853dHxA6SiSNsg0Y5YjUCgdGGve4dsKBlndBAmBrdERuR4xNEnRg92qyLLcgHX%2F8VBbFAgcu3d9NihzoAkX0j4JBxod%2FX3C3z6FWLVOzC7rVGTu0yq%2Fcq300G%2BSNbGs6KAfdVTEjBV4JlV7ot7fZ5JE%2F8YVkk01dNOWh%2B2cOYZfkoStDChMWWghl8ibZlcSQ9Ba6BRj%2FWjFHuVdhb2notRvjpPS70kcO6yuUbtJ3%2BmiGxTipNxechKUyxlVmT5ub9g%2BKVHt77fDhAZtRPr3g3F97GxcgIU4qLrgwHuDu9Rh2h70LICRFxTnvUCCPRoloVxJMsVi4u7ySxwQRzGe0eDYDRAmJw347BiSLWuWMrXdMgyrNM2ePTH%2FpzSfrgPcq8IxrGhjvOykAuTPIVAitH4RS17gAMJGNIDGcHG1UJJjsjidHAYGB5V8EbHQuZGokvUVabKCvl8ileX5Y8JH3pvgynoE2iWMbRHmtfk2A53PeZYaK0JMR7bsCduFinpRg0xZHwfNxyy9AUmwN%2FkCFDp6999zrVK7buOoJ89OLfDgC9jAtJAQ%2B%2BGsv4m8rzp9qX7AjFB2wMsgR4xpIg6TwcqtIDQQB%2FpiRlNnKY5280UZZlIRb8qd13UtWqNSe2iLiBSurNBnaI19TWBDguY3icEoqaYMUYtIIy%2Bpj289wJmf9AmnBEac%2F5CWbQjCK9%2BUnp1PsA%2B1DkNAV3NmaLFSNAnY%2BjO7RRM0isQvfu2e0MB7Dv1MSwNNExzrNfpMV%2B5j7ha%2FjkwDB9m5SJ5Cg3DmAvH1YVQOhQBjaAp6HdtwzupSsmazEHnL%2Bqw%2FabfLCneejbebwCiBmse9BnQYHJ%2F9XsAm5MYupO0mNPKb0rrCksphTeuoT0biSplZjquiHXG3P%2BxLVCxFpFSK6pCqiUooFmVLBcA84cBEcVPMkIieygUN31K1w0gLUGu5AtJND2TO05%2B%2BFTj%2BXmjPnnaSiiH7s5XCj0bR3Py8eTGjaxSE0c%2FoIldIlMQtphuYKy56MuUCMarfZD0T7gctGsTX8ICgjySxjJdKQdstdKII0WgPDfzP71YRSgXM%2BwgJhGGaSflCrc6KBi18pUNu23YcDYZWXPHj3G7OkP%2BGNm%2B4fnOmAaoTBYl6SfGtxoWwycwSVzLNHRqoZGkS3BoCVqhJ2swE08ElOceMmQ9WhybPynrYD2KHkwr4vySDV%2BvfZiqY1LKm2MXMMgszTQBwFSdlwIOH7X88H7eqdMfiJsWst6utzDe0cD0OVYBDEncQ3DnTfe9mRo%2BbLJeEDKnTtDC8JpQqPPDfrg3pKmE%2B52VsfodhiiaQR4WD9lAh%2B5oMwNd7vy%2BT0nnBy8wrZoQz03OYGnrorjMw9mPaEzne6uKywGaHUDGJDc2I2NT5zqrZxuQRcnuxfaF0WYCNk%2BVoY1%2BpfbFwI2vu4E0rJJ1IfcCirBdWB9IjptW7d%2F%2BHCQjKXI5jznH%2BRdXnbuCSvOZuG%2BPOjpaaJlIOurFDaIIpqCrMVy3UJCTxP%2BD1qb1I8QfDKgxoNhwSxAF%2BbS3kyNpmluqdgBK3cPRzFRqjKDEru6hVKBIjwr7hEzp2X%2Bmm0DliQTst%2FKUUifmGo6q9hHM0eNeD7wYfB%2BwyX2buMGV5yoenb8nsiuVvo%2BWYWBnvjCpYyDBfxHRgZ7kyYPsJilW7rHY2hoPU%2BkW%2BHixQCFNMv2Fqv%2F2zFYhm0fB0SJbYb8sDrm6ZgyaHx1JqIUwNi8UAhcDGd1JeqjMGBc7pALY42SOpZWAzZTXN1qNz%2BNgd7pqon%2B%2FpBgS%2F0jfRVXsM8Ej4XFsYUNVt06xEv%2BOzdYbgYCYaLfyK5tY3xCHUSq1BBmPsE3jGU44qwGOgj0sRPF0oSLZ6390jK32fKfXoAj19yORI5%2BTyN8nqyxv2u8JJp2cCl07Udy79nwNrbYhudgESYh2n30MnsgeWSN0ANO%2BRhoAqoiPQWmjkFKZdzeibufSJmz0hQA5n4QM4Gh3hQWMtxL60%2BGjC6agsBQD4gitd4KsHUVkVMqQnDgb6mroUNhPy%2F5bR2412HWozK%2BKBLBvt4Q6v5y%2FhjZ4Mgq5PNZkKcp7yt6T1N%2F%2FrgwhgpCUpGpAR9X%2BtXLr3%2B2rVLc6hlhy4RQh5YBFz4l0g3FlR2hJGasn3inHa5BlX2Wx8PXdJalJoggR9x21vyeGxaB2rdZ5F8GLEgtiCqmFuIhS%2Bfuqmqm29OjPH2icNNYr5s%2FdjVuQ2Pv4HimKIJ4uLBEUXpkugYHAUoISIFJBlRh9b%2B9BJIblua8yI1%2BHn64qItTfvAUQBOv8m%2Bb63MED5xSOkC%2BNroxeYU5AESDkoQQrhsh2Z0gKgMmIwT8p63t2JF2xfdAhksvKXFbbQjGGcPjr%2FGFGYJtdgDPinsbMnNgdppG38WdDcYEB4Dfi0FK6DhfoS31xiDvvyAdVDJ%2FosNfelp0qFWhCcy1MiIwRT40I97oSicx6psnBr2Sx2oX3kL1tJCe1v36Jb4Ypynu6qLMbWrw2RsWU2IEr0UIgx2rhbY9a2E94gikSUZuYQCABsYIUEU%2BAdeALhh4O4VrMJL%2FhdO9LxcaUIVcSAz%2FB9DcU6eeHVJj9ZL1MOKsv95Uo8pfyaAlpznFOIm13bj6wRyyPtblEahLhuJA5S8xDCBwCU9ZVkOrWFiisaKaTnwol7QoXhtsSBT%2BGzRS4OLU2pONW4VfChRiRiNd4Ao%2FF4maUEYTuoXW9tQ7O5uPrjPvJ1nv1UksUrwII1DVWGKWHPmpPdX4T5X3Wyrls%2BNnaNTLcRi0k0L%2BzuadmnhvnsQ%2BVfJZcSExdKmzP7uoYeJ87F4uAiPaow1PNCBdVEKFPXmeA7za9gPlaBaaLLoyWPPVSyIJTDNxKFcr4nzayP37wGXc0JAl94y23AHvFy7%2FxEbfR7nc1U%2FUY3H8tkBK9uKI%2BNFjOrYbVlnrSsBN1EYNX2b4auR0nx%2BUdgRPeWHzXaumyn3b49w0sjDyXrOT0HGfb3IsoVDVHHXEZOEvIb1udaQP5%2FgHV7AGxBsNGXx5ssz6P0Sd8KkXUgBWZxagySiLWDPyW8alfC65HG%2B87kB7UKaiVcBHiGQaNn3ZE8EKV%2FPzw%2BoXElvYfyeBtYONJHPQLDKxdwdymRxjPf5aft2ABSw%2Ftobfg7zLh1DBMW60gPq7zo4rePzU5CpnRdNXrmOTM3qae4MRllrYS%2F6gnyE6iuY1kZmTPgIId6FBQVv7rqCG763%2BmPUU16T7bPWbNLNrBr%2Fi45AfKXaJnxH8r%2F9QnE%2FDteaJiIjxv0Hq%2BVHQwJlpDSc7x1HoxqZXrPoVgOPTQbES0NOJUBuISgrPnpaEUkZimqhorC7W7WnMKq%2B1tdjxeNNrQSt%2BE3EL0PJ6Z8oGe%2FyLvE5HwmuyrDwTqi425K6IXSHaz%2FDG8Y%2BhO2SOeX9Zk1Lopaz2TwxyVL8DaNj3sq0zE%2BdnWNxNz8cI6n3i0UDCwjq0GImevvSf3N3puAhrwPlqtvjxK9IBglxeYwydfWNgeJyigcYBjKpEJFFmdBCN8wiemlYQv0wqXiQziu9JspUIJxNpt0K8QeILEsNUBYAuJ1ArBbiteM1Ef80yit6mVNtQ0KnrzW2gfliEzXHiT4aL9pi%2BN4hpRs9UsZO268VCdg7XskU8v92PA83ErkeTF%2FvRjYMgTp83Yrnxn3KjMvWg93FU0jakDo%2BD1DUSMNvh2R7Iwv12%2BTOhTHJAsvd9QxpM%2BDtIG63YO2dZfmB0mso4zsg6aDBwQzRRmy6c5A%2BpmXylcgp2XEaX3kOrCY62QTsLBVbt%2BmcIqeNsvxk8NPc5FUah7SNAJB62TTA1UT7xoVZopZl%2BfzdWw5sY6cM62QaJsAeS%2B4WcSwRs440uNuJowoGTjH5y3oYuCeqr%2B8J7J7vRt5EPtBSYInDOp1eIoRBkxXRH3Mr2Aa1WmAHeqOUNdf%2FIyuVIk1vMHZiPUbDuFtl86APQgS8KSuWV9Rtm69JhD%2BCPVFNXS3tdddPUpuztjt5LhhAE3CC9NDS8BKS8s4rzmo3g4K8zsPcN4q1tsRhLDgXK2sn6sdy0uMbNmlHbHmU5Zz7eRT6EAbaRDTTxmIuEJOueXaVf4D6%2BdL%2FiKyood3u0IQXStcfYDrG3XCS%2B0YZITGVAfqOuF%2BwjhLKu1%2Bc71RXopj7U3I%2BOn2Tt%2F9I%2FPAMcMu7cyIc03sx3zI7M%2By87qkkgQedgTyRyflAqGPpgfV71F2mE%2Fu3eyQPS7dziog5Gi00QN%2F0ZYB0bDf%2BjsCQknlwt10A57AJ%2FaR5FeIxpA%2BEXIsptFJiMSlEUn6K0nkReKCEA7Wu84QuNOGcGQNtb2AiSixSB6quiqNKXJrRxPqcTRaiStToxe3fmuVRcYtZp5tTGb8TT8qtyN%2BBzdk4QjS22HLMt8ebOPm85FF9OpOTMdWeIlKQRgD2pS%2B1imIFt7VFx88IhJxsVc9UiFxdW6OF8FLoaB0n%2B%2FCaBdhMsmDUtxK95JIp3lyFS7IRpHNm4pgRftstc6l7ktn6BTAKpV9nDmmQi7Hlo93KHoMqGL8VKVCrnbwmUT%2BaYxKAppebX0jibeXNQz3F%2FWJCqiKtum%2B8n5%2F29mv2rLcs63nRwGM4y0ITLp7cBziGNl%2BKtHQKFKahcJDRQ9hTALmHumRNQen%2FGU8AFC8FIMwbMcr2xtoH0TS9QehfgcLSE3FePpxl%2FV%2F5yC4tpfQAWQ2APGuLm0b%2BdQnRNhqmKOtReCC0k9NoRJ7wo9iZ9kqIb%2FU7axCNGClojd05qPOgrtqub%2FknX3L%2Fr%2FSToKaElxZxmtkiavFr2VDtibSinUinbELGG3%2Bb%2B2bT7jHBJ4eAY2ltP%2FtnC%2BUF98KuOmvUkjqinFhirFcreUjTXP2pfzF9uJrrjLnAbwl5xBHJvCigkyeBPS%2FznCvWW3cDqF6fPTKSt3QqZif3mfUiX3%2F%2Fqw8AIzu3C8ilBIIsTlIxKfggaGKdkJpfnu%2FyDt7pAuCryW2xFSe9cMhOiO1tifsZMueHGkJzZAbEAVpbcREK6SA9UkHV77%2Bueyf2Tj379gswqwtrI0WeOzhQyryjZA7bndNmzpA3IpntgClTHmtBhw3yAccaVKMANyQe4YJLzyHjKbSvD7B%2FTv%2BwPGEHQpx6KH5XmBP%2Bm%2B8B5C%2FXxM%2BU3r6cRH9OsZ14Dkb7OjJM%2BR32w23VxD04GuANSQPNWJFmh9jxelTUfKS0gJwVbP76etKQ%2BTSOL0KvAiAJ3av9OPuXv3T5hnDfqHEt1P3E6CvIRUvOnvqTmk7tPjoiU%2BPk174DgzYBMRs1WsDv5rXvbbZknlsHfz3VkuMg91rK3OMqR9E1ztpsGHq5IIOINvo5Z9J39r7Bw3PVARBvQkuRPhlpXoST2o%2FpL1X0%2B66e0L8eTivM%2FcJdJnn8w5pEWc4dnqrJAf9b%2F%2FUfquzGEuKd%2B7jmctEmPYZ3x7t0dXbDgs2F%2FDLwCBP6vOqXiR8M4PeXz0jsb9UqLGXDklLTK7wnwxk7%2B3HdvtfFB10aKAEhrcmUg3g4qhhMIKIow0La4sc4YMKVW9eHxQxMD8iyqvok4HxWEy5Xpd1%2BvEqcJpYwV6et9YeQ2LEU8LP02EYPWonkzrYjKMTYbpwrybb8Nr11%2FRnwajPIEsk7ZMUxjbXINpQ4q5ZsXe0bbUVOqiwcHCWldpUJFifGaAjFmIiORSY3VefNHewLrTOfRcdCEXiqKgY1GohiUGANiqeyCZsUS458%2Bm1rmPzYbX5Hnr0r3oAOI%2Bmse%2FBF%2FLay2AnRK7wLAqfC%2FaNjLu3kehz%2Fj%2FfvagA0fqCk3SZxBDnibyvhOeq%2BxRG1W1RWwOyvDvHR5YWgtlASQb77CzFdsF5TfguyXxmvKqj%2Fj85PHkEWD0ycLf38zabJ4WB7KIoMHT4vNLWqBswS5yOAxHJQnsBpxqPKrSXXjohqh66aBcmS%2B0g5MMZ67SOimbUuruGaGpwfGjJxw4PsCKg5fgZn%2FjZeYOmvLmYj1nf3finyhcVq8dZxVCIsRMBR9wY6y7ZB%2FXQyW5gNptrBZ5XKBeAoVzypUcXOpC7J4NAMnM7wFe3YBvKeFJ3H%2FN%2F1RD0xMfdBun%2BUIroYLBs8Oo2HZFU%2BavjR5dFuuW7YIpLHNYxzp83Qkxf0eh6i3d%2B%2BEn4kv57GJTVi%2FtvhRFNAboHIR0RDir6vv2avOSIpfgzJlvZ4MLurwra1BCHJ0CB5nPOfdHffbI9t9Ol%2FHmZ2Yb0VK7P9OYqdvy%2BEDYDNmBJ%2FnJBJZQYvlI2WgcPN2T91m5%2Fa5neP29Ro%2FDovbJxTz9xKmWMmPiDyCUJLpvPtatNBNGGkNO7idno%2BRVoizgQmgEbYlzjYIcVN3Jj2%2BsJEkScWyQBrApXBhQZlHsWlRs5nuL3v8QGaDcqzfK6%2FreBUp6QiyFgUcp0PrHV1gk6RFtvW3%2BsPRijgGlWVdaz8X3C5TNTpQoAoKkqQm2i3vo%2BTh0oX%2FqtR8dQMne2%2B6daaQe77GAqFsx%2Bz55BOjrTg7mm2qmlKbTmUel41RT%2FHv7JpbwwawiB7qEQ7LXKvY6UGlTwiTFLTqW0zCaQtePPDQFjEkpsm0SCOtmrSxCil7Ii4JPiw2bwO9fzaAhwSWgmh3%2BJGbrqllrWQt2i%2FDzd1ZHAWcxfFhlc8z5VfM6C1PyiCWkMB9cFCumqhFSaDmCFnOvjx1W14In3TjS%2BmuDj7zj0HRdL7o5ZMfxUfTLl%2FChXg3JaD15sZZ%2Ft%2BzbNPSlVOE4UMes4Lcf9BBO0kRLkKYG%2FJcmMRprY%2FTJBpYlBsaV8ish8gp9GGWZaT6%2BS9f%2BxXEguCaO1Oag6y9pC17cB6a%2FAc%2FdoAMQQPpMqDMGJCHz6WNQ49HpQWuoWl0eS5KMg8DmZ%2FtXiCTs3JuZhj%2BK94JqosSfhRLsKqIthh0ZESQ6FOC7WsMp8vKcooNl8JqkMG8r470qpwuz3FEG59h1YJMN9ZA8uTHTmCeUYfonbir%2FTrH8T6tqgEw2buaFjLwE5UbDMZ%2B7m8%2FKAx7lCMhpg54MVGfubuLyAqujzTewCC604dPTSW74cOeBaQOx0g7hROPapmyLEWD6RGOmpUuEEuL23BvuXeYbTQ10ltu0AAGuen2X32DBWiR0nOjPes7gDBP9iXkon1lgWvkZOBQ9Q%2BrYHeVsyx%2FyoxpE0mnJ3LdTCIZVsBHVUh%2Fvw%2Fob1N5I6FLt%2FPyNoxvpkdzVe1ZklLw9pGcH88t%2F6mO16s6fVzoqb71vNQT7S%2BE7q2%2B5h9O1%2FSsMPCj9hZ99q2H9T%2BZYeirpgNDI29EVFcnAIi3TpmjXbZPTBA77fAesqLWPgMtezuBECCGmFDm%2BRQljNZ0UoK%2BXrvv7md20IzQHfm%2FflA3Gy0N2As4dqW5DkcBY8XfPb7oY1lnCJjWTzVkTCeloQCeS977Fs5TAMIWZW2BiiSs%2BzvpvgH1j1Ys350A2hhL5yLbLu5k%2F2OPDXgASo2fGBgK%2BLXOq6SC%2Bb5S%2FV3LyI4PC%2FxXAcDUmg2Ey1CjE0xGHrwpGmOVch9LC5jG3J%2B4waLL4%2ByDGB1jBGTHAaQmc%2FdRLIwAaCm8Kixo4HyJLXaHuPVQJX65nTBkLM7w8gbtSJiQyjyV2E3TgNyhe5crn2gtjF1fof4fa3iA26zcc2Ksa7WsKK96S7J8NDlYy%2FMBP%2Faw7SSfymXRYTpLtji%2BypFayxa%2BiOOKmwcqHY7hemT8PIw1A1%2FpB5WszWR15AsivV0%2BzBo3Lrbvq6j6IJgBszqwYdAfm%2FzF8Ic7ZJ%2FgDLIJ%2BeEpEVmuDmxbUnR6ucQ%3D%3D',
        method: 'POST',
        mode: 'cors',
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
    const todaySignInContent: string = signInDate.format('HH:mm', { trim: false });
    const signOutLeftMinutes: number = signOutDate.diff(currentDate, 'minutes');

    if (todaySignInContent === '') {
        showNotification('記得簽到', {
            body: '尚未有簽到的紀錄',
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, 60 * 1000);
        return;
    }

    if (signOutLeftMinutes < 0) {
        showNotification('記得簽退', {
            body: `超時工作(${signOutDate.fromNow()})`,
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, 5 * 1000);
        return;
    }

    if (signOutLeftMinutes < 30) {
        showNotification('記得簽退', {
            body: `工作即將結束(${signOutDate.fromNow()})`,
            icon: 'https://cy.iwerp.net/portal/images/chungyo.ico',
        });
        setTimeout(showSignInNotification, (60 * 1000 * signOutLeftMinutes) / 30);
        return;
    }

    setTimeout(showSignInNotification, (5 * 60 * 1000 * signOutLeftMinutes) / 30);
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
    const predictedSignOutDate: Moment = signInDate.clone().add(9, 'hours');
    return {
        signInDate,
        predictedSignOutDate,
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

    // 根據剩餘分鐘來更新當日的簽退時間
    attendanceDates[0].signOutDate = attendanceDates[0].signOutDate
        .clone()
        .subtract(getTotalRemainMinutes(attendanceDates), 'minutes');

    return attendanceDates;
};

const updateAttendanceContent = (trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']>, attendanceDates: AttendanceDates[]) => {
    for (let i = 0; i < attendanceDates.length; i++) {
        const tr: HTMLTableRowElement = trs[i];
        const td: HTMLTableCellElement = tr.getElementsByTagName('td').item(2);
        const attendanceDate: AttendanceDates = attendanceDates[i];
        const signOutDate: Moment = attendanceDate.signOutDate;

        if (i === 0) {
            td.innerHTML = `<h6> ${signOutDate.format('HH:mm', {
                trim: false,
            })} </h6>`;
            td.innerHTML += `<div> ${signOutDate.fromNow()} </div>`;
        } else {
            const remainMinutes: number = getRemainMinutes(attendanceDate);
            // 顯示超過或不足的分鐘數
            td.innerHTML = signOutDate.format('HH:mm', { trim: false });
            td.innerHTML += ` <span style="letter-spacing:0.8px; font-weight:bold; color: ${
                remainMinutes >= 0 ? 'green' : 'red'
            }">  (${remainMinutes >= 0 ? `+${remainMinutes}` : remainMinutes})</span>`;
        }
    }
    setTimeout(() => {
        updateAttendanceContent(trs, attendanceDates);
    }, 60 * 1000);
};

const handleAttendanceTableLoaded = (table: HTMLTableElement) => {
    const trs: HTMLCollectionOf<HTMLElementTagNameMap['tr']> = table.getElementsByTagName('tr');
    const attendanceDates: AttendanceDates[] = getAttendanceDatesByTrs(trs);
    updateAttendanceContent(trs, attendanceDates);
    showSignInNotification(attendanceDates);
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

const handleTodoTableLoaded = async (table: HTMLTableElement): Promise<void> => {
    const annualLeave: AnnualLeave = await fetchAnnualLeave();
    const annualTemplate: string = getAnnualLeaveTemplate(annualLeave);
    table.insertAdjacentHTML('afterbegin', annualTemplate);
};

const waitingAttendanceTableLoaded = (callback) => {
    if (window.MutationObserver === undefined) {
        console.warn('請檢查瀏覽器使否支援 MutationObserver');
        return;
    }
    const observer: MutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type !== 'childList' ||
                (mutation.target as HTMLDivElement).id !== 'formTemplate:attend_rec_panel_content'
            ) {
                return;
            }
            waitElementLoaded('tbody[id="formTemplate:attend_rec_datatable_data"]').then(callback);
            observer.disconnect();
        });
    });
    observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true,
    });
};

const waitingTodoTableLoaded = (callback) => {
    if (window.MutationObserver === undefined) {
        console.warn('請檢查瀏覽器使否支援 MutationObserver');
        return;
    }
    const observer: MutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type !== 'childList' ||
                (mutation.target as HTMLDivElement).classList.contains('waitingTaskMClass') === false ||
                mutation.addedNodes.length === 0
            ) {
                return;
            }
            waitElementLoaded('.waitingTaskMClass').then(callback);
            observer.disconnect();
        });
    });
    observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true,
    });
};

(function () {
    moment.locale('zh-tw');
    updateFavicon('https://cy.iwerp.net/portal/images/chungyo.ico');
    waitingAttendanceTableLoaded(handleAttendanceTableLoaded);
    waitingTodoTableLoaded(handleTodoTableLoaded);
})();
