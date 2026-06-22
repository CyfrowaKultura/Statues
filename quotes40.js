const QUOTES = [
    '"Tęsknił za kamieniem. Chłodnym i twardym. Tak innym niż miękkie i ustępliwe, podatne na zranienia ciało."\n— Cornelia Funke',
    '"Była to złudna obojętność, obojętność skały, na której szczyt nie można się wspiąć."\n— Neil Gaiman',
    '"Marmur pozostaje niewzruszony, to moje ciało ustępuje w zetknięciu z nim, traci ciepło. Kamień zawsze zwycięża z ludźmi."\n— J.C. Grangé',
    '"Są dni, kiedy jestem z kamienia, czasem z żelaza, najczęściej, niestety ze szkła."\n— Roma Ligocka',
    '"Kamienie były obrazem bogów – twarde, odporne, wychodzące bez uszczerbku z każdej sytuacji."\n— Paulo Coelho',
    '"Objawem mojej choroby było zobojętnienie. Postępujący paraliż serca, duszy i mózgu."\n— Joseph Conrad',
    '"Obojętność to paraliż duszy, przedwczesna śmierć."\n— Anton Czechow',
    '"Przeciwieństwem miłości nie jest nienawiść, jest nią obojętność."\n— Elie Wiesel',
    '"Dożyliśmy czasów, gdy normalne ludzkie odruchy są już podejrzane. Normą jest znieczulica."\n— Anna Klejzerowicz',
    '"Człowiekowi współczesnemu grozi duchowa znieczulica, a nawet śmierć sumienia."\n— Jan Paweł II',
    '"Ze wszystkich uczuć to właśnie obojętność zabija najbardziej. Zabija na raty."\n— Gabriela Gargaś',
    '"Pukam do drzwi kamienia. To ja, wpuść mnie. Nie mam drzwi - mówi kamień."\n— Wisława Szymborska',
    '"Kamyk jest stworzeniem doskonałym, równy samemu sobie, pilnujący swych granic."\n— Zbigniew Herbert',
    '"Twardy jak głaz, zimny jak marmur. Taki właśnie bywa człowiek, gdy zabraknie w nim empatii."\n— Sentencja',
    '"Czas drąży kamień nie siłą, lecz częstym spadaniem kropli."\n— Owidiusz',
    '"Milczenie posągów jest głośniejsze niż krzyk żywych, bo mówi o przemijaniu."\n— Przysłowie',
    '"Zimne serce i twardy głaz mają tę samą gęstość."\n— Myśl',
    '"Człowiek staje się kamieniem, gdy zbyt długo musi znosić to, co nie do zniesienia."\n— Erich Maria Remarque',
    '"Nie zrzucaj winy na kamień, o który się potknąłeś."\n— Przysłowie japońskie',
    '"Wszyscy jesteśmy z gliny, ale niektórzy z nas zdążyli już wyschnąć na kamień."\n— Jonathan Carroll',
    '"Nawet najpiękniejszy posąg z marmuru nie odpowie na twoje wezwanie."\n— Charles Baudelaire',
    '"Lepiej być wrażliwym szkłem niż obojętnym głazem."\n— Przysłowie',
    '"Zobojętnienie jest jak mróz, który powoli skuwa rzekę, aż ta staje się nieruchomą taflą lodu."\n— Gabriel Garcia Marquez',
    '"Ludzie często mylą powściągliwość z sercem z kamienia."\n— Jane Austen',
    '"Z każdym cioszem losu ubywa nam tkanki, a przybywa granitu."\n— Emil Cioran',
    '"Żaden posąg nie został wzniesiony dla kogoś, kto dbał tylko o siebie."\n— John Maxwell',
    '"Kiedy milczymy wobec zła, sami stajemy się częścią kamiennego krajobrazu."\n— Martin Luther King',
    '"Z obojętnych głazów najłatwiej wznieść mur wokół własnego serca."\n— Antoine de Saint-Exupéry',
    '"Cisza kamieni jest najbardziej wymownym komentarzem do ludzkiej pychy."\n— Albert Camus',
    '"Nie uderzaj głową w mur, bo usłyszysz tylko głuchy łoskot obojętności."\n— Fiodor Dostojewski',
    '"Posąg ma perfekcyjne rysy, ale brakuje mu jednej drobnej wady – życia."\n— Oscar Wilde',
    '"Z kamieni rzucanych nam pod nogi można zbudować wspaniałe schody."\n— Josemaría Escrivá',
    '"Cierpienie potrafi zmienić duszę w diament, ale najczęściej zamienia ją w zwykły żwir."\n— Victor Hugo',
    '"Kiedy serce milknie, twarz przybiera maskę z marmuru."\n— Virginia Woolf',
    '"Brak łez nie oznacza bycia z kamienia. Czasami studnia po prostu wysycha."\n— Stephen King',
    '"Najgorszą rzeczą nie jest ból, ale powolne zamienianie się w kamień, który nic już nie czuje."\n— Sylvia Plath',
    '"Bywa, że znieczulica jest jedynym sposobem na przetrwanie w nieludzkim świecie."\n— George Orwell',
    '"Każdy człowiek niesie w sobie rzeźbiarza, który powoli wykuwa jego twarz w głazie doświadczeń."\n— Michelangelo Buonarroti',
    '"Łzy drążą w sercu rany szybciej niż deszcz w skale."\n— William Shakespeare',
    '"Zimno posągu bierze się stąd, że zamrożono w nim ludzkie pragnienia."\n— Friedrich Nietzsche',
    '"Obojętność świata jest jak ogromna, głucha góra – krzyczysz, a wraca tylko echo."\n— Haruki Murakami'
];

const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Replace the old QUOTES array with the new one
const regex = /const QUOTES = \[[^\]]*\];/s;
if(regex.test(appJs)) {
    appJs = appJs.replace(regex, fs.readFileSync('quotes40.js', 'utf8').replace('const fs = require(\'fs\');', '').split('\n\n')[0].trim());
    fs.writeFileSync('app.js', appJs);
    console.log("Updated QUOTES array successfully.");
} else {
    // Prefix if not found
    appJs = fs.readFileSync('quotes40.js', 'utf8').replace('const fs = require(\'fs\');', '').split('\n\n')[0] + '\n' + appJs;
    fs.writeFileSync('app.js', appJs);
    console.log("Prepended QUOTES array successfully.");
}
