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
        body: 'javax.faces.partial.ajax=true&javax.faces.source=new-btn&javax.faces.partial.execute=new-btn&javax.faces.partial.render=new-btn+id_tag_toolbar_view+containter&new-btn=new-btn&formTemplate=formTemplate&j_idt154_input=2022%2F09%2F26&j_idt158_input=2022%2F10%2F25&j_idt166_focus=&j_idt166_input=&j_idt170_focus=&j_idt170_input=&j_idt179_focus=&j_idt179_input=0&aply-data-tb%3Aj_idt193%3Afilter=&aply-data-tb%3Aj_idt195%3Afilter=&aply-data-tb%3Aj_idt197%3Afilter=&aply-data-tb%3Aj_idt199%3Afilter=&aply-data-tb%3Aj_idt202%3Afilter=&aply-data-tb%3Aj_idt204%3Afilter=&aply-data-tb%3Aj_idt206%3Afilter=&aply-data-tb%3Aj_idt208%3Afilter=&aply-data-tb%3Aj_idt210%3Afilter=&aply-data-tb%3Aj_idt215_focus=&aply-data-tb%3Aj_idt215_input=&aply-data-tb%3Aj_idt219%3Afilter=&aply-data-tb%3Aj_idt222_focus=&aply-data-tb%3Aj_idt222_input=&aply-data-tb%3Aj_idt227_focus=&aply-data-tb%3Aj_idt227_input=&aply-data-tb%3Aj_idt232_focus=&aply-data-tb%3Aj_idt232_input=&aply-data-tb_selection=&aply-data-tb_scrollState=0%2C0&j_idt672%3Adlg-leave-aply-vac-table%3Aj_idt676%3Afilter=&j_idt672%3Adlg-leave-aply-vac-table_selection=&j_idt672%3Adlg-leave-aply-vac-table_scrollState=0%2C0&j_idt729=&j_idt734%3Aj_idt744=&javax.faces.ViewState=LJ7u84KpZQPllKjTVmVz2tow1huBJojCn6n3vNq1dt8g50PKX5IkA6TjTn1xqDV5ukx593lnkQcsbYMTg%2BbAWZ%2F5NiqjHr5xqM01zLhncCP13ie9A1CODZOkJKFbMq9eNnZ2yhdY%2FMbDCKq%2FiihTXD%2By7tUbqKEYaz97Xdz5DiUg5BvWRZypURRUG5MnBDgzM%2F%2Ft2TVV%2FujJ5nCxjKS6Zyw4phUMVLd29WaQZiPtG1cZX6UcrSONHj%2FmHZ7WM3XccBjwFHvCLvL12OJueEgU%2FvdPMbrvd4vvCsJonCKlak31rtp3dSQOG5cABdDRLrDLeKD7TqoxayB7SZHewZ%2BYK739W%2F6cBQVaI3T816AfpNAeaEpZLA4Dn0qbqcLE%2FusP4DeMjKZeqptL%2FeGtCdSDKOnY8evLRwdd0MTSpx2JWInvrIwQlpVDI8Z4WzWIdyYA4krxMVGcqnNJ41ffDuRCc8Xiey4nlN8voktGgmpwavV7I1H%2Fz7M5dYR%2FTW%2B0OqdfoV9gXDAwvoXLLVERloo8DmCi3iWrFWz2sqsh5GMjanC9bGfHnWRfD6HzXHb%2Fhii5nA656Ydtd%2FLCggeRPSOyn3vvyLGsileqH%2BPHCm5zsMC%2B0srMHxXCyJUwT6jpJyEU%2Bs%2BTsjZhNYhZoUOHxaqbkYVCsAfOJ6MuWvSNQdB1Z00BdYxwlRQwxx9FXgNaI19r%2BlKWHjllzXEFa1ZwcuF7Q%2BdHnXh1up6fee70XB3DaltJxeOOmBu2Oak3bpFgRfDA3f80SX97btRm2Z2NF6fv4U4bo7FdcPxlS3otWwDPuGNhiGb2NWRMeDio79771H3HPuTvQaaj9q5YLU1aDSEXIzgZqPkN3EZvDyLvt%2F4sj55HhtU%2FCM5QvGujLcpu9vZb2rm4%2BUKwXohHwq9T28sVQ9mVgnMj%2F3xe4Vf6PnHff0yZ%2Fb2wYmdpYa5MzJVQj0IeF2maSVe4wXH15WZKW3oY6dYLMr5w%2B9mJ7IkN3caQOtnIuQ%2FPjlLv6vjHwP9SrBks4FNvy9IZ8HdUEd12d0bqnKapldD3sKlcwlHFANLMi4keJ8Q29gSVLyA9UNmGkV9iF7iwzfkuHhJWxOlK4txKIXBOIcNLkpMJSEBEmSwSXdv01OhwIloWSeHsKN2%2FISWg6YWNMVJWcLv8YzfM%2FeKj0Hye7KNkQwNrRd7BW9oOL69sWLMXjj7LKoFqbEhVB0aFc76pssFo1Z%2FNI9HjoXbCI4x5CxYbh3t6RHE21R9NkAgUs7Bsioh3HjZ6hYhc0WTNOvdTvdRsCxoQjjGd7YV2gsxXL6xK1HD%2FbgH2yCOKShkaWo1baNYmzdWXY1cdXi5AlGof5Lb3m09pUc8T6vN5F%2B6wrUTMuBCdFSMII%2BI9jyFleOVKkLnWKjZcc9mwoDRpBrz5bGUdegz%2Fzgov0h24f2mj1jRXonLtW%2BnM2bWojDp9vT2C%2BtpzaqgEep7ALMYsRzYy4qgdHJJosotRSg2nUa2LqQKBLLYWstCUhuVPqHrRF7jIETxy82zvyWQxBZ0WQp0Vyz%2BASH2PmV31fm2iEe%2B3cKn5AVUmp0pH5nUYhl968mwZstODVeawfWXKS7E%2BWqJA1xUACnqTOsxBJ8QF5DNsYj0EWmb6HXVvv7kwM9jJv%2F82L9jsBTKGPLGZoLmJ2oEsNQa78unrniXqszjZrb3O4NVlZWxUzhdnW4CaF%2BpQS%2FqMXEJ9n%2FJlXxFsc0yBve4sOYCD5tV2WKF92iH091UTiZqpNqEeqvGeFmf16xzK0Wmrg%2BLmialg3cGL8cp96kXK4HU%2FyVuQQzFaoYa3t9szIZKg%2BpFS4tS4nztYB89gQvuDEr2%2BEKYyO5Ibv5cK1tVv7s1tDT6MHEop6kBg1hdImVVgafOjSJVeysM6ErUO%2Bndz1K0%2FZIaRHiLx%2BusEi3ZOO8dewoPqLigGMzxwwlgPg6m18qPLIiCfaR0JDBfmn9PjxVRR%2Bj5FVdehyDf%2B91cI6USpk%2F3ySQMot6frnSAzTZKf9iTJTePa64P6NdGvCnlTl0DGjnhErZYLHE%2F8nvYRaABX2l1iHRpYWM%2FcdVVVJHdr8tGo0635G9IPGupdcjOEWE8EgzOGbh8Awbu1K%2Fe2mRvghr%2BHOLm3mDItT1DkYIv%2FtkpLM6dDd29Yqpn0ttTbxvWq5jPIiaxDwCYBRQoJqCMjStlxgwi5owUjACgLM1vG1cjBJKH%2FyYQzwNVr6QHc4Tgj%2BYgQyob3oI%2B8JHS7fvPAw6ViZxI3EaDU4HH1xlwhdJt8BHF%2Ff%2BGohuuQCWWzxlaPfCydAT4X9uAnxeK044ZzbpKNnZMvItlDkKh0fPIgxTf7bYxOeHmil0XKZWeybGW5aApAKc12p8AYUEqxrnySh5g%2F65PHf%2BCR%2BEAh9Wdbyi%2FQnycIpMimtPslFUphwjP%2FvUNiwumgLPQ7gF9CUTAe9S1lr%2BGAq9TaGl4KO2w564kJ8EOGpC4Q9bC%2BUADtrM9hIn8PdBqFdI0UyKrqzNY0P6sq3AsViGedJaLKJEudJAMaeCG4EGi6MF4CnYTpE3eCxe%2FbMEOJE8StGbeIzGW4ay5NTFC1PBt2abSA%2BYYOQE43xPXoiaGV%2BKg0v%2FQy00C%2F6H0UJDeDlQ68WVE0NuW7VeZd23GFXoJ3maTxqxqAd9zwAec%2BDb%2BsVlvyIQrB8XYcMtqi0xuWGXz8S9XrlffifrEdpsgXMmbC%2FTwsK6RPzfxvQ3fnwKNx1U1hTcxfWDUzgOrBnIv3%2FfQCy6nvA15jvD73UU%2FafFi41HlEn1qB7urifiMZLIvFSOmGMy%2BBCFCY0odw5s7SJsXUM0kU22EIH%2FsCDuz36iWc77SSI%2BU0c27OX4J000ks2eu%2FBsuR%2FSCIOhUGoerDiW21p3ePyEfkngTS9kdMNxT2jx09iFRhp8Th3ksshm%2F4K18Z2DeFU8vvvjLuwBm6KCeO6rvX1j9DFLXs68xtBOoAB0yjH8QLeZxGEKV8o5h4R%2FN%2B4Gk4wqX0fKt%2BkU65AKX%2BycPaZBoXHfrYgb1i198LnlXXYYeFs5GgxShzNkizgPVO1u%2Ft6AKDhm%2Bvp0UY1bUE4jHcNbzolx5%2Bf7TYD%2F9TG6h%2BwZPqbQiQJXeuomxBe3LAj%2FR8QoapABdlVS1XTDig%2Bebdd0wTcQ%2BIE%2FlxGnB4ky%2BE0Jr7jI29w9iYJFbNZZ49Kr7PpPFBwYgLkLKqjabJY2W3%2FBlCac5wKbp54ajUuBOJ0LMMJWFjY4B8xrBMJgYJ4OrOyaucKgraciuPbDOR474HnOv93zSFfMjTQf2BdAT7JCCxiF81SJRQuZ0XRTBczIMShRs7DjTbkYaMFB3RnSOvhkYr6eQX83%2BPmEFJF83UWO8E7WCmFRWfcpMlmVPvk%2BR7sPH8vepc1Q4RW0WAxac3tZV7t0d%2BVVDXM6%2B%2B2CYLHU6uaBFicXXpEzhP4y7us5nQm12L9S0QXiTl5CaYe%2FeT2EQ4U81fVyJ1VmTf3Ae7a%2FDIhs8UWMI22GhBHaUsgMmoxnA6OOW%2BW%2B6ihlRCtC2Kl5Pu1Uwfkf84OEAxJATujs4KwKfaLFjYA0JE3IyqjC2%2B1Uvl%2B7i%2BhSB3MWwHLJG0Noz9WmKvAXG7W2E96x8t2aaCai6BCQ%2BHfx2FL00%2FPrOoyclkOUwnz8qWUX1aQZHoDcWkgGHKdgZgGR400yk%2BO%2BVpY4kDblcbJ%2BJ5vTX40LgWXEMubXB%2FV4r%2F7LD5EXnL8WeXbWp1MZvKevxduYNfLFlhWaVDlbbfC%2BEXYY6PLh3LCA20Wd5M8WwvVOkAyV1RZeA52z6Ey0%2FpR4PXEm%2BvsLDBvW1j9BGp60CmnPloZkIRMmKEJGOv1PlNjRme2Pdo9Bw1zSUzr58OUhduj%2FX09yrGSwHqFwIvacwAbYkNhbK5OdhfTLCSQozcD%2Fcox80slt0%2BDyrSWqgQxIMYLg7yLTqtuQ%2BAVrJHCu%2Fzs6vP5qblYTnOqwdqYxqQcAZ7nkWXl6blPazlubNnE59%2F3YmqSIsrHg9A3eVd0hlIgbVU4aAqWYXAhaErVB1b4Mqe9PZ51rnrqK%2F8d1oX%2FREsM3AsZB6YY9oTdbWKGb1t%2FqhmsLiKUHciGFJWwmfwtpUzX1iuITt60eJawp3qxOsg4y1HK7G5T2h7zPnCZi47f8b8TTMGUfYOKkii%2BPOFlL%2F7PSXZZrp3BcPTs3tVRbjKTdT8sXxo3W8i385zbo7HTCHcOnboQs4MzjBi3fLoDiUfAXycpddTgcDFPBuEbGDjFnyOHkuWagQiiaawFO2sj%2Bvgw31MhYF1jKNTUVYOux3Kc660hnpNenRsSQunzqDdbo0mHXYNW3Htklue7M0%2FAzWX3%2B4mAil5D2fD8rUMTheoCX%2FEVT9sUgoqIqLU3%2BXX8Ai6ZehPwosBMwDIyG5AbbEOstnOhv7RNaHNpY8%2BldUQSo4PfBZysVwcfLr8czzG5cPs3JbnzkNPSc9yk64uAOE701RPPba4FN2o%2B0CW4YHKr%2BVXs%2F70Vqc2k3lUxxPlIVCWsO8MnROS2QDSmVfzfxc1twzdBX%2FmSClphz%2FoHGNxOwbDSQpGRGh7C1XCfOsXoi8A24UMBGyB7FoTSGMoslb%2BKTMELtbfw5XTeGEQmVMCcvQkHbBcs%2FrS3fOYBzhenjWoMI%2Bv8mPErBxTGxvGrm5%2FUnYq1wQT7Z7mSK%2BW3G0bk1v0D0sP%2F0nL6pbHGVglKPNnkJQPzCR4GvGItv0KQ2fFMDYSZUs5RsaIH963sXIEGlejp0CyQdZMNhgWPMa4f6C2r%2BwZvmPzjKakepyI375MKNQM%2Bs%2B1uf2QVmtOx5KR%2BBnN0ptQt7NYHv6QqnR4m7fphbvavG95xjWfSJ15e3z%2Fd5ra0RYoOUOPkPaWQlAyihcwRWdmua55CbBYeP8zaokiWi5Xiu%2BVqiuYybRhlXGFReYP%2BiNBUuvdWXbs7qMNricA41Ikyu6O891yxvF2Y2RDHZnu33OvDpMfPe%2Bv4uiSfslDuTanN3Nhm50TtOyoIpYn9EG2QsPiF42Q7PVjDx7twCQFtlUpjELTDckDUC9PzFb%2BvJlKpZBwfU%2Br6QdRPXMfv5O8LX7ylCyxfn7vkBHLjc5Rz8dneGhLsIxINim%2FL0IeKEOPfg%2FajbOSbNgyrAEhdiAsh0%2FKtSnrXpEHKenXIfyYkeBo8YAvn%2BI2H5j4VEzZu3a7GJbxfyL8U6j4EenJipMmDs9zeDRZCZMVuYrf1WZz%2F0nFVKPRGXd99amlzjoKLbdUigvHgVA4D%2BhkH0ZOj%2BFpHo9BX5qBCJbJ8NXjYPK7cr4cdM5kQiLK%2BAUPXd5ZAw8cgCdJZfKUAHzQp6zOun8%2BggVh03%2B3aUVPY6q4daa5cLHpLKOtXUj2pcD1fi1bKvnoveE2QnpfO8BHn95JKcfWw4Bd8HNAmU%2BCH2TBtnAyhugw7ezwEg2tsEUwjBZ3W0rl4N91CYFMGCDg7WvxxZNUN%2B2uEQc%2FFQhb%2FafsI9ZoNM7l7%2FMMAQFG4bZNSfXATqEnCGH2m2XieFbLzxSQ8cDAiAADiQXzryFIW%2FjnZhZhT%2FZdTeEfpn8Tc9n1pZ9tj%2FjMdTvZXwvFKwy47hXaEut2ID6JSHSZUrPNExDKMsQXbqo0xUjlDUeD42fuLXgTwOFcR%2F4EKoWhbZIfsyYOKLYgZE1MY1FO15NoZaFcmmq8kbJn7FYKwHew3SZ0TddzK7TI2871d1HJNmJRPN7cs2f1FvcNN9b1sUc6DzjGkRno5CUX%2FbMlb6Ljs4HtKStb%2BM%2Bw7RbCS%2B%2F67PdpnDcCtBt69dPW3QrCvwNo1WoMv%2BmwQ%2FkYhEX5TiN5p3SPsI8yx%2B7kaJBnR%2BZCS5ZzwfU4Zz1Kou5v8JBxY9v5Of6KPOXm1%2F2eT4gU%2BvG906loxjPoGYIRMND%2FuG5%2FRXodbUQnLYXSUBMfWlvxS6zKbUGIYJsr66lZUwrDJYBXRHKhGOo5uhbHA7Gnk94TAyiMeRZ9gngGOGKxvdAWTC2tE7bc4ujHrx4RJNN9uf1jUGgZYMi7aGuoZS7pV%2FZPmvrCLULgKTWprGox%2FbQ4I4PNOdFa66e2HkhWN829xqGGKeT6FLidsAaBFi06jyrXW7tgGFwUcQ5hSZe2cV%2Bs2%2FsetdZ2j9HU5MwMHc1vCSKHw1lCV9jTs4q3bmZEH%2BN%2FhmYjOtao%2BIr0bCFHlIDDkjvLMbSEgo%2F2zx1GUyFsGccCdHVBEoZgDwuNZCaDyWPZzaIehev0UKRsQIe25Ergtdh7e0nRvIoKnJ4%2BSKEZngQiDc3xu199E%2BEV53gZrX66djum5yI9YNaXmtPdVYPg4CrKbxNOAA7k5tey%2BYpuLcOG0cEjiWs%2B%2Fi6p4hzco9hq6thCjefZLfZISSv%2Fe1cs0BfKloFerFy3RV1uUG4ZFJ6FbrnwmEu0Rrf8SrNP7zDcokSyWaeHxDI2s35xOa6aHjHyxW0ZBvnaN2E2PP29%2Fl%2Bsq4xgwYcxuibHdaaDi0z4r8%2FWzMwkml%2BQS5PPOGc44AcYxDiAiu16eL1ih6E%2FA3RV4PmseFXs%2FAFvMwvx8m9JcBUafNWg%2BgE0I%2F%2F%2BhrSA%2BT52ykWBAtt7kL0TT8Tmf7zIOw1gDs1%2FsGroooDi4fuwai8ueyVRmW2OWLlf23hd9lDnJY1fxGRxls62DBBP%2FED2WQ0AQ5hHxS2E6fGTTH77369cqzhxTH9ERIZBUtaGIGzSzXjias9f4Dg0qlTIx4YioScvlDa9MbXPFbHFAi0qx%2F2tXn1UPS51JbFYAWIut6HEFeiBUq%2FeC9%2F0tnwXA2Cf%2FeMzny1XvR%2BSIxavV%2FRIfMKa8Zh8cx139aSivdGB9bDaAuDz9Yq8e8grECwTeR1Bn3FLc6UEEHy0oY1auI3lRyg3%2FnYT7j1d430f0JEwxPO%2B9gpMxeTHW0IJQWlUpSrbB2PDswcP0y8Eir8ZSd58xbKIYwd8HWV3em02rG4EU7VQTXn1Tec1itMR4qZaWqAKr54Dde6cV3bGf1VQO2NNBqTRU%2BSBHp9IuER1zoFcLxfMKboLd%2B0t2RC7GBGKbIKk2owMRb2BrNvtl4qUZ3xHegBDeRkeNjQwSwArr2%2FFqYRBORS4ttseDoKFJ3h%2FzLcWqJKqDg%2FW2%2FLONetDTDJ4zR%2FqXDp1pXPUkYNPQPvH7T%2FL1Je4JSgeWnpQ8Z%2BPjVBGwiIavzOFcVgIhCaS4q3f%2Brb8KX8btUVrsgMdIGWY%2FgmYUhHzMMzDujRLroEb25p%2F%2B2bcm057bkQgfUlACOVCy%2Bc3iMxlFpUSUqFZEkHsdnoc%2BZ7svCRW8%2F3qYE0h8rJcvWfpdy9gis9CPlMwHvrI2u2Hr1NbiWh3rxxYFUrzOdi5LMr5Shl%2FuIeVQQojwPrfmH084l2H71UdE1zIYR2EGbrhWYh9HGIYKaK1fnX8r%2F8vkDwRPTOPpolFsSAURSolCQF%2FAwEIxlMfM5nyNENnLuqM81d2DvykxdGonQIaX88JEwMY5wcM7I78rva9OPOsvS9Masdr8aXC4Jgkb6WNqI817BAJ7sLWnEaVUgr9S9TOP2lyxdXvFOcFPNDAyq11ARe1E2xIAh4umjqfZ8KO1nyzJokOeOkqML1c%2FMvTAegIxqQLZwkRx1Qn1oHL74HYR5UziXk%2F7IV5oH0%2FHDs0vlJgS673DiPDY9%2BKew7%2B0AzqzKrvTAs3lhpu00qRiqyUZuYItzf%2BUyrykaqAKZvlWFDzsM%2Br01JnQFKuRoVP9xizk50EmnSwAlqBz13ZM3eg8DlNI3Ml2mS9dwuqHryL63q1JbOeN7LoWQISNaenxxB%2BDe4KIlETvzvuYtgDzbd7q7zo0x85oOT2WvAbLHiY5ymIjrCBdkvXDmHN7JFfyUaLDNKIO6mMfhTYEPgjFwJm%2BRz0xNRmZZYGc%2BAhA4jgmGjsHtn2h8PwfIYK4ZMpF9D8YxJI%2F24v2RNsmxpUZaHaka4VJclvM9jyhcYn0fgP1yH3jDFhWRkZhzAswVuc0dOugMCVUa7bLZNn7nEkbmR30IV8xMqrGT75yJrPJsntV68H1wxhY4j2ZIcfbKS3mFoE4vcCHX7k5KiiI2tQ288lrAJufC4e6FdMFoZAw3xn%2BFZL8ggGKAKJ7vHOG2Axi9eZj9EEAhTSYIQrtzkDZ0fxojd0ln87amWlSyBq9j%2FLhqgJQdf%2F9pbeO7F7ksrvhu4Yu478SUBSjfFajdeNhUOACXHe9aOQ26IqtvkJMuT7a7mfn%2F%2B%2Byk1TKUjWjqt%2FoKqsLvHZM75l0inzTj5rpTVa9N4AHYLsJ2xedu8ex%2FEOFD%2Fi',
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
