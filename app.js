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
const container = document.getElementById('scene-container');
const camera = document.getElementById('camera');

// AUDIO LOGIC
const audioToggle = document.getElementById('audio-toggle');
const bgAudio = document.getElementById('bg-audio');
if (bgAudio) bgAudio.volume = 0.5; // subtelny dźwięk
let isAudioPlaying = false;
if (audioToggle && bgAudio) {
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAudioPlaying) {
            bgAudio.pause();
            audioToggle.innerText = "🔇";
            isAudioPlaying = false;
        } else {
            bgAudio.play().catch(e => console.log("Audio play blocked", e));
            audioToggle.innerText = "🔊";
            isAudioPlaying = true;
        }
    });
}

const depthSlider = { min: "-500", max: "500000", value: "0" };

let isDragging = false;
let startX = 0;
let startY = 0;
let targetTranslateZ = 0;
let currentTranslateZ = 0;
let cameraSpeed = 20; // 20 pikseli na klatkę = stała prędkość
let currentFocusedGroup = null;

let currentRotateX = 0;
let currentRotateY = 0;
let targetRotateX = 0;
let targetRotateY = 0;

container.addEventListener('mousedown', (e) => {
    e.preventDefault(); 
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    container.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) {
        // Obliczenie proporcji pozycji kursora (-1 do 1)
        const xPos = (e.clientX / window.innerWidth) * 2 - 1;
        const yPos = (e.clientY / window.innerHeight) * 2 - 1;

        // BARDZO Subtelny obrót kamery na podstawie kursora (maksymalnie ok. 0.5 stopnia)
        targetRotateY = xPos * 0.5;
        targetRotateX = -yPos * 0.5;
    }

    // Przesuwanie kamery w głąb przy przeciąganiu wyłączone na rzecz "Story Mode" (klik/scroll)
    if (isDragging) {
        const deltaY = e.clientY - startY;
        if (deltaY < -20) {
            triggerNextAction(); // przeciągnięcie palcem po ekranie w górę przewija do przodu
            isDragging = false; // blokujemy spamowanie akcji podczas jednego długiego ruchu
        }
    }
});

let scrollCooldown = false;

function triggerNextAction() {
    if (scrollCooldown) return;
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, 1000); // 1 sekunda blokady, by jedno machnięcie rolką nie przewinęło 5 slajdów

    // 1. Ekran startowy
    if (introState < 2 && introScreenElement) {
        introScreenElement.click();
        return;
    }
    
    // 2. Cytat
    const overlay = document.getElementById('quote-overlay');
    if (overlay && overlay.classList.contains('visible')) {
        overlay.click();
        return;
    }
    
    // 3. Rozbicie obrazka przed kamerą
    const allLayers = Array.from(document.querySelectorAll('.layer')).filter(l => l.dataset.shattered === "false");
    let closestLayer = null;
    let minDistance = Infinity;
    
    allLayers.forEach(l => {
        const z = parseFloat(l.dataset.z);
        const distance = -(z + currentTranslateZ);
        // Szukamy najbliższej warstwy, która jest "przed" nami
        if (distance > -500 && distance < minDistance) {
            minDistance = distance;
            closestLayer = l;
        }
    });
    
    // Jeśli jakaś warstwa jest blisko (np. w zasięgu wzroku), rozbij ją (wyzwól klik)
    if (closestLayer && minDistance < 5000) {
        closestLayer.click();
    }
}

window.addEventListener('wheel', (e) => {
    // Zapobiegamy przewijaniu strony
    e.preventDefault();
    
    // Tylko przewijanie w dół (w przód historii) wyzwala akcję
    if (e.deltaY > 10) {
        triggerNextAction();
    }
});

// Pozwalamy na klikanie "gdziekolwiek" na ekranie, jeśli najbliższym obiektem jest filmik
window.addEventListener('click', (e) => {
    if (introState < 2) return;
    
    const allLayers = Array.from(document.querySelectorAll('.layer[data-layer-type$="_fg"]')).filter(l => l.dataset.shattered === "false");
    let closestLayer = null;
    let minDistance = Infinity;
    
    allLayers.forEach(l => {
        const z = parseFloat(l.dataset.z);
        const distance = -(z + currentTranslateZ);
        if (distance > -1000 && distance < minDistance) {
            minDistance = distance;
            closestLayer = l;
        }
    });

    if (closestLayer && minDistance < 5000 && closestLayer.dataset.isVideo === "true") {
        triggerNextAction();
    }
});

let introState = 0; // 0 = h2 ukryte, 1 = h2 widoczne, 2 = jazda

const introScreenElement = document.getElementById('intro-screen');
if (introScreenElement) {
    introScreenElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Blokuje wpadanie klików głębiej
        
        if (introState === 0) {
            const h2 = introScreenElement.querySelector('h2');
            if (h2) h2.classList.add('visible');
            introState = 1;
            
            // Autoplay audio on first interaction
            if (bgAudio && !isAudioPlaying) {
                bgAudio.play().catch(e => console.log(e));
                audioToggle.innerText = "🔊";
                isAudioPlaying = true;
            }
        } else if (introState === 1) {
            introState = 2;
            
            // Natychmiastowe, animowane zniknięcie samej planszy
            introScreenElement.style.pointerEvents = 'none'; 
            introScreenElement.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
            introScreenElement.style.opacity = '0';
            introScreenElement.style.transform = 'translateY(-1500px)';
            
            const hint = document.getElementById('click-hint');
            if (hint) {
                hint.style.transition = 'opacity 0.5s ease';
                hint.style.opacity = '0';
            }

            setTimeout(() => {
                introScreenElement.style.display = 'none';
            }, 800);
            
            if (targetTranslateZ < 2000) {
                const firstLayer = document.querySelector('.layer');
                if (firstLayer) {
                    const z = parseFloat(firstLayer.dataset.z);
                    const isVideo = firstLayer.dataset.isVideo === "true";
                    targetTranslateZ = isVideo ? -z - 2000 : -z - 500;
                    depthSlider.value = targetTranslateZ;
                    
                    cameraSpeed = 15;
                } else {
                    targetTranslateZ = 2000;
                    depthSlider.value = targetTranslateZ;
                }
            }
        }
    });
}

// === QUOTE OVERLAY CLICK HANDLER ===
const quoteOverlay = document.getElementById('quote-overlay');
if (quoteOverlay) {
    quoteOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Ukrywamy planszę z cytatem
        quoteOverlay.classList.remove('visible');
        
        // Ukrywamy napis "Kliknij, aby pójść dalej" na zawsze po pierwszym razie
        const hint = quoteOverlay.querySelector('.continue-hint');
        if (hint) {
            hint.style.display = 'none';
        }
        
        // Zaczynamy szukać kolejnego zdjęcia do najechania
        const currentZ = parseFloat(quoteOverlay.dataset.currentZ);
        const currentGroupId = quoteOverlay.dataset.groupId;
        
        const allLayers = Array.from(document.querySelectorAll('.layer'))
            .filter(el => el.dataset.shattered === "false" && parseFloat(el.dataset.z) < currentZ && el.dataset.groupId !== currentGroupId);
        
        if (allLayers.length > 0) {
            // Najbliższa z dostępnych w głębi
            const nextZ = Math.max(...allLayers.map(l => parseFloat(l.dataset.z)));
            const nextGroup = allLayers.find(l => parseFloat(l.dataset.z) === nextZ);
            const isVideo = nextGroup.dataset.isVideo === "true";
            
            targetTranslateZ = isVideo ? -nextZ - 2000 : -nextZ - 500;
            depthSlider.value = targetTranslateZ;
            
            cameraSpeed = 15; // Stała, kinowa prędkość
        } else {
            targetTranslateZ = 2000;
            depthSlider.value = targetTranslateZ;
        }
    });
}
// ====================================

// Mechanizm podpowiedzi (10 sekund bezczynności na początku)
let inactivityTimer = null;
function resetInactivity() {
    clearTimeout(inactivityTimer);
    const hint = document.getElementById('click-hint');
    if (hint) {
        hint.classList.remove('visible'); // Ukrywamy przy dowolnej akcji
        
        // Uruchamiamy odliczanie tylko na początku tunelu
        if (targetTranslateZ < 1000) {
            inactivityTimer = setTimeout(() => {
                hint.classList.add('visible');
            }, 10000);
        }
    }
}

document.addEventListener('mousemove', resetInactivity);
document.addEventListener('wheel', resetInactivity);
document.addEventListener('click', resetInactivity);
resetInactivity(); // Start pierwszego licznika

// Przekształcamy ruch w przestrzeni 3D - usunięto slider


const SHATTER_THRESHOLD = 500; // Rozpada się dopiero jeśli fizycznie minie kamerę, zmuszając do kliknięcia

function shatterImage(div) {
    div.dataset.shattered = "true";
    
    // Rozpad cytatu (jeśli to warstwa FG)
    if (div.dataset.layerType && div.dataset.layerType.endsWith('_fg')) {
        const quoteDiv = document.querySelector(`.quote-text[data-group-id="${div.dataset.groupId}"]`);
        if (quoteDiv) {
            quoteDiv.classList.add('shattered');
            setTimeout(() => { quoteDiv.remove(); }, 4000);
        }
    }
    
    const allImgs = div.querySelectorAll('img');
    if (allImgs.length === 0) return;
    
    let currentIdx = div.dataset.currentFrameIndex ? parseInt(div.dataset.currentFrameIndex) : 0;
    if (currentIdx >= allImgs.length) currentIdx = 0;
    
    let targetImg = allImgs[currentIdx];
    
    // Ukrywamy WSZYSTKIE klatki
    allImgs.forEach(img => { img.style.display = 'none'; });

    const width = targetImg.width || targetImg.naturalWidth || 1000;
    const height = targetImg.height || targetImg.naturalHeight || 1000;

    const processShatter = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        ctx.drawImage(targetImg, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height).data;
        
        const pCanvas = document.createElement('canvas');
        pCanvas.width = width;
        pCanvas.height = height;
        pCanvas.className = targetImg.className; 
        pCanvas.style.position = 'absolute';
        pCanvas.style.left = '50%';
        pCanvas.style.top = '50%';
        pCanvas.style.transform = 'translate(-50%, -50%)';
        div.appendChild(pCanvas);
        
        const pCtx = pCanvas.getContext('2d');
        const particles = [];
        const blockSize = 15;
        
        for (let y = 0; y < height; y += blockSize) {
            for (let x = 0; x < width; x += blockSize) {
                const i = (y * width + x) * 4;
                const a = imageData[i+3];
                
                if (a > 30) {
                    const r = imageData[i];
                    const g = imageData[i+1];
                    const b = imageData[i+2];
                    particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 20,
                        color: `rgba(${r}, ${g}, ${b}, ${a/255})`,
                        alpha: a/255,
                        size: blockSize * (0.8 + Math.random() * 0.6)
                    });
                }
            }
        }
        
        setTimeout(() => {
            canvas.width = 0;
            canvas.height = 0;
        }, 100);

        setTimeout(() => {
            div.remove(); 
            // Dla zdjęć tło to _bg, dla wideo usunęliśmy _bg, więc łapiemy też video_fg
            if (div.dataset.layerType && (div.dataset.layerType.endsWith('_bg') || div.dataset.layerType === 'video_fg')) {
                spawnNextGroup();
            }
        }, 4000);  

        function animateParticles() {
            pCtx.clearRect(0, 0, width, height);
            let aliveCount = 0;
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha <= 0.05) continue;
                
                aliveCount++;
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 1.02;
                p.vy *= 1.02;
                
                const isBg = targetImg.classList.contains('img-bg');
                p.alpha *= isBg ? 0.995 : 0.985;
                
                pCtx.globalAlpha = p.alpha;
                pCtx.fillStyle = p.color;
                pCtx.fillRect(p.x, p.y, p.size, p.size);
            }
            
            const isBehindCamera = (parseFloat(div.dataset.z) + currentTranslateZ) > 1000;
            
            if (aliveCount > 0 && !isBehindCamera) {
                requestAnimationFrame(animateParticles);
            } else {
                pCanvas.remove(); 
            }
        }
        animateParticles();
    };

    if (targetImg.complete && targetImg.naturalWidth !== 0) {
        processShatter();
    } else {
        targetImg.onload = processShatter;
    }
}

const ambientParticles = [];
const NUM_AMBIENT_PARTICLES = 300;

function initAmbientParticles() {
    const colors = ['rgba(200, 200, 200, 0.4)', 'rgba(255, 255, 255, 0.3)', 'rgba(150, 150, 150, 0.5)'];
    for (let i = 0; i < NUM_AMBIENT_PARTICLES; i++) {
        const p = document.createElement('div');
        p.className = 'ambient-particle';
        
        // Losowy start
        const x = (Math.random() - 0.5) * 4000;
        const y = (Math.random() - 0.5) * 2000;
        const z = -Math.random() * 15000; // Rozrzucone na całą głębokość tunelu
        
        const size = 5 + Math.random() * 15;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        camera.appendChild(p);
        
        ambientParticles.push({
            el: p,
            x: x,
            y: y,
            z: z,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            vz: (Math.random() - 0.5) * 2
        });
    }
}

function animate() {
    const diff = targetTranslateZ - currentTranslateZ;
    if (Math.abs(diff) <= cameraSpeed) {
        currentTranslateZ = targetTranslateZ;
    } else {
        currentTranslateZ += Math.sign(diff) * cameraSpeed;
    }
    
    currentRotateX += (targetRotateX - currentRotateX) * 0.1;
    currentRotateY += (targetRotateY - currentRotateY) * 0.1;
    
    // Zastosuj rotację i głębię
    camera.style.transform = `translateZ(${currentTranslateZ}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

    // Podświetlenie klikalnej ramki na najbliższym obrazku
    const allLayers = Array.from(document.querySelectorAll('.layer[data-layer-type$="_fg"]')).filter(l => l.dataset.shattered === "false");
    let closestLayer = null;
    let minDistance = Infinity;
    
    allLayers.forEach(l => {
        const z = parseFloat(l.dataset.z);
        const distance = -(z + currentTranslateZ);
        if (distance > -1000 && distance < minDistance) {
            minDistance = distance;
            closestLayer = l;
        }
        l.classList.remove('clickable-frame');
    });
    
    // Jeśli najbliższa warstwa jest w odpowiedniej odległości, dodaj klasę podświetlającą
    if (closestLayer && minDistance < 5000 && minDistance > 0 && introState >= 2) {
        closestLayer.classList.add('clickable-frame');
    }

    // Fade out and slide up intro screen as user moves forward (Tylko jeśli introState < 2)
    if (typeof introState !== 'undefined' && introState < 2) {
        const introScreen = document.getElementById('intro-screen');
        const clickHint = document.getElementById('click-hint');
        if (introScreen) {
            let moveY = currentTranslateZ * 1.5;
            let opacity = 1 - (currentTranslateZ / 1000);
            if (moveY < 0) moveY = 0;
            opacity = Math.max(0, Math.min(1, opacity));
            
            introScreen.style.transform = `translateY(-${moveY}px)`;
            introScreen.style.opacity = opacity;
            
            if (clickHint) clickHint.style.opacity = opacity;
            
            if (opacity === 0 && moveY > 2000) {
                introScreen.style.display = 'none';
                introState = 2; // zapobiega nadpisywaniu
            } else {
                introScreen.style.display = 'flex';
            }
        }
    }

    // Animacja Latających Cząsteczek
    ambientParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        
        if (Math.random() < 0.01) {
            p.vx += (Math.random() - 0.5) * 0.5;
            p.vy += (Math.random() - 0.5) * 0.5;
        }
        
        if (p.x > 3000) p.x = -3000;
        if (p.x < -3000) p.x = 3000;
        if (p.y > 2000) p.y = -2000;
        if (p.y < -2000) p.y = 2000;
        
        if (p.z > -currentTranslateZ + 1000) p.z -= 15000;
        if (p.z < -currentTranslateZ - 14000) p.z += 15000;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`;
    });

    // Detekcja odległości do rozbicia warstw oraz wyostrzanie tła i wideo
    const layers = document.querySelectorAll('.layer');
    layers.forEach(div => {
        const z = parseFloat(div.dataset.z);
        const distance = -(z + currentTranslateZ); // Odległość od kamery
        
        // --- Scrubbing Video ---
        if (div.dataset.isVideo === "true" && div.dataset.shattered === "false") {
            const framesCount = parseInt(div.dataset.frames);
            // Aktywne wideo gdy kamera jest blisko (dystans 4000 -> 0)
            if (distance < 4000 && distance > -1000) {
                let frameProgress = 1 - (distance / 4000);
                frameProgress = Math.max(0, Math.min(1, frameProgress));
                let currentFrameIdx = Math.floor(frameProgress * framesCount);
                if (currentFrameIdx >= framesCount) currentFrameIdx = framesCount - 1;
                
                if (div.dataset.currentFrameIndex != currentFrameIdx) {
                    div.dataset.currentFrameIndex = currentFrameIdx;
                    const imgs = div.querySelectorAll('img');
                    imgs.forEach((img, idx) => {
                        img.style.opacity = (idx === currentFrameIdx) ? 1 : 0;
                    });
                }
            }
        }
        
        // Depth of field (Głębia Ostrości)
        const activeImg = div.querySelector('img[style*="opacity: 1"]') || div.querySelector('img');
        if (activeImg) {
            let blurAmount = 0;
            if (distance > 1500) {
                blurAmount = ((distance - 1500) / 3000) * 15; // Max 15px bluru
            }
            blurAmount = Math.max(0, Math.min(15, blurAmount));
            div.style.filter = `blur(${blurAmount}px)`;
        }
        
        // Rozpadanie zdjęć
        if (div.dataset.shattered === "false" && !isNaN(z)) {
            const threshold = div.dataset.layerType && div.dataset.layerType.endsWith('_bg') ? SHATTER_THRESHOLD + 300 : SHATTER_THRESHOLD;
            if (z + currentTranslateZ > threshold) {
                shatterImage(div);
            }
        }
    });

    requestAnimationFrame(animate);
}
animate();
initAmbientParticles();

let globalManifest = [];
let nextSpawnIndex = 0;
let lastGroupZ = -8000;
const groupSpacing = -5000;

function spawnNextGroup() {
    if (globalManifest.length === 0) return;
    
    // Koniec manifestu = koniec księgi. Nie zapętlajmy.
    if (nextSpawnIndex >= globalManifest.length) {
        return;
    }
    
    const item = globalManifest[nextSpawnIndex];
    nextSpawnIndex++;
    
    // Ograniczamy rozrzut zdjęć na boki, żeby były bliżej środka
    let groupXOffset = (Math.random() * 1600) - 800;
    let groupYOffset = (Math.random() * 400) - 200;
    
    // Pierwsze zdjęcie na samym środku
    if (nextSpawnIndex === 1) {
        groupXOffset = 0;
        groupYOffset = 0;
    }
    const uid = item.base_name + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    
    const layers = [];
    if (item.type === "photo") {
        layers.push({
            groupId: uid,
            base_name: item.base_name,
            type: "photo_bg",
            image: `assets_generated/${item.base_name}_bg.jpg`,
            z: lastGroupZ - 500,
            x: groupXOffset,
            y: groupYOffset,
            isVideo: false
        });
        layers.push({
            groupId: uid,
            base_name: item.base_name,
            type: "photo_fg",
            image: `assets_generated/${item.base_name}_fg.png`,
            z: lastGroupZ + 300,
            x: groupXOffset,
            y: groupYOffset,
            isVideo: false
        });
    } else if (item.type === "video") {
        layers.push({
            groupId: uid,
            base_name: item.base_name,
            type: "video_fg",
            base_name: item.base_name,
            frames: item.frames,
            z: lastGroupZ + 300,
            x: groupXOffset,
            y: groupYOffset,
            isVideo: true
        });
    }
    

    
    lastGroupZ += groupSpacing;
    
    layers.forEach(layer => {
        const div = document.createElement('div');
        div.className = 'layer';
        div.dataset.shattered = "false";
        div.dataset.z = layer.z;
        div.dataset.groupId = layer.groupId;
        div.dataset.layerType = layer.type;
        div.dataset.baseName = layer.base_name;
        div.style.transform = `translate3d(${layer.x}px, ${layer.y}px, ${layer.z}px)`;
        div.style.cursor = 'pointer';
        
        // Logika pojedynczego kliknięcia: NATYCHMIASTOWY rozpad FG, po chwili BG, a potem najazd na kolejne zdjęcie
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const fgDiv = document.querySelector(`.layer[data-group-id="${layer.groupId}"][data-layer-type$="_fg"]`);
            const bgDiv = document.querySelector(`.layer[data-group-id="${layer.groupId}"][data-layer-type$="_bg"]`);
            
            if (fgDiv && fgDiv.dataset.shattered === "false") {
                shatterImage(fgDiv);
            }
            if (bgDiv && bgDiv.dataset.shattered === "false") {
                shatterImage(bgDiv);
            }
            
            // Zamiast od razu ruszać do przodu, pokazujemy overlay z tekstem
            setTimeout(() => {
                const overlay = document.getElementById('quote-overlay');
                const content = document.getElementById('quote-content');
                
                // Losowanie cytatu
                const quoteIndex = Math.floor(Math.random() * QUOTES.length);
                content.innerHTML = QUOTES[quoteIndex].replace('\n', '<br>');
                
                overlay.classList.add('visible');
                
                // Przypisujemy do overlaya informację, od którego Z ma ruszyć,
                // żeby w razie czego wiedział, dokąd jechać
                overlay.dataset.currentZ = layer.z;
                overlay.dataset.groupId = layer.groupId;
                
            }, 800); // Czekamy aż szyby opadną (800ms)
        });
        
        if (layer.isVideo) {
            div.dataset.isVideo = "true";
            div.dataset.frames = layer.frames;
            const suffix = layer.type === "video_bg" ? "bg.jpg" : "fg.png";
            const imgClass = layer.type === "video_bg" ? "img-bg frame-img" : "img-fg frame-img";
            
            for (let i = 0; i < layer.frames; i++) {
                const img = document.createElement('img');
                img.src = `assets_generated/${layer.base_name}_frame_${i}_${suffix}`;
                img.className = imgClass;
                
                // WSZYSTKIE klatki muszą mieć identyczne pozycjonowanie absolutne z centrowaniem
                img.style.position = 'absolute';
                img.style.top = '50%';
                img.style.left = '50%';
                img.style.transform = 'translate(-50%, -50%)';
                
                if (i === 0) {
                    img.style.opacity = 1;
                } else {
                    img.style.opacity = 0;
                }
                div.appendChild(img);
            }
        } else {
            div.dataset.isVideo = "false";
            const img = document.createElement('img');
            img.src = layer.image;
            if (layer.type === "photo_bg") img.className = 'img-bg';
            else if (layer.type === "photo_fg") img.className = 'img-fg';
            div.appendChild(img);
        }
        
        camera.appendChild(div);
    });
}

async function loadScene() {
    const debug = document.getElementById('debug-overlay');
    const log = (msg) => { if(debug) debug.innerHTML += `<br>${msg}`; console.log(msg); };
    
    if(debug) debug.innerHTML = "Inicjalizacja...";
    
    try {
        // Tryb Online (jeśli jest hostowane na serwerze i js nie zadziałał)
        const response = await fetch('assets_generated/assets_manifest.json?t=' + Date.now());
        if (!response.ok) throw new Error("HTTP error " + response.status);
        globalManifest = await response.json();
        log(`Manifest pobrany ONLINE! Elementów: ${globalManifest.length}`);
        
        if (globalManifest.length === 0) {
            log("BŁĄD: Manifest jest pusty");
            return;
        }

        // Wyciągamy pierwsze wymuszone zdjęcie
        let targetFirst = null;
        globalManifest = globalManifest.filter(item => {
            if (item.base_name === "IDG_20260524_220543_781") {
                targetFirst = item;
                return false;
            }
            return true;
        });

        // Tasowanie (losowa kolejność)
        for (let i = globalManifest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [globalManifest[i], globalManifest[j]] = [globalManifest[j], globalManifest[i]];
        }
        
        // Dodajemy wymuszone zdjęcie na sam początek
        if (targetFirst) {
            globalManifest.unshift(targetFirst);
        }
        
        const oldLayers = camera.querySelectorAll('.layer');
        oldLayers.forEach(el => el.remove());        
        
        // Spawnujemy tylko 4 pierwsze grupy by nie zapchać pamięci RAM!
        log("Spawnuje warstwy...");
        for(let i=0; i<4; i++) {
            spawnNextGroup();
        }
        
        const layerCount = document.querySelectorAll('.layer').length;
        log(`Wygenerowano warstw w DOM: ${layerCount}`);
        
        setTimeout(() => { if(debug) debug.style.display = 'none'; }, 5000);
        
    } catch (error) {
        log("BŁĄD GŁÓWNY: " + error.message);
    }
}

// Logika narzędzi kuratorskich USUNIĘTA ZGODNIE Z PROŚBĄ UŻYTKOWNIKA
loadScene();
