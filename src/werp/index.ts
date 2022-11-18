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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F10%2F26&j_idt158_input=2022%2F11%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt722=&j_idt727%3Aj_idt737=&javax.faces.ViewState=P9ObVVGVai9xrBWjF3DwZDlt5cNhvByWfhqIdX0ykJapa7skaWDuEwkIt3Uofkv40Rw7XfXCKJeOhc%2BjwgeZzUonY7HdJusDv3Uh%2BPyXmAGwHgKFj5PdMVBS%2BxVSAi3Ca5H%2F9ecgPs637k%2F4ihxRW2iOMNkKylKIOoTIbMKHj4tAer1wJTREaa0uFZklobUY%2FVp5uerDBfxKtFAwDZ5UX9Eya8kr%2BVXaonXB%2FL3UE6eBOMkie15jfy%2FnhpvpXoyordsuiy3AJtUX4SbwmA%2FuU84AEK3%2B9lErJODP%2BtWxJEC4Dp2eYpryIKc1ZHzTx6tGXpH4X7P1SWOjQkh%2B86ji%2FL6GQHDYTRNkFvAElScGxHLbkGZ2uac04GqJaCexjGJedoyh%2F4T69BcQG6KC4qxP0BAq1NSu4B2YXqIxWRJxInAJjtjMFnlnocPJHAa593vCMOslbhisMt5PIKTnUIsGrtHJmmgVajOwmx4idWOgADEqW7EeBUbCIxpRaVB1laCSwDiF0Q4uFBq7t3nYAN9EohgD0EwaWCTcpyU1cGJeRGPCGLvNNMETucnEQqN%2FDy%2BbstD6WN0IPedOULkIpLgWYScAw3vxqn29JWNc2bax4NmxJe1MVcf7BxULYwk9wucKRyISLjre2aVK0CJDi2%2Bwn9oBdY1ToB1KtpVB3PuzMDOoqw14fUu9bQHX92OFhgbLqJ%2BlINGkHhFbK2gnoVmElbHJnR6t5ai%2Fy7QWBnhZF32n1O13bO4%2BLvfHakphQUWTl%2F4LROZm48qVvqE5keDOnxy2USyv9rTJTVbgIRhHdDdPVFzzt92L0PEZyBXqug32TZgeIqqR3WfI1KKNtAFzEBPY025NMWrATufldYZEGN5SF%2BZH97fwEvXV316f6v2bFLCKapNOjyLYs9PQoYhb%2Bax%2BkIbVZcx97pmHwhK3pXmwq1gYy17bp79fL7VTkUdY4ZIaBAh9Jbh05HV%2BKxmUxGJG5oRUF24hM66YOiLsofOw40Mnxy%2FjBU3MmWdh0WAcn2IU9nMyJpXi8OoCgbn57aPA9J7EAG4MjYRPCSVz98Zy7IyxQu0e5GAytoVK7P14UQWf8fi5EA1LUrObf8VbRNLIKVpMn8knwMV%2BtOQevIvXlmM5ejnIizgkNmMddGsR3SqiPPXMxMZk4kJR4GqdnRtekTv%2B9O%2BpgWG17G%2B%2BPL0YOKOORbeXa3RDX%2BPs%2BzneC0ysI%2FGmv7Y3%2B8P91mqNdlkZFUGkwm9ON6jS3Y%2F4qntAcgsKjx4%2FbSH3DT6IuHyK8nIh3uMfT0%2BpAwf7EHeDAIfVTT881n9CjwreZCvRiK1bBUTPQO3Qum9PRDEX9H5sMzZUjVlR08YxTFrWAwA0tmq0v7FzcHWmUvesz8F75bUlJVBR3de%2By5JJ%2Fq%2Bl7HnVlMY3a5ys849zro9qRV%2BuLhCHWBiqAPVp%2BSLS%2F45LyhUQlSFIUk0Km3Mbfnxd9UQCpzsBbxpfcSh4RXr%2BNJdehuRuVCXrGaYQ99GrSzAEW3KcXR9h2wj%2FR2%2Fynd7SorhSQHJv0RQem4gGUsauXZzF6U8LbuW5UzoBzFlaLhrMm5YBDbXMWtNom%2FUmqeNQiyjzvEiasy%2F%2F%2BEbteifGkgyw3xKh2CA5fAf5R35e47uUcp6lFRLnwJohUtlGS%2FDTeXm4FUIXdgT%2Byn775oZo7Ps1xh0kbPD9KHBAEx3lLklg8cBlZUe3SFCTs6dV%2BMszGU9pHb5OQWXj5AQ2Fv4Ny2fmE%2FrNEnjFZlNJDaeaX6o0ORQa%2FKg9MkH%2FdMYWlmpdnZc6ZakdmcNJbUJ9TLcH8tW9gnX%2F763UY70gi4up%2BPuu306oOi%2FsA9vpDX7wjvGnfjVYLLsW3Epv8qVw3CxaPnw8qrzHZuoA9NM9ERZ1F9LZ%2Fi5BzVhpD8c%2BZl4Ek31VWbSoxLPBn6OASSGGlVhGlnCnQi2C04OZuRwJ7ANB1q%2BhdmzI4lRmhFiivQmo882a9pBOTrJRi%2FuJkuM778exK16gNMAe7VgM1wF8wVlBHOEj473l6WM8HjLL6lFG1niAmQmqOS92zZG08DVddMiQdFM75hgE3811YMLkoyKaygnWM4WNJdSvdoSqbHI7y6BNUbLkMI5wJdW5Q39%2BVVwO5FUdBT1HlwuSRzhycMPykVNbKo%2FYNvM0359pTvmZj5kqEBHkPsE7THtkHRYPoghIkOC%2Bba1SmNmWBm0560%2FL4mXEpNyTMiLGYNTial1xhjZjwv2UEy1CTSBsrlt5uPKQTX7NWmECXqmgH46whYmhD%2Bt93rdcihhl%2FFig3fuwUi7VM5uxLgqXzQlewESseN7oxIZ0hc7IxLs3r6BpjhtwNPxYQuXWIxzuLc6C92mKZf8%2FiOulWgban4w%2BcNt6hRlVUgfnzV7KsHQow2k7Xac4Vy8ubTOwQIgdKbVWz3CwmINhjnKchM6IvgQznf1WxwgTgjGBbiEQ5gYA5VpWF3i%2FHFH0rtoZq7ywzTU6AJrYcZC3uqPDeFWX3zYIBAmAqlLLf1mvY0DkXzN73eqdiOMJiR47gqqFEIVD6icemLTv2PW7bAVsT9f16m5UQcs%2BbBs1X%2B5vHezyanhU0df0jUlf9CqPVDcpkttMMIoz%2Fkqz46O7E5YAMjsigIJc0%2BGF9y0TN0jKVrb1%2B8Q9L4p6OWlmYrezpQHch3No9IjTFabWKEACa5tDZB4Nowjre4ZVKlNJMWmeEa6n%2Bz%2B%2FYiWIEmA6rrrMKWs5KZYVrtJ%2FFsjvKotUKBCFCzp7cAb75vNgys%2BWJ8H6%2FWdOUjfmlAmRNlqm1PIOjlRDbrasgxzhPmpfcuQXPD2nxlhGke0ShpXWpZXCMZydqk9CeyxeGBEBzLYYFYRDRYBpvFJNeZnV506638SUKTz5OBB6i8%2BvrSm1C0GWpdg5R7ZSIu8qfDB00dv%2Fmt1Y4Bc%2Fj3cJS4NiznTFUUlYT%2FNH%2FFhuRAqRe%2F%2F0ypvm78FZfRwcY8voHxEoBL7S3B2BRUbc7DHOxX9ysdStxzVS1CsAt20WkS4107CSG2q%2F2rlxXCG7XFRImX7EHyiiq6PWHx7Klbx%2FeugwDL8R10FPbah4CzE9zOvUqqTDnbv0Uyb6D42GJ3RyUsT4TTfCU6PD3tAdh%2FZki50eARGf%2F7huO8EBMkGH0fCGWFJHyQRqRm79dncqpjgs86FSA2KvkLyAaQk1p1wnkKX8ZDVr%2FTo1iVBQ1QVNJELo58pL%2Be2zMmVKD88PnCS3uuaufn9FRCJzqo27hiTxvUjnMUvUMUoSY25t7%2BtUlsZ%2FAOh7v%2FO2YrjScK3uu6Hm%2FeIXHDrAI%2FwN6F3Bqxi5z%2B5nk9jaNQQz9ipVyTrLTPIAA8rGoskiViUEo8T0xqXXLGuuEn47pOSDwzJjExB5e9hakRGVwcXae6PILC%2Fb8%2FZjIjtIGEusoxo2Agmg80d%2FF8JWDm7kVv%2BjVxXae7xyDzPSZiWJfJgCZ5tYBztT%2FGBOclJDxjuoxXd9%2Bg%2BVCmBBZJkjyxvzsKkCSX4RfKfqJno6nyoSrNPvkI2e0Y6TRkU%2BUJh1VbxqHVpmsksgVbebE5KVEeu4m7rshfijBQCrCv4XBDW2kM7a5VPNTZhoW7Uxl2HTNXSGKJiwp5FpCl7sTp473NU%2BhWGY2Nw7O%2FoXu2MxzLIjxzhzIHbxkKinI34T1lYpyfiIzWKGBWvQNZnI36pI6KqllTMHpCTKeCxeOqmf%2BM%2FH1mV9HyQm4XzO2GrCFed%2BSt3e53CsBlr%2FbWdB2hZktdQd1tUQ9xTZmQYqh%2FC9yZWm%2FTPOOETbTe9zgAuz0Uha9FGXb4l09wF3zECZ1IcnHaonUrg0qe4302AbSZROWd9cGDZpIyzwWjWxB%2FwAd56agIXtQmnuPSuj2nw%2BxLkyf0BX22%2BqPP4mX3oQHAc8xUts71%2Fy%2Fx0sLI9iiC2YxgsiGJpFMvF672IZhsnCcgn%2B7qx9Hgu5MgR1%2Fn1imJiJoWXjWPyJRWFSCTB9HeirpXND9vS1xg1fXesLurcYRfpQxnI%2FGNrk%2FTEEaxoipRFN03Evg6J%2FiyhEdnLYZO5NOkvpFZ3MLP%2B9Q4MXSxaa58NijTrUwDnbdO96i7w1yrtkgdwruCywFwYZ291AQVw2NY%2BpNgs2Qj0Uh2ia1oM1ZPySkzkwIs0sUCgTZmb6iTRulvWn7xy1LAWqEWarlay2iy2te0G5Xy7HQTQicLF0Jxh7E51imjbzXOnbJw8F5z1b119IuURnATSMja0pZVfVZ4P2BfeT7wP2Xpe13OmrjdJCDbEP4ZT%2FpNlUqBHE5yOfDG96NBmg8752opBrERXgU3XZK29NiUDdZ23vYkSsSlUKSVOuv6hdS4hy7f7rxM5XHQ8S5Iwy%2BZLvlmYyVTjs6sljjJlepZXRFT4Hvu9%2FeBpQ9yZB8UQqIK%2FQKMDF%2FaZ1VgxHGtc4LeINHUY7KwmOE30897zQoxokhWet%2F9MqtsOldz3DnezSql4BWWCHFGZ7rdxeKfVj87w6Q91K8uL%2FbSlbozbV9O1YwQY1UEkH%2Bj0bMGaWw24RCYFY03N5FsvBC4dimzPhEvHEbXu0OYu0N2UhdnelaTj7zc5GK7IiYO%2FMSJoTJVyL%2BMGhvPuV0eG0NegAMB2RJZLT4LpUGLeQ5ap4OoY9ydYUn2pqYWwbFclcTvIcLlMkENLYjgfaG9iHoE6Erzc%2FmPzSXrAmhetLkWEg4cc840%2Ft%2FIxO7UlYiDQNmrWtvG3wJVhU7oSCo6QiybF5pqGSFpzbOJ5dB2cfh5BvP7XrxBt2WotJIh2uLweQcD8g892xvTS3fCGuXysTReyfAuYdBlDeQeGbjqgNbWgblyYX8%2FrqyzNqZBwIZbl9B7Dl3YStD5iiiLjaX2wVgZBMmP%2BLRZ7Sc1tk5qPrSCwjj9%2FHbD%2F4aJ13xuEK8gmqzVykdv055%2Fjgyrjd01613C4vHQ%2Fs0EZmOGQiOm%2F4OgrqKv90wNFRpqfxAY1J193pgMXhmITz6zLss7f%2FZzzo0TJ9KbKrnr2LxOU4ckJJJ1PMzli5Bwh%2BdECLJN3d%2FlTfTeGRU3iMx485AG2wdCF1X1uIw3gdYo6aI5Fna8xnPJBlFhpHc%2F1NZjvnW90tTEep%2BGQ0HcWLbS4%2B4pwhUEjnmh8OYVF4VERSUIN%2Bq2M65Wosg%2FVgX0iv412%2BC6Eeg%2Bp9hpytpRad8YVnOFLgxJ%2BJ7gZDG5GdsliN%2BZz9kvOyQmT7fiJcLRPAoh5YRFLxvoHrbex27CaG2Wd0zTA698n39H0GdIV2u43rGUkzCuWCIFCxOGYBsXDij61IglclQVAEJ9kBBk4T%2B3AT3daYlTA43iDg82aBnjRC6e0liQQscrjiiI4jGvjzbclRKSDT%2BqEDyTp%2B%2FWDpApLXljS6D1nNz6wUBg%2FgwiE1J689JqDy67qEpEcT72gLgzRGZNshGLlp4esG6YDawH8cAZK7Z%2B03k2aAyGN%2Bfwfi9CGRXqPLmpZWcErjNwskd4XW15aHbTnGKk%2FATIdAIJ3tBdn%2FV9XZ%2BAAPdTlZNKoZDdLxt7ijYgx9LfRsMN2E6dRvoLWmc9Jz9EvGFS8IOjQhwL5dVJdNMsdXsQHER5fpUHhVc0XML1c2tRrRSm9HRFzwRINIdWnJ0YntDx%2FpgBGZSULdjhidZ%2BZBphnwt1ff18jDAEEQjJr2a1%2BcKFtDWF3624XsEGVc5rYI1wIOdrXeYFNjqjbv%2FkRgeFtp6%2FtTOT%2BMp6Jgxp7Px2usCUudGgDMTwZBzy9xTM1kjsm0euxAb4qHE40GOSqlDFKIw7gfxiJJmJBD0sVZQiuzmg44D5263PUnA8lP0jqutieJ8oPmBEPUEnJ4daWX8TnAX5k0fZla0OZDlmMp0ks8OlFghOWTrTzyJpLA1L2sjLdLSR0%2FMesaTutZ9nIVNRPxuvXUSo8p%2BtQNbxnPvIPwGSJ83LfW7TvqYdywzaQyn3DtSKFAL9YDhcXEMvgxtGMcEKuD%2FJKJfphrhgWuHAd0LLEb3LcQYnGBsnVNJL2pJpglQgHb%2FxE2xHyudGN8b0gUBAlZIh2xAymTPJcv8UHaB9wIDj%2FAntFZXov7646V1eB9LVrSVO0cZ%2Fcqx%2FMhf77xYVkJvmcOtJRBUe5mIfjRppmTuBPOlC7dS0cA5Bd3YEnKEFiGASbSX7vIihmXCiHAXz8aLvettuTSOQ5ZYPlDNMFrsNAtTcSgJG1TeJa9MhDuWJ7CkqQpf8cRSSIbEIrYEUHps1yDZ9IeEYP7J%2F75Y1CCkRscnwuxt2auoSw8N8BHgP0yz4b%2BD2jUYohi21F%2B%2Bu9fJ11AMyFlRRVQrAj2bHr01TsR6HwVjXz1ZZ9uw0GRwo6TWOvMzaD39PG6mjSLBWu24sQvL6yM9rZIlBbUxUKzGudbqhN4q3zN76vHgp7JHUw09v%2FUA%2BmPQvspN8%2Fhj5%2Fazd82XeX42Wbk8ahN35YYaeQgPKtZka0fs8F%2FtC8ElShkd7gE%2B6ziDVH17mJj7jGK%2BvQ6I%2FAZBoDlkizEEL9l1pUUimstHpF62QH%2F9G%2BC14%2FT7fGzNOEe2QcDhA7dBGe9K3N1H%2F4ibbaBKT%2B4cnOf5ValUTduySylVrXaKZlDJQwlDWXfvKdk6xrA0PBB0Rt%2F%2B5rka3L%2Bi7STVWF%2FWrI79cav3YpoLRIONoELXWXV%2FIWecDHqvju2jD86BDf9APWap7VYM5VfGeeontoApn5BA1xhFMcErpmd1ls9TjjwgIA4l6bHBGfq2a9BpkkokE3ntF%2FejSxOLL32krBgE05DbGQznz%2FUdSsMF%2Be3f4eSD3BFBLoQfI6xv0JWDyOEn0Vkhtl8159588NXXx3SC%2BYtVMrFBlQk%2FOmPs8B7jFbuPgC4%2B3WbXlakLBz57c2QUaO965CgIEc0nOPnYMSIWAwb2rcX8f4YUkz9t987bBokxQKGWOlE7Pj7USRWdiRuajxiqv4Obip36IHb5DyZR8w6wN8WVuZbYNPCGAPYFe9LuoIEg2Iqripe85AKsvNd3qawhqx97liImFwOQh7yN54Zd5vcria80KWG4PNXiGMoLRqJYt5PrvWqM%2BaNTcYpyUve0LDBHcePxPa9AT0e1qPlKtHG1oDf%2FfO8Qc0SGP%2Firfg%2B6XuR2EEXPFq2PEkaxRKcSFyeMGkejrW1TyKsJe7hkcxe2xIV4o84ldqsoxvCIlOp0S8FDGyGB6NiWfKagNvqgg1ZJQn1LuH7%2BsUfoReikJCIp6hGkU7IyIbuyCze8a2vs2F%2FnBqmxcBVdHnLik7Fgk08eCP9OIF3wq5cN1vMw9DPzgRSmSWrJayw8QZadt2NUKwrnaQYYYfWTPLPQXPrMxonMUkYE5JBV1BAmmrbzE3%2FohvVWFlboAyaTom172AUN7ZM5Fpe83b3Y8GEU3E2pI9jZDvLiyaDDe7q7lgEjZ%2FP6XTFvZ2FGK51hJ7dyA%2FxNkpMNZJlfe4b0mrMKsvD12Y2gqtAiLAnsPA0RudAtc81dpWdpnoteFZXaUjnfpPzyYtzW%2FQr9YMWpeDcI5nlNBggb2lYBkErUn8boQI7ZfcFX1VlzM3uD2KdLvaV%2FSSA3p3%2FuvVLxuOZa54cAXU4Fn%2FmV25MqsF%2F0daZcj2JortGNVGj4k5ueVqeiYXob2pI3ALv50R8437y41MIN3qiZVKEjn%2FEYd2A8535plUqMGnX%2BvCW1n5b9%2BD87FUjMg5ZxiKLXnWl8cuK1F2DOt1JVo28BKWdDb4AThXOYV0%2BCYsJQNacZWwKwQMc7tcgUYu7odXWCtXafx7z3NZd92i91jUVaZZuBNjAsdK88mjR2xIr1JNBHCvSNbLyu1wHj%2Fr8f22lJAQd6R%2Fvso07k9haUvZr6NP7E%2FVTHgYU1kVV%2BQsGs24QR053FuJQuwAgV86PSvlvThouKXMp7ghiix%2F7lXXQL7siFyiOxNMBDyrEbYRZziATxOsO%2B2Be%2BeKUosMCfjUuGA6kJAWJF8jhuUAtYFRx4szN6Uod%2FLm8JOAJn3VCAzMwUtDdzXsV0YfRAxmpavgYCI1dc27Az9mcpsJNJMe71TLyKBw1CXUaxWHwY%2Bn5e4XD4h4p8AIdcEKPIGkkB0AE9yYWP1K5j0pvgyOLwV3zweJHU55Fbv3cKea98fAoOxSItWNheRFrxwS6Rc4pGhJOsWQDgCikWo4ETZYhwQ4%2B2W%2FRPdvvLYAHxWF7suDlnZIo%2FQF5n6XCo1O7pW2Arkn1zCVcj1uE9X9Hx6GB95atHO7URGSkwUyC%2BfArA%2BEd4mKZr6wBKwTAlr7eAKt1Hf1pSVqQBHbUvUXHs8GZPVUPqchblqgD9Zb4CK6tNn2CQK80e9Q3FALc979BBvUKGHxY2x8%2BWn96XMoVbhh5',
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
