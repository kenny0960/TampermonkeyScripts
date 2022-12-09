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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt175_input=2022%2F11%2F26&j_idt179_input=2022%2F12%2F25&j_idt188_focus=&j_idt188_input=&j_idt196_focus=&j_idt196_input=&j_idt211_focus=&j_idt211_input=0&aply-data-tb%3Aj_idt228%3Afilter=&aply-data-tb%3Aj_idt230%3Afilter=&aply-data-tb%3Aj_idt232%3Afilter=&aply-data-tb%3Aj_idt235%3Afilter=&aply-data-tb%3Aj_idt238%3Afilter=&aply-data-tb%3Aj_idt240%3Afilter=&aply-data-tb%3Aj_idt242%3Afilter=&aply-data-tb%3Aj_idt244%3Afilter=&aply-data-tb%3Aj_idt247%3Afilter=&aply-data-tb%3Aj_idt252_focus=&aply-data-tb%3Aj_idt252_input=&aply-data-tb%3Aj_idt256%3Afilter=&aply-data-tb%3Aj_idt259_focus=&aply-data-tb%3Aj_idt259_input=&aply-data-tb%3Aj_idt264_focus=&aply-data-tb%3Aj_idt264_input=&aply-data-tb%3Aj_idt270_focus=&aply-data-tb%3Aj_idt270_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt746%3Adlg-leave-aply-vac-table%3Aj_idt750%3Afilter=&j_idt746%3Adlg-leave-aply-vac-table_selection=&j_idt746%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt804=&j_idt810%3Aj_idt823=&javax.faces.ViewState=ydUumP2GcP54jmHD11kYTABM2DknkL5KHidM6Ku8y9827tl72AUc5%2FuoD9pxsdITBlsI8e0ZV0d8tul%2BwQeFYpDQNPAFTtIlQYgAZpyyz%2BMmZ9NTmYLjckFgw81CnQdSKr3xWiJUpJPFmNZLX9IZ%2BFx6lpsnu6uLRjWXTDavKIlDvcjGmVMSXUYJt8HirHhpTXthD9xsoSlquGh2YbLUvxVzLfQd0jFihukDUYBrOp3qiO3hadaFEaFvTloSL22FW4P%2BgwyrrrqibgxIm6x9rbbwXqIDoFFWbh0o3%2BzUWhascNTKHCjF054LcIWNRLkVhlYrs2G4MdrYuDc9ZoFXghUHfa%2BjAu8p7BKzJLpO%2Beaj7vJ4EpKNCS78v2lb%2BpnuYRKXIO4CsW%2BBLdQY5lHv8gmka0NKZ0ICC%2BOpK4c9NxqJvmWbheYz0VyZfPUByhdLZzo65l%2Be9AYNs7Y8tXbvJBpsYhgTsOqi7k77dGnC6bi7pHJmwy6%2BvErBV0PCJwS2ldf8xS6eFB4OMoMXo7dTFECvMg9hKhfiwID5z1QMhwFNCpYyIG3VVP0p1FvLSROkGFAidn0FWUrn93W8Dz49Lkskuu3iUSOi5lE7aPpElLG%2F9YAK55XpRW5W2YbLxUy4Xx3kY9kamqcv4WtkV7%2B3aFyMxut%2BDgQVSvh8cqndr%2FVSHkeB3ZaMaH09WxNlRzMqMKL7oE9lQ%2Fmw0wUZBnQr0qWG0IYDHH%2FUAL7cfo8P778%2Bx74xU1edP3QCye9Byp6qac16UOB%2BCBkhlziAhzubN7EwQBqOut3wFRTh6ajNa2paWwuvZUlPtnY17tsxhvnbgzW57EQwrzCp2eZs%2BFxVmpM0FElQippDsIhIMpfJuzLPBmtu9JTAGMJWT4ezug%2BYm8MVzU40noZsJ930eO%2Fyh3iS8H3dUh4W3x3ZBPPFxdBvk678kIm%2FEFkHTORhrv2JtEOfqu5t8ICwP%2FbTfWVxXfS01oMQLNyU1eJTgDytN1o4IXfVzTruTwMLQsBNcEWm0ceAM%2FAPTQj%2FAzyRnln1255hl9MpJ9qOvuDkI8Iad76mMe%2Fl7noklP8sbvpWfn6gSK%2BoJJgJkBrBdWMhXRCWC9uK537NwIPW6ukHUFBu9TYtxu%2FkIG9djJPE7%2BTgzD4qLTnWTYrWBGZ9xZ1j86ZcA%2BgGwlubDtt1WHABtYwhgKFQLROmORZplIluxMnmj9t6zXqsYl%2BygHUrrjv0qoAZ4qLggDFhwIhGP5QZ8faSMgNtnawVzezoU7gwSwHWArPTm8nuWUp1ZHWyoNlpCLMgjBUrYtAKdfLmDKqbnZ57KDiBRmGgrXuyecQ8zReyK0cQUuYE3E3lHe8fMf6Wi3Ls5ZZ59%2BTqUvaDSHazr%2FA8htxeHjbFQ2goG3bn6sQfXLrDmg8W92QfgVWKzS%2B91Tmp9iMPqQBqBnaxsMwgP9aWv5WcbRmtDthZigmnTHe%2BusLb3fZ%2BvmfdCgKmXVLi2mpHQpVGQHxP3ZpIVMHntoaS71upYZT1g%2BQDE2lHCjRJNco%2F6QvNzt5TsHi8pLbNfTxpoOfhg0fZNvq1exriipeqwFMTSmE83fLUwryua35MRLhBYYxGf8Zgz2%2BTjN90txqrrhQQ6YZ%2Bq4iDgSHvZESMjfGj18VpJenh0eQ7LFYF2o2opm1HGV1GECKFvlzfZ9hqTGY0a1c%2B9mEpzOwfhCCXnY8ukLIVpEA760SZ9hiScFY4RDvi8HhoDZvV2RT%2FXTkNGLjsbetrQ%2F79CjqxSAJZuFMqeuMbXAAwSyGHNNReFUKOXbLUWuWdVvSDF3YFdtiCfNYC9hKA6V1nbNY69LP3Lmi6ZfL1%2F25%2FcfeJZlJsW6F0vGsEH6URcjI5iKEK%2FjPJhGyQjcyCo58FVtx%2Bsi0qELGyAiGYwD4cweeD26a820KDW8JMbUZtTy1BtsyxIxY2ShlF2BgPTU3xvHVqzbY6PueBMbbzS0kYzKzUpdfSyC1pcAFVOJr%2BBcgaHtSvLdet6loDh2NG62c%2FEmoFaCixcyXh6Yy%2BJwbQ3NygFVwN1nlmssVgORQfc0TRWvnv%2BnnGiwHAkcmJ60gyiz3pP0tIw6AjM%2BO9k7ywTBZw4H01f46hiK0fctt8dtUBz1a7118CQ5iLnn1CBXFBDToAsZRXhZ2FNos7r56QLJj3z60zN3OfFXiRkfnNPZkbTbyaKFq4%2B22AA9yEmkdLfbnPhGxzmFZRYF62O%2F%2FAmMCJaZPlQksK3lP3qqo5OzJymwHqSdXyyGpIK%2BeczQZDMNbvkm51PF1pLUDGGeAKvEL1CymPN58CuI4IjV22Yym8Ug%2F6fEIQB2tXe1r6O9mfSyGehdCSIuUQl%2FvuN6M%2BZWEVQtBV4le8jXrCJyRFzAqCI8R6KAj7%2BWhiZXiZ4O7RM4fL8eTu43JstjNkBx7rj1eoVXfzwTKe7QRwCnuM7E9H8UUksG5Y%2Fmg9P9y6RlCRk%2BPsYPVFpxD9oAA38FdejOoLbJ7Gwdq1vWNFVxcqYfAUWCHkP0fuqyBeuTBcJi6M4NSinrc%2FFeWqClzPNOt7TzU9LtnflSafl5kgTXB9g7a5qx9rACSkeRMDfqVmOm2MpcZ5WTG9xr8tj36KlI0rBh2kRw0FW1fG4ckgI%2BTL04wGwFKcot87sEWOvherg6LPlANmpi%2Fa8i2%2FaYsHxGxHJQanFeF1MoNDnnxK2lFc%2BCNmwb6k4zEHImkh8Z1c5EakUWm%2FJ5eAuQKp%2BtnHJl6Q2i09hkcqxe630gQcWKwDwzEqo%2BAIZYd9hLoaKwOzG3FmSEN6E%2F6NbMEDVV%2FMdNo3ZHTrQypf9GTFGKz9ZP7pfZAGUEG7ZezKEpL5vM6Fa2H9KfrxqCqpp4vyrgj6N%2FrUqV4geZfi%2Fh2hiUJw3oSQ3b5sRwVS8lpDpVBTl1TxZdxokDO%2BRm322F%2BAKYrfbzRIf7iWe%2FRRKPIaCholnWZMeMO6k%2Fd79AQULizxQmXpeciNoZ8hebMQdUTcPIh%2FOUvVjzSPqTbL0UJdKb1752aNTBD%2FraEm8pnEeBDCoiuWEX6vq9gYcU4ifWxYvmTaf0VSnRPR%2BaUGCB0GllUNBko1MHUK9S3XARXnDQUUdGNLi5N8naGxkQQwz4PUbtoUSZ4n7QqHLOVBaCqLH%2B9%2FEYU72YT19XaMdRplvp4iGJr4Qsc8%2FG1uLXg6eveaSnoTJPUNzvFNhxa6lROSKzagUAYMNyDjKFJ3X2u9q1ysohO7mEOWUPq3drSxoSNt1Pv0LJBbLqk84I85xGbF5Atxb5pp173QRrSPpp944iEcXAm5zQH1IG0Q%2FjgI%2B3YEmsqiDyUAaEl6A1ljI7gqjAx2IJoBCNwoXRlv5Z5PnW%2BQATL09kxMIGsN8cOzxDBnYrUaH9r0QBD9Lf2CVDhIpcHjEucPjw7u5rIESP%2FY05ZRAIdVA%2FrQ%2F%2FpfOvD0oH5%2BzeBFBdOQGnXqPn3Qwo%2Fv%2FhrAv%2BCS9X6P3fYBN0uCxPgspBRv%2F3TpzC%2Bf6QgkUWLpEI%2Fz1Ubo2KLBTTDkbe1HqDROLs%2BjdGGjUl3HHGxRk5l8UjKIjg%2FttjOfZoBKoBigqj7YyBmiBUxl0YA7wFuqZohRyStQW0TTUHJFpat6Iextsdy42e64z%2FjDBez4r2dJ7LUoeQqOGbdLsQPw%2FynLnHvnDD0UaHqukBtlNInCT%2B65wa1ELFKsK%2BKV%2Bu%2FQp%2BEydRRZfCfStp%2FEnbiVPDACk3%2B8SY0GkcpVVK5F7xh6l4yE85WxP5BMTYGXUrI3fHuVy7GD6%2BaeeBq65WuG8ZRr6BqMFjvWgQ24JsX99FgqA4ZC5j01eN2TV4tpFzEL1xZkk5aGt4EhdGQxkq%2BxIWQ1cs2FzJZ2%2FaO%2FLACu1WYU8O2x4ZiehQbcc4hAkK0XhNpm3w1C9L4ke9cyZiuUdvPVWt9qs6K6A355HjpYs1HoHzbQEgkc4dci2VC%2Fmc3DqccAkSIRC6ch01TApOH6nHD1FOXht2%2F7rRdrUdnMxyUpSdd8tAhlE7WDF7e5nvJo2qQ5Ee1rz81VDEeHRY%2FwkFkMGtnaaDFR75FzlcOJZMLUxVYCOm4DVFHVsuVqIODIU5fn3IpZEzDfAR4CwFIqWDICDg0LbeMX8l%2F2Qca6Z%2BLW%2B4SkxdmITjGudms8Savg%2BL6SxSxv8dWsLYztE0NSS%2FcfS9GNrznVIE8S4bn4nFesS7bKTdfsBXRH%2BD%2FoFQZZ44q0Bhyk6p0k8ynZxvKM2Ggr9vfLoGpN3UDEX%2FP3UnDT1YHiCMCaFYjCnyIpEJMTdF5RXjxqiV7ViqUGsnwVsdsW3vOdNNup4%2FvYFQYGXYPtB4luakCnKu%2F%2F8rDb1izchyOdOlDfh4VXZv5S10%2Bq3lD33tuUF7u60SfhdadH3owREq0bI8F6DdvoCQMfWqhqzB7ISosdQux0K%2FhaNCMCbeO0YCkHAJZw1XAel0D%2BRbjdO7OQVSP8Jray9C%2F4CUCKRBLpKMg%2FTGTpUBn7f1el%2BltORByb3v6MMsmIbWX%2FfWmBW7%2BaHfyX0WEMZ2T0Wg6B7zEFFY8kxdIPnuYacLsEv388Spe5WwBnAkh14yvDKFJayfgezqLUf0ETY%2FNYsUbUsvHauWl9%2FdbPizqSAeDNWVLqjMd%2BwHXdMy8eu4RjzebPdvVkZvH4fDP6hMV3ctknmYXYvv0XDvVKy9OgJ4qA97NumiZ0bZkZQFTmVqu4axnbMBQEf%2BZ%2BNXqpkNATBZPQdTcrgse0oDUi%2FeGTiNimIK0zVHMjNkAEvEzPkrvgfmGSfElrCMo7oH6MJf0RH1zprN1kkQ9V9ZiSD7QfgnBR6Y1oPaSLMkXcjDaDdS6a%2BWdk51wJjJX68PpFbCSsRAx%2F%2BMQL4WZi%2BXkDvRWt2bsdB9b7rjBu0hfWz23%2Fio9YgNNI4NM6qyuWylvLO%2B5Mh0LvQzmWpep%2FmG1gMoi3EvG8b%2FR7ifI9s0YEsXAfGupvovSvguT8NpsGDL5tfBjQCdkjLDBKZtYU5e4e%2FXQPEzgyxiu%2BQ7cOm3h4QeGRCPDb54LdJ61BWgCKfv09ETuXDWmh4w6HZT%2BIfNzbaaJFo%2BEZl994OR2OpnyL0pdi4GEtKA7MydoXihHxnc7Z5G3kEhCo%2BUrqszf7%2Bk0%2BAkS%2BhAMUgyIJX98kvyn5wq5NsIBWm4sMVfrOyFHr3jGvRhEPJhMSk2znMXNqyobXlZdod3mD0mwS%2FNt%2F%2BUymA6eqmvwSZ2csoQjOn2jL9VSzCX5ybbV%2FyutfJOOvPF1DEtGt2GQw0Cjex9BKucB8Z7MtWySWXZ8Aw6faDKvFERrFa90hOPZMw1TGfmaFJQiDHKRaQhc9e9KdKFnL8chCIP7GjmA1ENltYvJ34aUJO8eRjC6gEaEyw8Y4T3raylb%2BxDeDQxw20JvHxcvwU0ALGGrpzxM8W8feenzWn6%2BKfaR%2B%2FjGcVnfCGpIPx3d%2F8Xh8qhRRULaL4F4Tjds0Xd2A9SGSgka6uuuqBevdyMlTovJErQarSyGxIPTq17P1%2FC1W3AmZqaMHZzD0%2FSJwj36XR57We7R06uJv31AOSv7H2aht4f71Wv85fXbe5AwDk4zsBeEl8AmPfQj3eBCv6HbYQV3eobOMMla75vRtYENbzykz4YbjU9qRglCCHm%2BXzwEziIVxpDwl%2F8Y0V363gMwcIG2tGzpK7w7qyOz7JxK9dDOAwQcH%2BFayOwSdJgsZJh7O0D7lGLqxrRj9%2FzRJfEMMOHrOQcEbzwZtiYwX26K7JjotwsXq71O7Lv9AZfJEuhylsMt8FsSiGR3cTQ6Mhp53Od%2BSKTjhExQ71I%2BKU1tVQtgPSZAe5TOOJ6UYcDaNEHQiozI3cFfRW08ilcNIUu9Yag7FP6EiM5TsGLLOOZz8hDAAIDRfMVcFXwZqOeLy7%2B%2BjjPRIZiaiBv6Xr8dwaHtxNaA9yHgAvjFmIfgzr1HngPSV0hka9Jv6TSAy34v5Iip8NOte7yJa0kV%2BdRBdpv56aHgq6%2FSx7YEj6dfwI4knfWyADof9gjOdo%2FWS5NNan1ofRAB8iT2Q35GroEHZAzcgABZDMUOZm%2Fqo3Nf1bbHNHYY1Rxqqb%2F73Htuk2sdZ5s6Vc0KYh%2FViGqAnmjPYGKbcVOqUJ79C5J79i4jJzcpRvkXHQd1IXaIWFKvI1ARgHxTMansaud1aIXrM4b%2F4fx4YiLfcqWvEX6c7Swz6kcCGms9hU6bUVDpbfk8MOEyrN2U7xkjGyKwVAi02P5GZAgXvm2ZGmejMnqHMKV7zKVI5hbaE%2FLs4l6TpQojWZIwwc7Q0dkR27NE5%2BdVhsFAyx4MUGf0Wv7DJ8B15XRVLx8lsMGs78UrVKL0etGMTunfBME5d2qWPLKEosRFrR2aJ0JV8j3MV6nSxjtFtaTwmouuJrveVH9DAHDH5sTwo1dTpbsYCP6zlkLkMO6HcQVxMh3Wy1zblmReSPRPNjnPXYWoK0DF1PTfflEzHgPmJXn5Xd6eHYGuHiEmR99wI6xv2lgrKcYr51OtRBkDkq6U2hlh3rSt5MBrxDFOzszVG1Jx%2BC69A9GMDajmqYdy%2Fdw9Uev%2Bg4Css1fL8u%2B%2FbtlWCU4HbZ1RCI0Wbk1a1qp3DIh714IjkEbgMT95LYrfu09FlbkkqektbJmq1Nt%2B79o12GXJXTbfCbMITokLAfxfGbS%2BJWrYFaRGd%2F2duHaF%2FU9%2FoRDGroQxQ63mIQqRJtm3XbQNYw8YNc6DeSSaVe9RAaQR5nIBGOPKmAMl4wyF9AYcVCEhRpS9tPDomQUWYjMWdeaIr%2FqGY7jcdJhArJSwok%2FFERvIeeaVyHXzPpT7coV7HLxKhFrAONrQWieGXe%2B9BEa52M0QqMtEiOg3G3yTBLhyEg2qtMn4NEEapKEH032ZNsyiEHTWIhNcypIK1ONMfVllTc%2Bt2wp94zBLb9n06ydaeQKVWjSx0KFhOF3CPoEHr%2FGILRIIlO8JX6su8lTmT6YVO8sa%2BNsVBBUo9ic4j%2F051wUO73DSbAZZjoure8DRtmdkv9DJJw6%2BRPD0K3%2B9wdkEDVlNuB%2BHMwvvu8rnULFtDbyi%2FYDNSsTujfHnQ6DIKKyJmX7PJ8Vq824NiYGLO4Xg0%2FYIAtHFlJ3GQlCJc5QjasJiRlSzsMaCzhd%2F%2FRWJz4VofMTK35vvrNw%2FvYvG3J2bPUMhYWw5jlGn5lIjSXalx1dCvTgkFKqB0udqrJvgiVMfJuZg5mMPtRH%2FiBf2%2B7%2FV3y8yy5T3mmAg8H%2B8PiztsfXbwDMxy2Mk1CmJzuHta36CQBuOeH8lv3aKdmOHHf38rDX9tln6L%2BRHb0gzd1UOLY8%2B%2BGnhPN3Qt0Hl6WeR5rquvl7wTUOGENxqOjbj0VLN%2FoSCMOHiBJs%2BvLnA9N2s53RNNiIY4ZS0UbwEqZt78OdL%2F0gBVTEeahFywXeujDaHPAXLeuXhe9Vva9u6rAiXkDQkof8gRI4jaQixcmm0zBlrJnu7y621y4FcKBYbAjrKzGqcOWxx%2BF%2BGOBRi0A%2BNgYsgHK22bYz%2BK%2BXLgTlnOBlQ5eq%2B8cHqjtz5lDh5MNgFd3piT4R0EtUrGk54feAoX%2BEvfU41OYfY0N3pJBV3GShCxANhRwJw9o6xzpYRo6uPkvALq5a1dPq7mjsD4Ei24UkhY7%2FfAI4WOmF%2BhC02DV95oG5J2lJGZKQe%2Bibs2jbFLSq93NKkyLmnBL2UudQ0lUVGayqF6FpsRLdm5HYh1oXm9C7VVCjpJEio4pTKCqzOSQzI%2BYqGPDxfkFS3GxvUlU69QIs31F%2F9ThNUO0vLwWOKEXfuT1gefYCXs1pGup9lGt%2B85dbzezs0G0A%2BHqRs2plZu6lQN%2BGWRN3Sb%2FlELfy5asjhu7XkjTbvogDRHmv%2BFwripnwFyLv8ofLG97%2BkwnFG1PnodUL8f39fcNPDFeZJkKehrj58sqfh4jNcLO%2FlJVtKXGWYe5fTd7jg8E%2BKAhJq3Vr3%2FLx6mMUPHvZiXAuDB12u4jTUNwG1DWyHWeEAfvX07QadDRer3ArcO3L%2B1uAEkYVgcjcbTbfPgk5mFcA01PBVgvCMBvyEplkXHyUCZBHEZZI9y7L2xPrROj%2BJfbuZ%2BgZ84asHqI%2BVZxReNgGqyN1ygiQ7hZ192e8ZLl%2BjOqAueB0BZOqcwwcX%2BzRnAI68ICPdvuw4IrbixQQMXH51zJfbKIf8H4UK0l4sVSeYYgw5pwdMFK8O1uyRXLhlwpbZhJAcEK9lKDZy1GZazyaYJg4uIW%2FSxySuCl%2BG6jlgxlPUOgB69zHYT0ShGB8zi4Q1CYlM%2F0YtNcUivpBtWuiQcHqjdBC7CDpgcHNI6FOj5UY%2BmLvqwYm%2FfnX4%3D',
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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt168_input=2022%2F11%2F26&j_idt172_input=2022%2F12%2F25&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=SvG03jjULuijwUwd0LasznlTQq4UzNNNZUWw6EcmZ0SQ863nyAph001qRMo2Y1VnfvaMeenpDDRRAUL6YGknLfHPDutZK9YXg1zHcqMsUv9Q%2BZTmRUaSNQ3C15vAJPEq3LavG3nldadbZ3K9BWiCF3gaW%2BvWkTqKO%2BvRh5%2FbPC60P%2B44tb2KOj6MtJsKhYNlKMSpiOOCU9c276MfSVTJEYrfSSWRsVTxnWG3kkzDAqbbR1mt7P1a3oT%2Fdg1w1bl6cChCxeXn%2Bu%2Bv0cM9UhjIEzJq9tuInC3o1r0pE8YoU40vCGjvKwBD1S2AkTlroMzBXCd27VdYxQnnduAU%2FDJSdjw71Hm9bVA7I%2BdD6%2BUBh2yEZUcpCQyUTs65lPQSoUmZUws4uZH7ncRA4A9AW2S1sYBb3kiRbigDOMKKA7aGsPra%2BiqzLpDmWGq5LP2FxfOyoTsIZA5sUTASSJyY3asIg%2FWEk6WYcHNGPiB1bRQdFOrBtkBgGom%2FCtP7AOtrKUrhH%2F0%2BjUjykYMMIKjxgDyn1zUzg8g4F9%2BULnbosmNiQdd4rDhWHVijRHDuuZXV2jqCb9%2BZmcp745SExW2oimm3NnU%2FzKb0gka%2FmsriGjot2PdFkqWfQu3ej5%2F4MsbHcq8xqOHwqyQl%2BFB49PThutxWSOiStfFfwuHQrRDVpYIIRKJ1upS8XsG0k8xSihoOgmFrg8IAnxjVe4t7gedxLl8edHBrEPeWYISu5%2Bx6qN9tW6op4leHC4UbMusnEop%2FRMb2tYCSkiwyfpnUzK0SiLqtbOCYz2yU4K4pzpzxaOftf1H5DDCwo57I%2FxUit7vVoH6gsn%2BiSUT2jpAoWd0h9f2aOPQWHN04jf5IpBqAHG%2B3xuowYhdTJ%2FCEL5wFXh5C4XAiNNawHoANRKhxqerC57j3GCwpR6AVMLGhekh7r%2BCfuo56%2BMHrX7YoTvMW1bI5PqRe7nhG08yI6DtXoD1f7bN6qB1UHbR3YkVTLNRobzP6nWTaF5sMrriQBz2k8yR4VJ2b5cS6TVhnXDWTTrBvrXyTlWNDWiCr4GJiKM3UY2nk08iRMf0wp6QGNYjJPHgKwYzCRen6cY8aXjVj6%2B5ZmyFMvcywS9XgqghJCgfJf0k4XRjl9JyNCPc4WX9sjh23xK2ZtdZqdgsgK6gq6e91Yp0x6Cd2CZRxCtoxRX9uRMFr7E%2FvNawjaSS1vd%2BiYZoWgtmXagqJCyZcrfmkWWHs%2F8FRByZjTIb6JY41ufajMjP8Jd57cgFw8T0aAFZQWSRvB36LwSFzk9eyzqMVQn6TiqAB0w7aCumFHsqteO7TtI1IRw%2BBMqHh02D4y14yD8xxg3I2NNd%2B55lJEqUMuoQJ7R%2BIQ8cp9ynuF12Xbqk7LJS4OGzHlIelFEg%2BrKDgoGVOoUthcP%2F1lumPdTtPfFlr4J4VULHof6n17uDW3Mg6H8x2VEfCn2y%2Fgc4rHW5MsYDOllKkUGnbYvHdBe9%2Fm0t20yWJmBv1EOXVyT2ZVlra9RlVewRh4Umd0EV%2BuWR8Nnw61Em86SF90JdUuT5ouw26DBYwTCVfdGWlOs4BRbRKzgIwjtKBwtTyYvF9crRG0hhssOCfqbhvksj5%2FQRSJoZXr%2B0i%2FBPjKTtpnMh%2Bif6vks1ayP8Y1MOu10rnc7DXqj%2F6E6MyVzpDKDn8q7y6A3djOR%2FlNq3t5JwOTzFg9XZF0mf8f0Lbw9pvRlb205448X8QUHbJ4EUbiGB3Dnxwrr%2FujVNEqUbLWa2m%2FVjCkynK1XqycqXqwVp233Rd0X72vJSENlotqXjiNk0OJN%2BLcEPooyvbe2W0sEZt2YCeafRpyqRwOExX20QQMAKI2unslyyOT776FTXLlFdwr1km9zE2Q%2BxeDovNCZ%2BGkAF%2Fr2h%2BuBR%2BMko9ybPNkOMBJ3T7YZyPyirJbl3wgfn5QPT0%2ByAu7n0bvOicoVYmfeYaBFEzojCbtgpmJOI0K%2FxVJ2D4IrfeENUmJs46F2hVbn6OSfmGcmycsDzQo53vKeW7iojkAcSl3eTyyPwJeIiwDIaFq5pCqIPZjgTBG6ptBeKO0%2BcvSVu3cFZilg%2B9R%2FHvLNtU%2FBYomZTBgp%2B9hI3qLzSsFTcYC6vAmkhPnMjprMpzynr%2FIYTjebpIosNeWPkVPo6p3HWfjeknzVjQyiKdBcwhiefceZj%2F%2BsuNnCmT250xoXHqgiA89%2BZwlWsjLdwGg1G60vzG74OCPMkMXAZhUzApLZ63jxtIgQt550AylAb7A%2FRexqYing004gZ%2BYZ%2Bnr7DBvQfw%2FriqrzA94ecMEItkZLzyi93V0c5TyRDCFwATH8JChXHojhCV3%2F9GgOMa9LvkWT%2B1uNiwydY7kfb1bHkK%2BHbj11K4FxMHk04AtSJZgrBDZpq9HWLyPelU00eeGGo4vCftDpms9aJnOECnXuRnMd5MUzlS%2FV%2B%2BFG6jXDxTfzwLxRXih23PK%2BMmHOfrU5Wl0DH4sGSnV%2BlwymS%2F47S9nNPeR8Scj3TxSTanYkrEySeastmXsD%2Btds1ZAQe6akl2EHAkb0xISzEVs%2FjLpGKoe1vUBN4cGQKj2Rr%2BoFCyaKzztfaflo0zZkbcIPDbCgfPZxbvub2b9rp29G%2FQCwpxlWGDfYVahfZM1TPc8%2BYg9B0HzhQLmDeZkylSyJLsvsqxbC3p%2FXLa5dWlfOJr1f9evXrRSoRwx3MNWbtk1dYNZw4eKJ81erUacpFnmtWAlTQH27BJfhMKJVIRLE56nbjPiVmar%2BGr1Naw4XPDKWkRNwQmeuAvajVOHeN7RCk9AXirez%2B4kHbw5lb8M8OLnMyqU9nTlwppKuPwBeNXDKnqmmBH9i4z5KQwzn2SH0RMi2e5ElaEecX6JdllCbDUaasYYtkppgl1MOvXx1wVCRkZ5Pmu0f6DMxrEIk5dZNSH4V204Edh9dOAWIRuIpix4bTN26T8wD2rokvuIxahKF5xGrwRjjsaUdq9flSTXebCRKJh4KA7UmxchvrwCzwCJROKDKDfitRViIrkGaSPkHpxL4Y%2FAE13v01mXwv8O18fCoXJQQ7mSenU8gJAsPQ3gytHepJQNWg1btOqNiSslx6igxyZY5y3vrSPqIiXXyvXOsoiJhN0zoGDQdRpriKxex%2BdlMl954Uaf5DVmyoLixlRdIW%2BTH0JB2CCaMNTIIfphzlc2c5a6iM4RhQC2fK5Wz72VCw%2BI%2BxMfsfJnwmwnh7N95x8yke8SHRChKJM5V%2FXgcfHpNoDT3tCtlRrAoTFhIbmFGSeJrmKt4CiPKfgmIOv8m529S%2B%2BkkvycRrkv%2F95pcoOiTq2xtud0loRjIJpbb9iTNanGsECCU5sgWAS013vN8P4t9rcFkdSua9hL7R5uhDRO0UdyZuQEBGhKWLpmu5OS2hT1UcKpERVaWseHtMdFYIIodj1Yys2s4OMnZJzJtyKvPTDV0VNvA5KX8b4mRb0bzkp78arp%2FqwZcSAHLkvfnhHy1mRTxd7uT1%2FCKd3OqzqpJ%2FJFKA4rUXk0j8RFrxJoA6xKPIaPxIYKKCjaWM3kTPw4Px3FmRlQhwLF0AUXgb4Y3XvLU%2BS3vGTSVmzsZlt45BTLgEanvibjSN3IOrK40jnOeSPrLPfLxqeiCYhGOOXnyWCDy1qKXRcNqqTQs19puBZTP4N2qJpr8X%2FhUyPfN%2BEIhTUi4JX2CApN1mk9iRKyFR%2BvUmJQK3UZ1WNmQn5fUH9kJFh7reXQiRifSncjmWL40J2rNmI5DuSNEPQWFPvqky1RhK8Vt3g2FchUHT7CfdDNzFsHvTlBDclzrHAdtn13m4PTWS5UDbr0G0U9YyKOWGdY%2FQ%2Fw2G4fLuB%2FsAGfO5ZFZfyj%2Fg%2Bm%2BWFTeST7lNvv1ohHgXQj3Z7UWb0OnSwx8tU9vyJyHFTealFqefvqh8nu3EGH1CdlDVeQH%2B%2FkcVFJ8XoouYYU7ZMoqbkH9OtK8vO0Eofh9pStGCzmilboRJZhc4qkV2K2%2FLGG0m2J7KX034X8htZWxA3nRDyWby8bm%2FQ0Z9BvK1K05HncMW2mXVJQ9HCIC0QgY3Aga7k57cw48lO9wfF5XOrV1wSq%2BURWeaiaXxcUurbmBUxQquTEuNOswLKbSRzJph4OeyVCp5TBS0%2FbklEd4AxBfvE2dQjMFuj%2BnjR1jLPPHot4SVHsQPI6NhvlSv7Sp3QXngCtU0VFUB9iPqEgi38ihCPAdSOMpmFIbLrbBsOC7uNNc5TTWfKaxVR5sez1%2Fng1ENU3slEZNEIKbbs9%2FBydOUUYoMa%2Fzjh0q%2Fs0FrQSO4Sd%2FsygenBwCUBl3k16Y2Hnm%2B%2BUg33ZmoVEcDdoyUDC8TjAo%2FBXk2fLCHj2URdPBH35QBJj5pMvnP%2FpxSmEQIjgEX1VUM1WOdkNpm7hu0E1NlknymjpIDIUFmFdyUzWuospXYthskx7eCcyXxbwCegzM7mWw2eSep6%2BRx9YlOE2V5T%2FSr9uKoKm4TeDuirEPYX1gV6GqzR01QSQcBtut8F2cBbNYgL2SA3hNczijaUrVaV9Exch54FMpzUqq5ozKSvfl6IiVZZ4O58XBuZ8w30bUWlUXcCuxDoNb4m65DNKiqd99633quuihyZYd6aEpfwNrojo0xwF%2Bi0SP%2B7RI8LGSOmVIpdtEWAmkPHh6pa1b4RrCtHH5MB2fRfR5yh%2FZrGzBxEqSPCVyptxTsQ0Pp96oiZMeCiU%2BJb2QwdEPtDSNSXQSorrkirapeNRnynBESW71gOv7VH%2BRMW4%2FQhR4bep3jbpGyGYMTXSfCJDoU%2FMBE%2FdLIY%2FuHh7%2FPhQdE69IIjxizh5fa7u4yJrPt1dM4qRz30vu6CEQavf3NnvtXgMpUlTaD287s8fu6raXkONuPxCRVg9mhN2nWkQgD4sXjHHDGNUaF96s8Bhwxdg7SIo3X3JhSJmsK2rucXqFkizeJfYlh4o8kn8NAo%2Fx%2BcUUUHQKDpQzKozXIt4xHhCEmWL991z09LKd6CZJlc4r27RcT7ALN6yYPjSjWv1ky9kd3d5Pmbm3JnoE5KGHEkL6TBHXJfqxy81DoonF5zBpbceto2BgbpTWMC2%2FE0Fr%2B0CE%2FQiZ96rb2ROy8wG2vVH5%2FzYHXxjco%2FhfEFKd10P6oOUGcCLUR%2FICSZ6lvTFoU1ue34a8RykLjCnzjtT1GiwpWlJhKY0gwlEdQtLfh47m1c7jqWq3ZMIyT%2B3TH1JkCtRGndvJ0XzCvg6CbuVh4%2BYcahyIT5%2BJNKGBEA2juyTftOS%2Fh9PZTS3FKRFADVZn7BUSWsLEJSmNI41VeY1vksLAviiUqwQzfnaBN6a%2B2FEw%2BOL4NHvhTFqlAoJ6AH%2BEihVZETlrslGjF5XqJxrsMbm8SRbD2OhY1Ej%2BCLSQgLCNQ2Je6MLLziRX6OTmbqmeQuLChnBz2lUjcGLi8oCt43wAfOEHTV0oV1y2iWo7N3JmVlMKcUDV76ea6EWcaKnqbDhwHmKCYYVuWMiyywPe1S2OorxYqxACwgzJ62CRdVwySjQeNU4VNoqe1KFqzDsBh%2F90IpcexeJQc0XqxvYdqSKcWQLCGtpc9WFjGh1COgyEHxGyxdKwR9%2FgoCFgZUZRL1bySPdxYmeooDikp7q4aiK2lOT4cC9bsHSYWNFHtHNiGxul5nt0Wa1slapqwDpHvtDox3go90Ry472TRxgnYYyK%2FhQKGCkp290DHwdbeTriM0PZOHRXFZmNfMVXI3hW1Xfbd38F0zXBl3d%2BW8dt42ulaNoQkbSG1KGXlMl0OAZBpuw9%2FZ1NuzqGd3zASfwN9%2Bt3Z%2B4iWtQ1Hrx40hLdN7FCtl8FixXylos2%2ByWTgMJUDL%2BOGBzfilP3Smop2tfSTc59xalhYBIKmgcCQSHcL6t6lw1PNUggoI5ZNGu9iOPK%2BqgL1zAPK4yKixQ%2BfSrRBQDBvgtSkmM2ara0bs7KlR0z%2Bw9z56hGYJK78mtFxEmxQBCf%2Bz%2FT8w1TZX8RYMdQbuR0BplNQ3d0RbPGvvULGJvCENsvrcXm1qnhu0dyiTkcvCN9bXzpLazDoQQJRy0cOiB0Lq5oiJrC4SRAxCOrVxEQ2SySzUsxmStozRvLYK1Hij9d8TzDTdiP9Qr28Dr8%2BJ32mnd1cIyLax1sK3wT9NIE2LM5%2BqpyYjsIiSj9XIcsiyIkrQA%2BH7VJTvG1yhRQoqDNP%2BtASYitY%2F60old024tbYaLlINyvYb8LOdevRtMs%2BJ7j5SCNi8F3Oni%2BmtNcIaZ1oC%2FUBXlEgwFp4OPVKuKzqd%2FedDAOLeaSk%2B%2Ff0RCfCQP5M1Tk%2B1LEy7ike0FRwYyCDKjJgYZYQKZKPl8ay59B%2F6BOTV0dRZ8ruJTbJHG6jd44K0vRmgmRmNhHdxlVwy568W4Sd742%2B3ySv93Tq%2FtXdl0eLvHrh01JInhHrFJZE%2F9RU2HC3rY9HRbqMRC6%2BE7UoTCbttQTQ0TgN1mJDrJ25fSwifyh1GUushulIxWRSPx0%2F8fwZ8QIpQDVnMJaJbu0Fvpm1xlCrim4H0K8Dy7pPufDyiBEjhNoq2lw40kGYLZAvpmicLb7e%2B3YttxOv7ow71%2F%2F2fgCt0juw%2F1EqEMdwtXXz84hi4ZmOSefJ0Vd6J86256EyiVqOXjRUdt1QWAq%2ButnWV3iQOvEkTiOOh6lBpI2rYnSgJF%2Bgn9srpuagmGBEKT8XaDyNEnIrDu1Jf4VDluamaC%2FXjEMgQDzT7pMx3qKJjmpLMZHpN6v0a6Cw469xyvrHrtJB7a%2FM0GEXcRcK8ibmCnx2%2BfIxLmr8FhLyKHlVW3rHrhVMGDi%2Bx%2FslTNo80rdoXCUix%2BNqLi5d%2Bk3KUpjmK1QvFAQ4ZuxV7L2NNQ%2BezLwSRaK8LPmYNackJyMPM6tqVVJubz9zuLL8rfrA4ig%2BwYQJ%2FG1topw%3D%3D'.replace(
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
    // 國定假日或請假直接不計算
    if (attendance.signOutDate.diff(attendance.signInDate, 'minutes') === 0) {
        return 0;
    }
    return signOutDate.diff(signInDate, 'minutes') - 9 * 60;
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
        td.innerHTML += `<div style="font-size: 12px;"> 預計 ${predictedSignOutDate.fromNow()} </div>`;
    } else {
        td.innerHTML += `<div style="font-size: 12px;"> 符合下班條件 </div>`;
    }
    // 已經下班且無負債
    if (predictedSignOutLeftMinutes < 0 && todaySignOutLeftMinutes < 0) {
        td.innerHTML = `<div style="font-size: 12px;"> 超時工作 <span style="letter-spacing:1px; font-weight:bold; color: green;">  (+${Math.abs(
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

const appendLeaveNoteCaption = (table: HTMLTableElement): void => {
    const leaveCaption: HTMLTableCaptionElement = document.createElement('th');
    leaveCaption.innerHTML = '<span class="ui-column-title">請假</span>';
    table.parentNode.querySelector('thead tr').append(leaveCaption);
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
            prependForgottenAttendanceButton();
            restyleAttendanceButtons();
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
