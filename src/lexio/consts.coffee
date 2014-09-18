Lexio = 
    MONTH_ROOTS : [
        "янв"
        "февр"
        "март"
        "апрел"
        "май"
        "июн"
        "июл"
        "август"
        "сентябр"
        "октябр"
        "ноябр"
        "декабр"
    ]
    # normallizzations
    RU_NORMALIZERS :
        [
            {
                re: /^(.+)([ие]р)(.*)$/
                patches: ["р"]
            }
            {
                re: /^(.+)(оро)(.+)$/
                patches: ["ра"]
            }
            {
                re: /^(.+)(оло)(.+)$/
                patches: ["ла"]
            }
            {
                re: /^(.+)(ере)(.+)$/
                patches: ["ре"]
            }
            {
                re: /^(.+)([цч])$/
                patches: [
                    "к"
                    "т"
                ]
            }
            {
                re: /^(.+)(ец|ч)$/
                patches: ["ц"]
            }
            {
                re: /^(.+)(е)г$/
                patches: [""]
            }
            {
                re: /^(.+)(ш)$/
                patches: [
                    "х"
                    "с"
                ]
            }
            {
                re: /^(.+)(ж)$/
                patches: [
                    "д"
                    "з"
                    "г"
                ]
            }
            {
                re: /^(.+)(з)$/
                patches: ["г"]
            }
            {
                re: /^(.+)(щ)$/
                patches: [
                    "ст"
                    "т"
                ]
            }
            {
                re: /^(.+)(жд)$/
                patches: [
                    "д"
                    "ж"
                ]
            }
        ]
        
    MEASURES :
        "%":
            measure: "%"

        "руб":
            measure: "RUB"

        "рубл":
            measure: "RUB"

        "лет":
            measure: "age"

        "комнат":
            measure: "root"

        "баз_велич":
            measure: "BY-Base"

        "час":
            measure: "hour"

        "долл":
            measure: "USD"

        "у_е":
            measure: "USD"

        "уе":
            measure: "USD"

        usd:
            measure: "USD"

        "м":
            measure: "m"

        "км":
            measure: "km"

        "мм":
            measure: "mm"

        "кв_м":
            measure: "m"
            measureSpec: "2"

        "куб_м":
            measure: "m"
            measureSpec: "3"

    FLEXIES :
        "х":
            flexie: "х"

        "ий":
            flexie: "й"

        "й":
            flexie: "й"

        "ый":
            flexie: "й"

        "ой":
            flexie: "й"

        "го":
            flexie: "го"

        "м":
            flexie: "м"

        "ом":
            flexie: "м"

        "ым":
            flexie: "м"

    PREFIXES :
        br:
            measure: "BRB"

        rub:
            measure: "RUR"

        usd:
            measure: "USD"

    FACTORS :
        "000":
            factor: 1000

        "тыс":
            factor: 1000

        "тысяч":
            factor: 1000

        "млн":
            factor: 1000000

        "миллионов":
            factor: 1000000

        "млрд":
            factor: 1000000000

        "миллиардов":
            factor: 1000000000

        "трлн":
            factor: 1000000000000

        "триллионов":
            factor: 1000000000000
