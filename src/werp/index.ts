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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt163_input=2022%2F10%2F26&j_idt168_input=2022%2F11%2F25&j_idt176_focus=&j_idt176_input=&j_idt180_focus=&j_idt180_input=&j_idt189_focus=&j_idt189_input=0&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt212%3Afilter=&aply-data-tb%3Aj_idt216%3Afilter=&aply-data-tb%3Aj_idt218%3Afilter=&aply-data-tb%3Aj_idt220%3Afilter=&aply-data-tb%3Aj_idt222%3Afilter=&aply-data-tb%3Aj_idt224%3Afilter=&aply-data-tb%3Aj_idt229_focus=&aply-data-tb%3Aj_idt229_input=&aply-data-tb%3Aj_idt233%3Afilter=&aply-data-tb%3Aj_idt236_focus=&aply-data-tb%3Aj_idt236_input=&aply-data-tb%3Aj_idt241_focus=&aply-data-tb%3Aj_idt241_input=&aply-data-tb%3Aj_idt246_focus=&aply-data-tb%3Aj_idt246_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt690%3Adlg-leave-aply-vac-table%3Aj_idt694%3Afilter=&j_idt690%3Adlg-leave-aply-vac-table_selection=&j_idt690%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt747=&j_idt752%3Aj_idt762=&javax.faces.ViewState=HlbWJ421gZJ5VCpnDa4%2BN8h3Kz2ORM3S18x1THDJwfQerJ21J5X%2BJkKl6CtJ%2BXc%2BtAxwalFLgz%2B9geK6ZkYjku40rwCuHLdii9YNf6lDNYCa8im9kvh1Wg7FjJxk8v%2BwbaXohdDmXi3%2FleV14LjTAymo8vsxZPxwFC90rO4PYxCOb%2BQFTzTqZ%2FxGP%2BZgkTQFrOz3HLWch6Gxh%2BffZieuidi6Vj7vmymQP0aDiOitCUuONuVUrasqhIR5ZSu3myUynpRf1%2FBiRCR6EgxtsZ1IYymfLWo6vvzWctZVidokC4jo0mtLWXdCqwXrKMHsXiU9fhs%2FAisIcAJIAem2AwzmZ7PEusP5ye9QrSfB9hmPTPyrLqgaDGbWAs3NUmHRPseTNgGCd65%2FT0Van5Kf70zCN8d9Tt3FtSih2D24m79UPSeiyrbSwoG%2Fv9Os5ti4MW%2FLZN0shJkc9P%2Fk0JpOLLRJjrIgbPYtT98lfSAcf%2F5HEMw%2B5G1IZk2bAFqHlN39GirXcpxYnSRhzLgcgWBm8l1ArnDPnDmeqoVJy3vwzxwdMEDV0ms741Y6zgEAOkcKHBO03EvSeOntTDBI2s%2BtZ10czSQQkfxjH3dvHQG4gbfmYtAYkB4Ikb5maImO1bWqZr4m0KM%2BPy5bUDZFini%2BnVym7RijQu3efRnfJqWY%2F3ZzFq3Raavg3P%2Fbf7mDWb7Dc5IlFJSblqsSblVXsM4z%2BNuU6Ws3R8HL%2Bg40UKZpkn11Oj5Y8O2doExZBFpsMHbN%2BPK77Yfh9VEQkr%2B5zgxZQnFhaf3ouavJ6NzvGW%2BFlATpnxp5o9%2BOAb%2FsbDBxtSmjeAr1ZzTcIGKI1ZTqWe5S64%2BQk59RTDwL0C3cmjngWur1ejAIhRNbUSR3F7OLGjXUu8m9wF9DSJLM4yc1f5PYFeVgsYqX4rGRw5vfNHyvM8Dh1oodJWMcsirTXsivK%2BSqT5I6UsRFBaVVpwxf1DU%2FWmZddKP8BKV9ajkdsppcprdAgyg%2BPOuXkHRJxwOjC7qRYsXooBKHU%2F6WFJjrFnI1O6I2AVX1%2FcXRHzC7dfxaVypX42wxbLPe8n0BLZX5XPtbNXqHV6eHp58GlAhKZy%2BW2R4KkaVWHn7%2FwtqHsAsVwT4iSQk0Y7U1JsoCtOEd%2Fd%2F%2BojABhasNpxeaUIWrX7MKuX6pG0BEEhG5imNy4FuTt8OjFsK42MmaK5mrDQVEOLTDZ%2BwBlXbG0b%2FnwlJOioU55n9OvvD03iGUgY%2BRvE6r4IuiVjog6PWNx%2FRVgZX5ns90%2FYct%2BrTtbRIdE7Gf7KXy6LoNjXUiJ3RGlp3vqmeR6AF9fyn2gBn0MR7N2lqPYMKnuswBRETY8l66HsSWlcjjrKhwj8Z0L9lGegdwWskyvIR431g46ExF1IdoR6znKXprY6bQEd7sGss4kYFdq8NZFZ3ownu4jPULrYXKxpkafTxkB5FizXoXMOZHasT46pCSQp2sylvdA8Ek2Qu8GxgvxmBLUhL%2F1yo3c1LNnh83LMZBDp6chhhqCkDsaA6rj%2FyYd2gPXmxVHr6OOtqevHOcTcLAuOj%2BtjQTpyNbronYK9%2F%2Bi83Cs%2FtaxSUjP94xOm1%2BEuxjVQbuMWWnRw6o9r%2BHOMYxGkiPaEW5T61KTxhl5xLInu9xJrIxg%2B5CIXArg9BHgMfUyDr9hpYIV%2FipZ37gvjVYtVGqSl%2FcknckbkHqg0xcl%2BLmMy4R1DDL4Oc3JB0GRsqE%2B6n4S1k7GDcsvLEiI%2FQ4JFvrOlfowro2i%2B1q%2Fi8cELcv74F9lCPjltPd4Nh2jNAuF0spIsANAjHfFhyv88VK%2BtOYXs5V5mmSh%2Bck3HQ3hidpmfU4aGg8u477gLSFXp6G3oYr8j%2BdiAoNOzaj1n0JJxftm54ESF9jx5MLx%2Buy%2FbiFN7Gus6UYW9XorXAAGVYU13iXIHq0iLlkjcG5va5Z78f%2FWk1k44nkCjDGl%2Fpb66jbXFxJt8AJwgar3l7H%2FQS%2FVSoDcX8uR%2FdSEMosKlPqvTcqJEhAc2IBXCPJOqz68HAwRyFz1PJPRrXFqh6nxGRZ%2Fk8UsgUiERFgwV2pmV5C47UmDwndnS4CVOdfTrWpBohVyYX5LhyEnQx%2BV4QHgC70ex4rZ0Li%2F6dZ4u80MjEw%2FHz81ENu8JjZjUKOKluVjgZuJkhbn3bRiFfV1X8S%2FIwVbGaBh8Refr4z9weEW1yzSBt0Pgl2ISzvYs116cBkXV0Uv44d6roYcKuJ%2FTv9czqd1XgeiFm%2Bsri4UzC9C2a6%2FR0ggctN9uhngBMNMCN5K4FUt%2B6zX7wajcMaMosaHoEUvXI7i4OaXqlNt%2BQTFdkKZBDpqXBLHurHfqdk5rCPUOwsufYgxfuHTl8cSZM2PvmcaLZirdzDcZMgKOdqjnBJn3jxAPVtR3VNwucgjR83OrxXhYmPl7Bmp%2FQCHkYqGnua%2FBRYA1c%2F%2Bl5I8rXMbcXSVmdaZI4SjBbxzilvpGFAHiSoN1QLw%2BjQM54%2FOoEdiSEFU5Iwf9qDjeJtww6gaxZokFnLXVmunCmKfjIVjwY3ujp4S77MTPEQct9f3%2B0%2BnyWOyaZTsbE1rT8htKZwHWH5wkEutUreZOEDjSzjolMNSTIjqcZ6ttO4BcUq0Hz20bEDPMrB9R3X74SCqHXsJNWtWv5BF1bioFOovxBvXQWz5681fcEI8NAEJJ9NsbEzfSUj9r2dracqGksiSMm1AsRQ9ZBqDLm6mvVx2P8ZfokB4zxnb5EJzGP8Y8PYTZcgiC1xQv0TNQOf%2BBjkMDfOmUEvsYEGoPhxk%2FusYNrfuSU0IWxN%2BCTVHoChYaOEqovc4pgeh96Z4ET6JRDRngFsvkMI%2FeSkeEAAFs0GI4t%2BWwY4JXWV2givCLRBAVbkJDxcFCCn4X42W9Kyfs6FO2JEywKcg4on0FQCriMADJv3%2FOSH74gzfXSk4lD4F%2FBfMNggfwAxFgSI0l2q6pix9zHWUoJGukCiixcS2Ajpv5%2FEtsVwmdra1QQg%2Bb%2F%2FYpk5q8ER2btN4HfrB3j0iMHSXB3LiYRElY7738V1Go3AQvOtoiN6qzPsYyQ%2Fmz7kg9QPhA3I7MMcYD3%2Ba18yJMx7mdULRIcWR8oy%2BYv5Q2s2CGNC7%2FMCffzMWEhCQIIDCQv7MqcIH9F%2Fbl5%2FIEOssjXoUCMP4NzBpbRTM8ZHiBaLwrcGZhquEi1It2yO6wWpHwmERrwXLKzGuay61xAQTPSTbhI6sHIwriPPTKPo%2BE0dYNfwGzAwvexbWI2FVgmdym9qmPPchj%2F5B7co%2BqCLVzEx%2B5MRba7H6mtVECZrHqiE%2BuiK1J6PdjRZxFdDoEypg%2Ffaep61wkDBS%2BPZtRc0tYyvE04lKUhkE4g%2BIV1kZ9nsFOsP%2BxP%2BjBNbdEz3J%2BokYRBWtkSI7m5pKeS0Egy5IDMJAzLv7HFw%2FGwuisnkgEkYd1%2B8VMwmK1ab9CqenupEdWeNMZlVWQPvfTrWpYGaZxLQ%2FbihthvZwr6R2cmTERhtZ8G8pzYydvffjMwy2jY2s45rn8fcp1IEUA6JxhEVg2AA2l73UjiKCYoKAEUqIieJzWX9RhhwfKDupB5ePoWrUdNYRG1cHQSBTNOtbDE3awdcS6fIHkSBNwL7uktErgZKgwXZ%2FF%2FA1QmoEdf%2FU%2Fe5M0tdwru%2FkIZs0iAdAjsrLsMD7PBjWMmUsuejjbQ0lYpewhq2yZIV49xbYmvN5nMOT8ma3Ii6mtGkL7TqNxoKuzKBw7pTenS1LSEgU8ZKReMBFA989nR1Y2FWyS%2BClYo282abonGKymasL0s0hvG2AjkDjVd4WZk9DcVnwd4EIi9HJ0wQBr%2Fqb%2FHfOLSm1Tx0gGgjawHSICkxRlixpCa5gBUEKo4AnqowQ47YdFD20x%2B50AjQAFezqfYGHJ5dHNCWA27zxUMFkdmH6jWCr1RnOqDsbeQE7xhnrHj4LnswScec1V%2FfHnXXTrVB3%2BoSqRq%2FBfxhCOcYHFgM00mvjGluFAJLBacY0ux7JpqI%2Bjlt3CGT7TaCCGoCGkzjvySero%2B9IXLI9kumi4CMOqd4wIezNOePnei29uUxQ%2B7bVE4QH7w0iKqvuPi0jQRMWwLAJNCCABQvLXGdpston05S7pJGIu1NOBYpWjEPM%2FxTI4yEQDIvVCPdVA5Ml7%2BCK5latXKQDdq%2FXECy%2FPjWJOXzbHXzedX3okdlpW8P5WsAbJWYzhSGky13KAHWhWM6v%2FHjGz9ebd7D6USsRh2%2BbHjPm%2FZxo2cO1PUYtIoDnvfsJAG4DewHPSDA3a44cYlFXxFMPxYCZkK3k4XvHA%2FMOKc4P79F0ABY97Drxb4DUVX8%2FfqnoMAaavCzBLGeFu9Q96OPcPrKFYywV7iH7mA6S%2FzQC0RsG7Eyqdh2O1dcPaMSLcmnbFvp6%2FFqB%2Fr1C2IpeZz6ha1BILA4YxPnJ0PFSgRuBzeOoP%2ByCx1yzTFDy0pxcxzmM0f0Jj%2F5yakpX5zV9D0F%2B9WLsqHn1B6lAtPgTJYt%2B3SCsvu2OLhoEL2kltiZ7bY6B%2BEKznIct3C6c3pAm%2FF0ujdGHSms%2B2zmeMQCHRUEFRqjSszJ6OKu9pJZyDGlzCXclQPEc4INqzotx%2FRl7kbMYLi740mtaStQBXixSFHFjNV7M0ZoSaIOls5syybDU38BrCTNMuG%2F6VpHR3nDn9fknKkMsJx1SElR7AAal9tvPu7QfGKfQzkgZm%2BwsgWu0AvbgRDvdi7M48oTgWT7RAyNimGWNBkm23gP7oXzgtPx4hx%2F0k0dLWuR6YhYOGrlppH16Q9I48OjoLi9TAj9Knrvtf8wBeNyXLb0sbFw4VbSCyBN9NW5lbDDgOKt0AH%2BDot5a90Ma554dvMrUihgm4jAvuDGGuQrlZw%2BKj14gcDQuGbSiqCmP5l6UTNFgUHpH4Ge5l8vlyW60j6Skc2b2gK7AAf6Qs9YkTqRWF0AChKQmfTC0Phu89J%2F8YPrhkwheOxnFyLb4yMEG4YITTbqV5WhXABHE3FcQQjZGVvLd5WpB0KBJrSovVH1fb8TQOf7lzT0CDjTWuUb9eVIT%2FXdcdjPs6Pff7J8XkJvJ2wvnqrKC2jGDTe7zAV0vcnpoj3NJB7OTJ0sjMGPRuybTGLIyKlv4VDef5KAn5MEUIgE2Lx%2BldeO%2BNw85wVLxV%2BJ%2FAtpppdt0SkHVCF66BrGZvpNF8HYNbE4JGGpodrE9cxUA8yQC9cYtVajDemgWsI%2BwCzg4F7PT7yTTB1dMQe8Sy2iozMT8O2dkQ4tIuJ7mJLwLC%2Bah1jS2UZGOoaBkP0WyHr3whf%2FgYVau7QUaStks79QEdklm685DX0aFlNYzOQ2jzIGnnZBBY3UmvH10SKQdHT10yb6ykGnwUk69%2B22Og5Xn6s9wwa5tQlNDSv5aFrBNius2gsYIEziL6XhqkkyiS6d6oDVVb7L7phrgcBWMuC%2BaxKD4EX6W49yCDA%2B5z4gbK74Tlc1qx7%2B%2F9PH%2FbCm4hfyk4LBtQInC%2BacsfNbl%2B7hVGiQlnd8gzNUCvuRtnsk3lEMy%2FARPDeo6tDFSb4usauMa5kzYlDWpkANVu0z895neAnu3dSLCyrLicAUnyoC4stmzwj45IgKG6zynv3hbMQDHDCDaK6gb1zxemeMjPCZZhgNHkJNka%2BJ0TMyXXXVffmqlcBrtkECeSg%2BNNU9acWPlbcSjT%2BSPqhYaXNh7RrqsMzOuiTHBttzpsB%2FVJ8ziy%2FqzlC1VajV2KzvzBGuiMiZxC10FFigbmuFUeG%2BKIpxLOLCx2dqtBn12KQTWI0C0mlmm0zvrB8qRiJFKHO5tjZe2SY8OhGO5bAJ5%2FX47v3KPuAKkyWveBAlOk1eE%2BCGQecmmJt1Rw5s386BsFYKoE32Pkt5SzCpJU6Uwb0ua28TMPxZ4FRdE4e6HnjMl5bVsAshu1mkgjFYdcpK3sLGYcke68kKXSf4gQEnB0T7ilZjXr4M3XQ6MM86AypQMt4h0y9eB8KEmmrwx%2BQiezaFUSsvCR%2Bi71JcCFxIDgIpUSdA2RsXhI8HsOx87jq4fc1jdvDeRyeitaKKE%2FH9LXBDI7hgWoleOHg4RwdF4SOTJfmjO8TAi5KBkKLGZ5wuRPmzrCxF0q3R38cJjZ%2FRu5GSAzNbGpTLRUBBk1W%2BrFXJZkRVHOlbUpswgKxcihhoI0iNjOShyDReVNOm0z6IVaauiNWMf%2Fb%2B5q2NEIGkzePG%2BBgcDnHQICD1x0TBq2a7p2%2Fa%2BCVwBpj64iC98Ex1%2B9nf0O6cJnCVNF1c95Ri%2F42b82kZJrHL6tE7zbMAdIb0Tu6srRPgtICBvet5l%2FB3YP01pMx83MU2jSY6Rv7c3a%2FIVZpzArFsaDQv0D%2FrByjgCiDxArOoCQ5%2B2UH3h7Z3uh6cUwA2fwdu%2Fu2HnInJGMyrTuyaDjTbUlTpB8Wq6T1a%2BmsgvJPtGW73XGBSDDCxTIASdN2CNjdnVrCIYbnN5XzEOK976K0NMmLeJXARrwhJu1wqsZO4XTMr9sSEspNLlmxCX%2FKq%2FgydT6CXGi%2BdrxWFYyvsrqSWaX9PocvFBTxsRHFAvJRTs3TknUUz%2FyxIUJnozxXrVKP3BWUxrSkEyf0WKLYSLzWthpHPqul7KJY7o5ng0x7sdPzh90O5ngMfKd2lrHndB3g34Aa4HxY0%2FJ0ZJlR%2F0J%2Fiu6DBQvzbYyQpMkGUp4O8qqanQK9l2lctcnCK33WVgQwjEtpjxN0P7nqDeSuce3pZi8HeTkr8RwVNGPKQxm2D26ZGlh5Cz%2F3NsGCI5Yn0agvVutj9MpEULH0zGjp%2FyY4aQgo2sdDAF%2BImDzk0YQ77B0TGEJbeZNMGdv%2FxH0rJD22MR0H0EcQe6y%2FQaJq9vNqdHOWXMd4%2F07aUoPPzKSiPUw2FffVtpjNciLZCizMR1wHl0T2juOE26cHMcpLFWZt%2FDcD3XT3hrYV3DAdNzIG7dDBzKhlTHJf9T8SFqAqgLg%2FJwr0noYgwuK4aBjlC7lzzQO2HE7xkNIWnWuZa%2BJ9CYnA4gV5H27mlHK4Du6QHogJj6yyMGCYcJHtttR4bNZXvgh2lnv%2F8NCuEvDRgjpJauX%2BnG4dAmDk92COdOhCR8dV9HBsqVclsp1ZZFzlS6Fpwioyjx%2Fq9%2F%2FoX%2BAcmXFEYwRaBpVtXVKsDfXTd6ojhx9e5s1tFZJZ8hBnGc%2B5hGRbwzVi4gHMF%2F6RUwndkGUuk1kBZNqXVfOdiPeuaM4EFSwr%2BtcI%2FFaDRYCLhm44%2BvNi%2Bl7kLSSO9pG7qLJ%2FfhSxO5qK1QX7S2HpcOUEpiU9K%2BkF2YQzdHREdczibjwP0l65mmRlMWApQCs1jr2HzWnk8CYPIchPeGQrfv%2FtW5CRSjwupgXBI3u6vo9y4Ei8uK9DkATyKPQw1yrEgvKguK4oXhsieIZas98ykKMLz5jU46DBXyLInQ%2FiwdnqqsCVQvHPmpR9TmNeG8r0fRBLS2UM4Fe%2Bqo7y8wxasYtBwgSJJEsiiUqeq9LRHMruYLVz9772R5zDeU9t9YJMBIIhmLmvYgVZ4Ynn9%2BX3pgDzJNJuo7lzB7KTLkllpwdreja6hEHdTH6Y7iCLGWAyrkavDMijYIUJ9Pj7%2FPXQURyz7hFGyiwSL0hDfHX4PkQJlVXL32jyQ6BWrL2JdI0zkFISJQ9TlE0AmInPK1T8uV0jbuYOxgauia3NNBc2sDEYCqgVw8AKkIJ5SHMqIkNF0VCEF2EfrHOeTrJpv8OHmh0%2FzpMnagc41Wk%2BR9zMxD9KvTrz8XJf1WJX5PJIWWkFobw14QqzuYgPt4nMRWwGndTctk8NGGC4Dx%2B7PMkr9%2Fkk287W%2B7ln1QJpwQ1161pYluRYer5y7WL60zoQhFeXd5DJ1U9sdazWyxN8exHtapwPbONey7%2BdcFdK6cTJoCHPED%2BY9Ph1fOMG9spxMbxttAQjrMH7%2Fkf53%2BRXTxRUK7Eiyyxe1MtzMRR6DcaD9oQqR4nxVvhC6Az8phyPVUjbxdtIq8L86zhtkKbBNJHCIwKGjOywL%2FWUcfOtB%2FPbiL6Bq6enFnYbVD1PyeQBepdVAK5jJiR2kY8SFrqCpQnCWQXBQVdjpIOC6La7hF1Gg7TO%2F7oLyySDtdIToLLtoPg5YBzF2wZdmRbkNGVpPWxgU7ApAc5lZp8Nj7MNPSl5lh1HpFO4eclw5Z9%2FqaOS0usmJLfjd0XG0RZXzUYFiXZOz7ah6JviNS612KGSupnBA1qPkzreoxovYvrNVjclLXlrmPqLKgBinG4BCw75V%2BHoprLfRNQNnij7r40i89fe6tHHzo4Uy',
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
