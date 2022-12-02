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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F11%2F26&j_idt158_input=2022%2F12%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=rRi4bAnoM44XetVO9PNJs07zYoevooA%2FFxlaytKaKos8%2Bt8659TscsF8U1a3qocOFrVuiVbBI9%2F9SVD52XTJd2P6BR4ze5sgtA0%2BahbwiJqgbITca6aCCirpRO79AbH1ZQm%2FR%2BYHWbffLqWwRTat2%2BnposTq5kN17XRBg%2Bo7vTLkN07iWNvmghw3CTfIQhjSx8lnW6zTlUsm8%2Ft46c%2FWBh5D%2Bvhc%2B3f%2FeZiECQP1L8jpT991b%2FbE0NHNBXIkO99mQVqc%2BKBGSbIEf%2BpL0OszbofF%2BcPPrSV5lF5IOnT%2BQr2DY74%2BjFPFhanFq5UZGmj13W2yuGByLo6jpoOSxQZj8IJ5dnuBHnTpqSBtAnjx0sXd3JfQhViLUkfjFkrV%2BpHUlkJyOvpf4JIo4k9WLbYbOUL2QTnm%2B5%2BpJEmdSlfM9Hh6iImmk0zur%2F0K7ZPgNvy7GqvZD5nkVUBZfTNdYwZgKFVFRpxUGNGsU%2B7kqHqOjW1XUrxUw5m14b2aONCPG1Juo%2Bxs%2BW5mp4Z%2Bg5juqE2gX9DTW31ToUzRSPFT7dosG9Y4aNC4HXlXhRJco6MgWBjjd1QdJ6v7yJ%2FJCpj3MB%2Bv3T%2FIJCQaRWto8UHPqHbnwg8ItMFOoFltkF9zUCWDTNgQvrMJt118brebeAVazyLA1q8CgtzVAUTrUbVjRsKyEfkNTGAwxwTu6CR9MmGmyjPG1WPloPscw2VSuOFPFROqxIz2YY3iXxYdnX9sgRH3fQGCT0GRxdsD1aWzSE7wnZo0T1Jhwyp%2BViGIxwRYMzamhgSuY3Gw%2B%2BMK2TG79dhb2qORap%2FAWGnZQ%2FyyU7B6t%2FR70URvOpFbe2RHpH5bQdqSMhyjWI3PrAEiknUaIzmwL2h3AmhhHtDUI2YReQJ8zMSXfXKAQ06ynhiEs82VhYWDE%2BUVIWtgSplSOeloZcOtdVxtRFL3%2BGqv2TnLMlT%2F76XiJWMXMagsSruton24mJOGQT%2B5x24v4dDXVLJ2csXpzMHXI0xAxsWUFQAMdYFsHWY3Ki1%2BS1MapbJgekzW%2BBnl79CgOOx18rspBGeoM%2BbW%2Brx96idaTPgAFSXNhVY93FLoT6XMzihNMkiFS3IYX4fhPa9XDgTtlIVp%2By6M5JGQOAfhi%2BbNbS2reUUJqdA0xbe4uReyx4crXEc6S7DUg573%2FTFnNKLnuITX9OwiibSPBoFz7vGrAqP5tSGu26Q85TMvOF3kgXrZmFDrLyfeHRIGyuoAAX9R%2FdXzrf1ZKI9w8DfPfHomP2dij%2FUhl%2B5CroxosE6XJGszB8iJhkCcN73fORXOovxpXnyHqM5scfGfhPo6xg5aKeQQSkhtIxTSqEKgZwXVzTVNqNJ%2F4nnkYAVZIa6mTI45EwmMLkb3yNrG514rjDKBztD%2BgYIE9Th0GZHZqwYQI8mbR%2FdzJT3ZYHbW0TWb6jr0CDulo4%2FkbQUExHpRnPk%2BF1cokXU%2BDt41yuA5lyAxeDVvVjw11K57m974lk88Z672sb2r6dRwhb1ObJOOX0Vmo%2FEAXMPTKTlXCQZQKmHZw%2FWgAU8swcyHxNWh%2BPqFcCK9zlzlZmTBHIbuVdpAVWCujimHuciJFv%2Ber0RlqGCQv1kY7aGWna6fHI4ZJ7qtt9lvq%2BUeoyXvR7H2bCUyUuKCfshFveDvjbsXLNTNNL%2B6CGXE3BkBPXFsQw5Jm7cA2IKReeHx0OsmLAmS2fxPKfnR2aCx6vSfA6r0MtE4Cji%2BtXgXg9UMa8TL8ysVmripHkS%2F%2BP9Nih8hVy5T1Lv6HJvimzU6iHQtAVq3NK5xr8cyT7SpYcGdvVZASOeFPj1zqUMxWNCMW20OqnIEUrOabdvc1frkinVYyWtdtS001%2BFUyB6CfTIApdWDwMVRQYlOldmRJtgZ1ZDMGYU93ojuif6YjzyILOdfYGuwQHFaZu3Tn%2FZ94rv%2B0Ipo8QeIPFMg2mc3g5gW5%2FJwtqb0c9DDlmaEViGBN4l2Bn8L8QSGAr90V9FMvNscpzvsJCG0qHMWr%2FirW9VImbUy1cZsY73nvaNI7OJtlWnlj0OMBKpntGUFTU1cPmIlM%2B%2FNyiyd2XIq2MZ1iz9yuXIlzmsb7pkL2SOIYLjzXYdG39HdeeYT8Wrdm9V4Hu%2FJ92HlcdKXWQORveFZsGzmB%2BqrxTT3VWoviRqEpWFphuKeYShx6BTJclB2OCV%2BtsD2UsS%2BgibUOP4HGdyb%2FvCNqq6Uy1jdQZBesyFF5M3zP1ddTTxksMWtxHz4Sa1hfC13EIYbl3%2B967ogjzsp8fNuL4se%2FHLTAJkKoMiZPiQqlBWWxq4tfhgWTAtikXD3RlDmgzSrY7jqNzt3YGwhyxVwTtWRk2GtRkvVIdvqE2w4wsL4SKehbAIo88NnIYbaE1yDyqRiyVpC9T2Jc49W1IJPC9h6vUAiRZd%2B7xSlYWqRRR8hIiyos4WtVKvP%2B6A6pvP7NTZKNfhouQxdyIqi%2BF6vAcdTVEx9pelzTcD85LUawXyxZWDDP%2FHxF2o2lhl3fiG9AyNLcrRb%2Bn4OafEK47DOodm17AY2xkXQdU3DP9WJwvKSXD%2Fjd99CSxYfkTtoMrTtEE%2Bfcf9o36qI61%2BLCIJ23dlH7YAZ%2FaQugpH%2FJ2wAu03twBNqA9ZBCVvKM52zdfanDZ5oYo6fs7Ap03KjIZ5BGwyT5bE6UU7GiPDwcL9lmEQFdpemveO7MJdU53UFAsI%2Fgx7%2FT73u36MCcwA5%2BHJ0moWdAko07%2BZWPvA93E5qgShM%2BUyI4cFt6CpqRHzZscK30W1%2F%2FLOLIlF2C5VLrU%2BJIsdt8jWM7D5gtrlJqW0J%2FiD%2BgaQX83r42UUIvHMXMGybzKtfxhjZqGI11s4tKefbrr208vJXvOEiQGXQuCBAmpQfhwifDz311D8ngUDJOHTUQ7cuB2gJ9jtJJsB%2FNMl3%2BvJol5WDB4XhMlUHlIAnFWcQO1xqdkwneBIbjF%2F%2FxlyLvykzI3%2Ft%2F%2FwPZi1%2BxBPESpwhwv51B3xz1sbyts6okwD2LdtZHR5m%2Buwzqcw4XDmlvSxlLgs%2BPbQ%2FeO9mRTP%2FpKld5BUFGp0p9VANwiiCKtFpOQ3S9%2B7dCsrNu5Uk%2FX0JYQ%2BMlHjvCRfwB21Xj5QoAf4uEDgXagq8CY%2FJ7XqvqBVFvSrqx3GZCEq5y8leFP7Ad8DN7lWICHdR20nPupKiI%2Ft4zVLgcPcwg6LtV1tQAF3vcgY2My6o4bAAkKNT%2BuJXddPaFQdpIs7LEvjl0aZQ9h1CUt%2FkA%2BTveU%2FB471SlSOb5NnMzjsHLbEs%2BR%2Fq6%2BJ7D2rpQSw8YXQ0oteGd8Gz4j%2BMXPtsUdXE74xbn0DJn7uvmuW%2B34Jzd5Dj91Q7l05gMlhjuBgxB5zhrqVdFfLUX9FfdWKjUQlOkC5Fp3ptrZZ4jEubp%2BnfUt3vTo1vmbOyx6GrNrsKRaN%2FIp2cDPazG4kIAJWJ4Ouz%2FOPqkm1KcVhzA147V0%2Fuvo3eAcjFjsBCkzC50K2hKyu5H5t2xCALb3ybzL3zo8WZYngg%2FBSD%2FsEx29Ho4HEn4dO12phniUsSgImildKliyRj9lsbAqMO8dDUjuI2mmIO%2FhfR%2BrfyUiL5vhxU2SAw%2B7JxkNZlF46GSt7GP%2BM%2Fu2h5e8%2FxdWYmMPg4U7bCH2cKSNuxht8wr8uI65E2bRkiZcfmKwGjv1Q6qbY5NuHIzRkzzulicalMS6YGk5Oo5%2Frfu%2FI6VWnr2RsVQn7B1gAZdw%2FI6pSoEJtPA2rDurIJ2Ig1GQ%2Bxzk1kMX8%2BNpjqiJGvkbcxVOM0VJNR9nqpwq85Fm7DRMK9OIFUiqR4eioW7v2r%2FdtNsbaVm8x%2FBhERqG18vyWm8PW%2Fi0W1qFXUUAh1xBLS7vcMM61tdTKblRS3A9QcNbCUuO98VLCA8rBdQNSGBpLYHfpjqoJnBBt%2BYWycxSQJ63ABDRy3qkrUWO14Jtcs0h7rSxEM92bxGZhJjBDtp9GhChsyEkKWNK4xluve4vr4kRolI%2BsXawjfRsqniNhlt03axisr%2B51ljPLQEpsj%2BsMhA6Y6hjB5%2FliyJPdikfM8IPi9a8SCQtIXuWpmfz2ZXK7v7%2Bu0VKbXfsRG0ZIagLzU0rDmugKqgmE9XH2JXmhnbT0yKlIzJokMtyzUj83xa5RHCYBsixHkmZ2oEiS3SbyhFn0DfIc4HYoUf%2BIExymyF3lzdXgvwN4KDnhqMFMrGKbLrM5WysLDBwzFU5Qzv10PkXgLlFsOp%2ByLo5c7O91xnHFtgyRzLYhumgYgnaGdCvx2xuImebbBDD5THDLH79t9CsAqAOkln775luB0rg%2BWjj1DD9f1gpA7YFrRuE%2BtXF3mNN9HCA0qWArk9tRAWobPwCgli6aRZ0IBptLB3u6%2Bx3LaxrTiaSz8twTkPns87zVL8AuQEzEgyHU%2FTFpFRCHTvjL4h2pCSf%2B4U1NtbYAu%2BEb%2Bgk6%2B6vS1RAI46JUm6CdATdDIqVNZ8%2FdbKjXJYcUBnl1mDm1cX%2FrLOQFjmezI%2FFsDbqm7DSA2k94h%2F%2F6OnAXLpYMwXZs2K3CWkw%2BmzVfNubkjmP%2BpUfw4rXWc2YPh4uFzAXK2y4crWNosv%2BF4GvYlRR5VSBEBaGXwTSi9lVu2IO72AsI%2FcIZEdDo1S4bTny5m8I6EMbexdiyeSHQIYo2zssMEfS8sPkD1KSvRVzqBQdprq09rKSr3KqyGO4yp8bXjVKAb5lY6EuS8rC2DiemtoXGDTq%2BP9F9nn%2BisOpLJzqRWGI3XemJ1KhQL3sew4aCDdWSHep8RdyC%2BCL83ekvSQn6LsapzaUQSFId1kNK53vu1xcK4jMz7HodrhRqP2NmePUHC9cF9iSvD6fdHwceb42nj2VZ8LDtREa85qjr2r6gudhvtjVh%2BCakZTZwWlVVlN7gJPqfYFBVZ09O0TBOr66hD70zEfCHNJLblM8FO81GhUKInl0laWiXDVCPo1seDEFb4xY%2Fa%2BQoA76Ppa9nQvuMmrdm2JlWgBdd4GTHLzYEmmu9xgBhqrS3fBX3VS%2BOqdtJJ8gGi6oKn9zJ5eCx75y4neOoVCyN1uF14ZUrdFfXcpx2%2FPQZ8SwQV5WVFnb%2BAdFSbh2ELjl9hnS%2BUrcIy0o14SpN3fQyUWXJD4aNrhVnczEi%2FrQ%2FbiV9yX8Wxiyt1Qtv808ILcIls5FqU5dgWOSU1ZB9c5P3BQbJOft13lZaBUfe6MEUtTpV7SpEvSMtCyJpb0aoO1tVLQOLCqLR01GLGeYs2dbpL0D9Bnuknuiet6cU50d79CW%2FurI0F5E4qpmRsdHmcUTTubl7sqZFqkXGs7XapjheGxCn%2BwHZoiSWtp8Ye7F4cBN8MTQPvgoO3u4qPqFlAvRMtf9RI%2BV8xh1Be0pBiTxqrx19FyUu5oFJY71y1jEHx99gk14w5Vh978dNCcOcA6qRC82seTz4%2BpxDzkFnCE7PBzN4LiTJG9K%2BGvBB1cIMBN5YGBFyIpYCL436uHrnZfU4dU8z5WpDE0HV6d8gMulKe7xztzqdOM87nMwpYDBKMSrKpS2%2B74nKJTCotYO%2F6C35K0KI8FyIvgju%2FmfPQOQAy%2BhxtzoJHl704PpZwAAwtWTPrLQqvjjBSqeKp7Neh%2FqFRUq3EofhgQDbqagO7iql9eCA1XbnfaJCTVhgOTPvmwNVbQFfdmZcBdvK7%2FKhpExbsGTkW6zr6NCVBgfZ3Hyimp1AcoifRGIWCA4a7toTfRtEV%2B7Hi0U2Nqba%2BIrDKlVqaS%2BCNdAAeWYsr5HoeYluPdrxJFXFmpjwquA8lBknt3SQPXdMNsolkb2TdY3NBD98ViPnoJ3qpBUTqzm1Np1fzVvSpSRQm1udFrpBfzjurDAOZREQ3yI3JWkCqCbvQd0bEmKx0%2BLU9EzkVjJH9tXU5OaETDY06D9VUoya7lmROVZhMACb8JVKZgqTCwsnQb7uhxa8oN2vsKy6WXBR%2FaOJwP9rmuQ95BFjQPpFEg5z4ebQex2tFwgMVmUwe1ud7QyivwSGgI9ed8pDJYVdqDc5gW9rJgfqhPnqQyJS1y1SHrn%2BKgBaa17gPsOjBTsG3p1HlP43l8yLuv8hURylwngmoNtZ1VefftC89Xhqv6KZ3w4MrbYxDd%2BtabgIOSAKb5sgNL5kJ58MKxDqVUZeMqKFETyNWOpaUDxRW0zdxBDTprv7DrrKSlaTASp170AjXOO2KOP3ZMwcTSBUhQCDHEd2kwLgL2cZ%2BfQZCubcqQGbJ2D%2BREzvkkXTde4wEhs1zBliEiVy4nCUs%2FFYbjy4KJe%2FT8TodITNBXzm6X1EVMchmTRqbhmcL66oed8T1dDDfn5Es4owDT1fhudZblsFb73Pmz6EJndD2p7mnnDnWoav4FoULSaBinKOhGZupbqLPGnt6%2BL7nPul5Cewq2TlbE%2BYbexk4W%2FGUX4LaMGUEgH%2FeomA7NbjnR1PSOXF4XV2QN7V%2FY8p7rAcb1FRTkgAWGyhHJHRsojA6dSce%2FK2Xp7hfCrL3oFbcYhlqrRVCgqJ6gzLByRDDZxBBZQ43m7Cw0EY7zW3nMafJwsdLnr4pHV3RsjJ5J1MbrKcdVVu8%2B3%2BPqBykao0j32tAsGJfrQllwjdnesZ1xm3Kup%2B3EE%2F10jDjNU7JoYk%2F0bkW7uJbuigTA0Jx0YfZV7qbBbBhnVSxi0IHCrdSn0WNKHML4bQaGzR36%2FQR8Y5%2FOGaxt6AKu3Bmb5XQoBOqaHDxZrxsOL6Dgm0w%2B3MhuJ0G7hRkmTOwJxSANzrRJ%2FRZxtIpgTdtQ8QBrjvpbd3xRBhhS2YYMl8%2BZcyNWPyyX%2BmYpcQR6Vdj%2BCyDqmK%2FsThgBuLKD8JBbdqpt0XYfbaUF3lIOp6mI0AkLRluy4VEL2oRKqXndauX569om1zsbXM2jxK%2FnrFPMX5sJDF4tRNCk3cBsm93xf%2BWj7uCcFVBYprklgo085XIC5%2F6rRyXVGAHGpJ5ROG4yS6OinScMgDLR7c%2Fp%2BUEHmoZW%2FB0mZAcVlcX1bRzNYsKeCtuDUanhnNUyk4Bqzb4%2BgZOO426rUq4NsW6kVFngvCJYm%2BtyP9wZnNEQ5CHazFTZG5Mdy3wAoE7hFZpQUygQrNcWOwv58nBamliYh4FfEQ9sKwhoAGwdvd9rsa77tHvdekGTP%2FpusVvVkVocTW%2FMSPtCInr%2FoQvZc0GD%2Fv5pbvChyJiDAz5Hu9LptxqsPIS1%2B%2FBnoq5E4zpQxUH9OWRcmnsyjdxCRkCBRod2q9aypiN2i41fyUI4AkIWQ2YlnqRO%2BLffJthm3wtSD%2Fs1M%2FOp1fe44fIhP8llyKRDEnT7OdIeGNOQkefk%2FfWIorpsRl7W0rEBPbH%2BrTjbaXAMC%2FKWuMKY8vegT8L%2FZbQj23tfBDDkWZjM%2FyiGeHmO49CEdMCB929HNmem3sQnomtRhQtHTbYknX7ji5pfw8n1%2FT9K173xmmQvPqwL38DylaUt%2Bf%2B5HoSKOiu1sA0h7g8vsa6O%2FNfw3wzDqcayQTFw6jLe3yqRYJDY3bX250aLbYaunGw6crIetkTEV%2FVjrWuhiShO%2FY11gLkH%2F%2FGDOe59Pg35amQ5KgqSpa1ZjX%2Bj5hkbVBu9hL2UzOzwTByzdjoqjEirhDSz1hAlQYqzAD6KRH0Lxu7kl72euvKNj6BEMlKwiCtIDU0w6WHN7zirTfro8Rzh%2FnlOtwCscYQpVeXiEAemrC3DRLZwwxpWHxvWDyBm0%2Bqnrb6GBR9F%2BZzlWEAeBOcr5XZWAd2kYtiDluzk5daSxKf36BpleCz1kWSYRTwYI%2FP%2BvmBKVkUPArrN64ANMgclBbWGRp0VM116po7Lg9ghjV%2FSs2d3mMddq3mc1DZTNkvqaixD4PsljIxeXg%2BtOJwtHEcSO3E7rbuLUzgVUnPqrlNSbqJOh%2B0DqNOvD%2B1OcCqUjncE5uVUT44mHqCSZMvNf5qYgcUmJ9xkUimP2ms82k9k8RQzD0mf5c%2BHyRv5TT2eUqbPVHWLkOHSGjn8qY8uf94Mi5gn1%2BpVjEZ71P75iqjA9D24aJr18dpP02jbNpsB%2B6biUwo9p0Pr95p7Y8ZEqvwmLHX33ujA9QmWP%2F8mqgqj9g37B0HY%2B4B2bTt%2BzFPjtGHBTnYEp1MpWqneakBGPuypchPQwaY49Hwbf70knWOLRSe8KxNxuWxPo68y0ZXIzcG4oq17Wf4nFt4T2k2fQ81SJ4%2FOixsZ6wNlXLz%2FOClE5bruSA8XvWEPrOwELLKSf0IyX425%2BP5OzNHKnoYJ1%2B%2B4LvslM9WgD8mvvUAo7aH2v1dQNwFzJSFz%2Fhsvvj29QYn80o4Qr6sZcpIRO6zLdnW2ZYwGEh60wO2%2Bul1UsA5xzmLHn3vrjBO2AjXY2Bwxezmel9U',
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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=search-btn&javax.faces.partial.execute=search-btn+searchContent&javax.faces.partial.render=search-btn+id_tag_toolbar_view+opDt&search-btn=search-btn&formTemplate=formTemplate&j_idt151_input=2022%2F11%2F26&j_idt155_input=2022%2F12%2F25&kind_focus=&kind_input=ALL&dt_scrollState=0%2C0&javax.faces.ViewState=YYh%2BnBnRcqpfLOvpRnw0byi%2FclPwzDJZOqW434sbN8RjA7dC6G8v63jlMXU5fPXOS7LpWKf8tUhJcy%2BBWp%2FCWm6MQwu6jTlz9jyPVcfk6791xU8BbLwEPSGi2PlEFTlNpWPoHikswUKq%2BNHLP48efgW%2Fcr%2FcLbdBKjK3so48WKciz8nFubf4htsnb4Ww%2FYbMMsWN3Qz39eB0r4Wj5WSsNsdIz58fO0A1ge3%2B28c8L1HQCFMsQcqdVRzx1wS3AV%2BBdrphs8ihRLa4MnFBwB0T80PI87NnenY9QygIpXNqIbNYf8uR5tms1EgCTczaMkgHI0O75NkXbUwM%2FPldDOhoyJw3xbQJSMydiHUEb7Vty6DjK5TNU%2BGGFeX3wrHGLIEJcriXLHHJiOUiqG%2BKX5FAP%2BtRFK3lWO0kap2OU1xD3Q1ZLdqkwIRfdAKQnKcJJGr3ghuh0hKdunYyTuINcqbhKltrEri9fd%2BA7Nb7tyQu3SAvyOP3gAqMrafVJkHVf0o81MCcIKUAJFYLpF2utJL172P1yIYhGzYvorA3ZMmRJO%2FwKIruBGPVfkrYm0rDNPJmvBP8iD%2FpY8oliBaUi32NOBTGVn5c0QYS2hKBSERK3sNx9LOvP5WAtsYl%2BmNtoXM6CD%2FOUgb9N4EiIQVgg2VT5QcYTaNgEqXY%2Fv7RuCLDgRpopDIBCxx8UcCj0s29zKL8uHa7inaTRM3x1GPdemdN%2FosvNuQw3X2vLasSVU38HPmRXrQJq9CrURzxILeHzPtuyzr3BFv5j4MJG4BJfIOSUmKtojZe3yFLjL6AirYxHbBH04Wtgqerg0SEf5TJ0DChoMrHZjN4%2Bbhi0f4kSYtN7zO%2B0Z2ONpat%2FaWE8LLIH6%2FJNiB%2FQqhskmHme7BcVIdapTwB132WWWdTI9kIgKlQLUGV%2FCJ8JgGbXhnIFvN5CXZAjO1Y9GOlByBcGuQxNR%2Bqfh54Fu8yW8Mypt4EaNNd%2FZxCwhWe5Xz540cvma%2B7cZBrUGtRvKaq7olwMxIojgvhE9a%2FJi3DoHbE2vG1FX7Ld6jTKw5Xhv7BcXUIoB6FCbVbHLGIfz%2FQUvm3s73BNm5yNyrWOWho9ENYzvY4yyclG0UM94SXr%2BtRCrOnmiLWJAB2PuWPl8iqtdAD1LtC4tkQu5f1F7XCSK0H7TW56aRDOTJk%2F%2BvqwUPwfqmW14WpuBHOJ74%2BsReK4h%2BQZxaTiBRJVDYc83aXpJxPMjoQqOR9HwUaAuNoPaqsYBpk13VIPls7n0xYpf8908EUJnARp0QiMseY19sTcyf7ozCMp1NpA2OWl05ALuX%2Fhq9qDSJiXEO5LcAZ5q%2FlgkEJr0s3r68nQumM2zGVCQXvlyF730kEpsuWGbRxt23PSjvw0hVJ%2FnHEfMYviSic4BU71%2F6PDj3GdLWIRCSAkX8PZZ%2BAdPOlWqOWjK0LZvZL4VWI2KIo4GP3xar4WYlluqedLpK6dAUIJPEwFio5s%2BlkamP762ZgrDzjvngDUhyan%2FFMo3rmczy4jQtUkumvGuclPMh2Y83W%2B51WmQHxwnDLst1%2FskitdEECDQCH6l0jhMDrgKx8P6XpoQFV5kWh2o9IoY7XV9xbAfTEKai5Bd89gLzD%2BqM%2F00mF7%2FAdw0vwBfCKgMx7Vq1a27E9VBq2gmZl%2BYebBKKE0P%2BLQGofyC4FSOpnl0DSyZhJ90yK3KUyGH4RX%2B6ay0ZNQOrVAMh4a62eocEiL%2B%2FehU5R7hT0lnBwbNXPSU2eY3prMSFOn%2F%2F%2B20LUPHwJTMsjzK%2Fc5nCXH8T1dkaBt74yc%2BooXkmofx78IpOM5DmNt5eO%2FKbxi6zCKbNYG4O8EqH%2BPLHlroxiKCUyB9NVJHBbYcV95lJ5C8vpl0NAbntwwuPRGIH742GPyEeBinvSouZAkeFQjLsRNzTPVPkIUhY8puUe0cJTSbhK8Vf0groQAMKkFQ4xOqJvuZfQol2r5vDnwxkcnDfUD0CzuqWdLsWEb5olOMdS82RNdskqjdNdHyOwBhzYuJgdY38aqULIwN14c0rL6ofxnUKYXe9UAoVCtkf55AH1PiocbvHx6Y%2BdpcZvNS7nRMhQiBojCbvPKciAhdN7Eg38oSPgDLaJEyOgyU5If6Mitj8NtRo3ptEXCR6qx0Oqk82jLv0MYsxuON%2BgGcJE08DRv2PH3dTuFTgb200EAXcRP%2BrHzcMb5N6AKRZ5mw1ZiWnzFJ19OHX1j41uYcdf42xQ5fQFh8BqiSEjqiWQP2lWJ%2Fi96ktcSUeMo7yRAzSudjrisUHbT9jpNYI2yFEQVEktLhf1GzjmITRdY%2F2If3kDnJKqIVeqxQGBQBVCwe%2BB5x7NW%2BSAPZqGF7X9aVBS2CeCf7sRHOWMvwUwTFO8AZeM%2FgYcdftymiY%2FxC8uyiRXTaMOEynqCQbgwyfRSFtuZ4EW6wgbXWKXeDEfQkucfycE99%2BAHy%2B6QANZl92Taua2huA6Opfrk5kC1smcKprhAb419LPNbJma%2B3NXamYz9POTzFtEiFfcU%2BEM9SAohGpExyrZf4HYuAujGtIVwx82WiHLU8ratxKOex8trYZFMk%2F%2BI7HQCKJ7Utw5Vm8HTHO5yFI2MSGo3u7xWlmmL0jZIQre6uL3W297WpLPYqrluPN5%2FNn%2BAD5Zb1SUrVajS0gCLpsEr0x1HjFvVnTCCl8Kb4hLH1oh2KpMqnNHiKp05aDjifkDFd4HvSXyx1%2BQQcMhJHWaWgQAvaapmtOMuTnn9S8EuyN%2FABDiVrifd%2BoJIi95mf6nZW5rXnlJsuDO45baphAsKM%2FAFCsOFVodYgJ7F1LakcDJx0joQR0FL2II9rZjpkz36VKZzW3cHaLNksWF75M50BH9iqoKdhloj5iwwX%2Bs%2FL4kWINexsLX6rbQKRsm6UWY1L9LIGK7AfxNpeKyaZRYZv65qcEC912rp2MdsL5HzfEgqxSIvqmvMBzv5qv%2BmDudY0SomhXV1R5nvb%2FORlBMJuvvWUljQdi4Lc%2B%2BqUIhuWCU0ciQuUUqd%2FbPo6WIMDAC62THxOpUxeVbUc3hVwmLXWsmLNkclamPpc%2FVUf2w9f5KqiNrDD95Cneforcr308DbpYTx3R671%2FwZsjp%2Fobq%2FsarpM3m2Xu7ZyF8aGCUMyqpGYOh749lVz7wkMgc%2FLnYFHS7vo8fhGl2ezjN5r6rUwG85hWpRVNUTguZsaDAwQTXbJKHu3RXu7aOHXGTdMp6ye04FkeQApSQ8S%2BtL3bWSzAQ1Dl6A7Gf5FLTGz7rAOzw6BBN%2FeldxYsvmUErUE60XPeHhjGZGkuI9Es3%2Fsp5Im4GjLm59e6EpAb1pF%2BgJ5TKgTbWRfJ2%2F6X4qlev%2FoRCIUmokpXfiLMCWesFOc2AYNyQan7AA3qMEVWDnJz8VttPeqgiFYdHE1jcaVcj8XVpgE2sHkID7b%2FOUQKq%2BpLITUMGS%2FRb8QD%2BAKMqe90HOn7bbVtwkMThvu2AjFyyEIBU5Rvh%2FNN2%2BCr9eMU2L8V4kXZx4OJw8j%2BjfYP%2FIzXWQ0Qg4WtHgBSMQywDxnXCO%2FOvZNDPD%2BXmYAels8tXPMSJmvU793YCTZ01b8XCcn%2F6B0Kz8gHmIR%2F9HHdi5qcKm%2FRn1yW3tVjVKH6hirM9ViLB73UEY5J%2BqRW%2FvbQWUDxbjyC%2FHDAY7l3ngz74ffMEACpikVG%2FDdOreWELdLpCdQdVUc7ZaUM8tRzpckAz7%2FbEAb99EGvHl98j7vz85F33zrnVxcKvPYrn9Mbq0b0zvapkdv4TvkXJK96euKLeULpy6iaNcZCWfGaJu0ewkDkpWBgFhhWk%2BxhHffSBD%2FjjO0dHAfsMrt6FaYk9ugitRqZ88AsK9qvYDCDmJQQMpXEjWfdD%2BogA9f8KtifNgrWFoT0XQtJjvpUojzlgChw7yxaQwBwExmiC8ttO122H7HgPxcs5DuMQoCnBsEYwJJvbG4KFHWuDo3jCoD1WpZEhCJY%2FedJcCGgQNRzIiunuUtetQdxOQIb5dJ8JdY9Ky8kgRtb228tVH%2BkA%2B7%2FbTB2HITMi88m3yWl1HwzLD%2BzhiZT76fYs5a1IkcK0e4OGXjcwhvmvdMHTkeHtR4ra9EbGSsd%2B%2B%2Bd4DXqbmcwCwaozc9cwNIIXmnZbnAfwui8s6O3YLTfIed%2FQyWK64QdrCDLbu7CUHz4Aud5NbHikLYbz2gi%2B1ciCVfAQavKRDXwqImzaatbw3hwLalVOrWQCE9GQI0NoqqLy8DrvzJllwwua3KEqVLRnOW599IVkK8h1Pk72gJU9eLXBjlPpM39hbrrfPVfpcxXpdPyt%2FIndd%2FAIvS%2B7anY4peZW4qtTZ603EJcvzmf3hgt0M2zJr2GQnjpjBIZku2ROxv0yU%2FGl%2BxmFYNGg7IesOOQyvNiFQvAC5efyLGBGrwULc0BP11ae25YDjF30iU5lotCIrIc9%2B0z4fvRxZujSKsZ1s83xTRoIxSwWF8v7TjQ92SBFYRGU%2FCb%2FMtlAA06owJJaW18wHWXguXfF44XGxvJltiSVzxVB%2BEsMSZbxywPpQEJY2p8uYI%2B9RkyuKuqrySb4YL5YIZyD%2Bmtco51945k2kJ5GPsG4uqH1ZlTeFV3%2FP%2F6T0qSTkUgYswG6edggej3pEUZlchHb5%2Fhpxoysu1V91uXcEW1j8LQhC%2FIGSUVfL1JxcSJyORbkQcDkrPZhBdDgd%2FW2CR9lbo9XvXZRm%2Bdp5tyEDnbxm4%2F9CrE%2B%2BJURm8s95XLGDZ1kgM5u%2BXF4WZ%2BV7DtLir0%2BXyMHaJP%2FV7BNBxaBs5WM79DplmypNtonbIpCzV7vnPZDi2s0RgPcwzPUkszh5wzlRWa%2BeWn6F5GiyUYgQRLGHfiAIG7wem%2FJQSOF8dgt%2BIXD%2Bqsj3SU1cc36SXvFFUQof%2F2gdEq7lqzSvW8XRFvEUr58jMOFrh8T26Wp%2FGtgw2jENH4sIjij5YWQ1kqy5Zv7RsQaddzdGSI61bHNjY04Cdx6kpa5YCOsbYS0%2BsYAiVeKOMK7RqTwz%2B3HKH0BZApJmUJK2B2%2FEaeIuLMfZS86hxNFxhc5LedDd6DBX9aQLt0dANNdYmzH%2Ft8lFvV4BXB%2BfmULAoQ98eYgiieO2nolHOgR%2BjVsrUoQhKaevEQUs4592gpJ037efFGxSJxSso1LoYY3UE5GPI%2BK0ZgWsziMpYYwlxxFXmYZeO4EmbhjuYsxXUkk92jhe%2BDd%2FYS%2FaysdYDsV1s01TnA1qWJ7mR3XNruVPmWoJ9NOjGa%2FaYlCBDqPkdvVQpqyuiF%2FrS6Yt9%2FDlVpMM1xbReXg5OWXrwmOS6pytSHPW4v6ucv7j11fj2sHzjV4AIPJEIp%2BLJRCZNTxz9OhAka01MIfYf7oJwW8lO4OBYdRhPICEiyIsTnb48cpS4dSZhVnwsylcFuhZjOA9Ys7fdilWCsZBjJYcZ0nUoSqc0Qp7QyjLZfYILnJIhvDlCgjG0NKZ3ho%2BU5hnpmjbB8Kjaj5dy%2FB755J%2BKYXtHfRtnWXjNm%2F%2BrkRHTFDosQRCsjkYu2q4WWeSW09q2mviOrsmPGXf4OzhOJpMDHhCkyI%2By55dwObRMZqjQUEHBiqqFSreWPJN7vRj76VZ2lTgLzX7EaDnBrFtKOlRq7mLCsrgwTWZ%2F2xQLV8RRbnmnYFExwfJf%2BSOlednWBcevEPY3%2FTKUHoy4dGoDReN%2Bfm8qpFQxOpERXRxaJYmdsuCUgvvP8kSclKB7D%2Ftj7cxEhO8oKCSdfTXfN2bLPDwI1GGcGH1TGomGmrBOAzmyXwJzzWhos%2BXjxfJlGMkEvBIitNK1E4MWpCNHLgN3rDuC2B0l1to0M7mFwXL2Uohvh7neyokxN3q%2FRBHyQeot%2FDsz6jo5zDvqBUigpYQ4CE784COhPHiDvfnZ2FDjzNO%2FP%2BsZPw5B0r3%2BTpnic2vLMV3RejFOWSzsSqljDmr%2BosMMFogmucird7qzw21Ak1II%2BRiXohCSIMS4kIe%2BvsJIAHXSmA4diMA80rJttYIqM%2B8H4DXU3ZGsnVN0M1cBfOSexfHswIpLMlTB5cUSjG%2FrrIsKAmnmt1FDwz%2FRp0Tb6VZOP2zhwAc75sE6wZEiPTNHco3IqCVqJN7fUNzNKc7c9ve12BGdxlEFWSqtIQ3DzF8ATIlJwbE7GAtHaISQfXm%2F3%2FeMCm%2FR0MtV4YqBk1K27BKQWKvyyPdIEHrpGvOzwXGqnLu1qXCIrroCJzAwIA9vOKwX7VMPlS9SutiRHjh48lKuEKPdDhjCRxQCf3kN1VmOPz6KJrBiK%2BnR28SmyrXHzzLpy9qFRIaWJAq2hThRZAb2UDoKeWBQ8y8PfnTC32maG%2F27xKahV6YufVNqwSW7sa4Dnj89Fh6uM9fMhNhK7M986gDf7bAnaeotRYS%2B0q2686bsgjVWQA51TwbOo6ANT2QLUz%2FoZOPkkN5OYjN6HPJg1pcNmFHHgxwDjGMn7BuELIg7nah6KC8MNtWtbWdTjXPIx%2FzIjyOBZPjTx3dUWhZ9nY4FCUDvuQmIPx%2Bz0ZJadYYqJtnctuCkUXQ9YBrweHug3SCHUQKlJhsk4Q2y%2Bwf1For3Q%2FLqifo%2FzOAarSKH1AJE21ebDMs9X9VTbu%2F1WiYcsP6t%2BLEDhfpCwZ%2F9GB7Zosp%2B2G7E7Xvo8oBIGXAXluX2dPjJ4%2BcQD%2B52Ht6jXQXuRlbW9Tm%2FK1NXnL%2BWkvU9gwky1iMX9Ud4SPSo3OIxvreaB2o990uVM4o7W9PsxUzF%2B5CNBFGA%2FtIY8UiCG3dsNDI%2FzPmmoY28nUvWtArhw1NxZepi%2BV2B5Yn7O64wjbtfcl2HfyLGDgX6shEokb8r5meY5aASLC1Ily6OC37qMoEf6mZKbgvCp3YthbkuTAIrMVeXnUXzeD%2FS4HTRckzgpTBp4f5kVWNPE11G38xBBXVpZ9rjuLXxuSZkrOW10%3D'.replace(
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
        'v3.0.0(20221202) 顯示請假資訊',
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
