// info
let sources = {
    __SOURCE:"https://bluearchive.fandom.com/wiki/Student/Detailed_List",
    __SOURCE2:"https://bluearchive.wiki/wiki/Characters"
}

interface Student {
    name: string,
    rarity: number,
    school: string,
    role: string,
    class: string,
    pos: 'front' | 'middle' | 'back',
    comfort: {
        city: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
        desert: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
        indoor: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible'
    },
    attack: string,
    defense: string,
    cover: boolean,

    // used for conversion from the json, do not use in game comparisons
    city?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
    desert?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
    indoor?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible' 
}

interface GameState {
    solution_student: Student,
    guesses: Array<Student>,
    hints: number
}

// -- globals --

let GAME_STATE: GameState; 
let DAY = 1;
let ALL_STUDENTS: {[key: string]: Student} = {};
let MOBILE = navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone');
// table replaces long text with these to save on horizontal space
let MOBILE_ALTS: {[key: string]: string} = {
    'attacker': 'ATK',
    'healer': 'HEAL',
    'front': 'FRONT',
    'middle': 'MID',
    'back': 'BACK',
    'penetration': 'PENET.',
    'explosive': 'EXPL.',
    'light': 'LT',
    'heavy': 'HV',
    'striker': 'STRK',
    'special': 'SPEC',
    'support': 'SUPP',
    'mystic': 'MYST',
    'elastic': 'ELAS',
    'tactical': 'TACT',
    'tank': 'TANK',
    'sonic': 'SONIC',
};
const d = new Date();
const CURRENT_DATE = `${d.getFullYear()}-${d.getMonth()<10?'0':''}${d.getMonth()+1}-${d.getDate()<10?'0':''}${d.getDate()}`;

// -- various functions --

function AddGuess(student: Student, add_to_storage: boolean = true) {
    GAME_STATE.guesses.push(student);
    if (localStorage.getItem('ba_last_played_date') != CURRENT_DATE) {
        localStorage.setItem('ba_is_solved', 'false');
        localStorage.setItem('ba_last_played_date', CURRENT_DATE);
        localStorage.removeItem('ba_current_guesses');
        localStorage.setItem('ba_guess_hints', '0');
    }
    if (add_to_storage) localStorage.setItem('ba_current_guesses', JSON.stringify(GAME_STATE.guesses.map(guess => guess.name)));
    localStorage.setItem('ba_guess_hints', GAME_STATE.hints+'');

    let $newRow = $("<tr>");

    // console.log(student.name, GAME_STATE.solution_student.name);

    const comfort_relation: Array<boolean> = [
        student.comfort.city == GAME_STATE.solution_student.comfort.city,
        student.comfort.desert == GAME_STATE.solution_student.comfort.desert,
        student.comfort.indoor == GAME_STATE.solution_student.comfort.indoor,
    ];


    const testing_name = student.name.includes(' (')?student.name.split(' (')[0]:student.name;
    const testing_solution = GAME_STATE.solution_student.name.includes(' (')?GAME_STATE.solution_student.name.split(' (')[0]:GAME_STATE.solution_student.name;
    const is_similar_student = testing_name == testing_solution;

    const corrects: Array<boolean> = [
        student.name==GAME_STATE.solution_student.name,
        student.school==GAME_STATE.solution_student.school,
        student.rarity==GAME_STATE.solution_student.rarity,
        student.class==GAME_STATE.solution_student.class,
        student.pos==GAME_STATE.solution_student.pos,
        student.attack==GAME_STATE.solution_student.attack,
        student.defense==GAME_STATE.solution_student.defense,
        student.role==GAME_STATE.solution_student.role,
        comfort_relation[0] && comfort_relation[1] && comfort_relation[2],
        student.cover==GAME_STATE.solution_student.cover,
    ];

    let stars = '';
    for (let i = 0; i < student.rarity; i++)
        stars += '<img src="assets/images/star.webp" alt="⭐" />';

    let comfort = '';
    comfort += `<img src="assets/images/${student.comfort.city}.webp" />`;
    comfort += `<img src="assets/images/${student.comfort.desert}.webp" />`;
    comfort += `<img src="assets/images/${student.comfort.indoor}.webp" />`;
    
    $newRow.append(`<td class="${corrects[0]?'correct':`${is_similar_student?'partial-correct':''}`}"><img src="${'assets/images/'+student.name+'.webp'}" alt="${student.name}" /></td>`);
    $newRow.append(`<td class="${corrects[1]?'correct':''}"><img src="assets/images/${student.school}.webp" alt="${student.school}" /></td>`);
    $newRow.append(`<td class="${corrects[2]?'correct':''}">${stars}</td>`);
    $newRow.append(`<td class="${corrects[3]?'correct':''}">${MOBILE?MOBILE_ALTS[student.class]:student.class}</td>`);
    $newRow.append(`<td class="${corrects[4]?'correct':''}">${MOBILE?MOBILE_ALTS[student.pos]:student.pos}</td>`);
    $newRow.append(`<td class="${corrects[5]?'correct':''}">${MOBILE?MOBILE_ALTS[student.attack]:student.attack}</td>`);
    $newRow.append(`<td class="${corrects[6]?'correct':''}">${MOBILE?MOBILE_ALTS[student.defense]:student.defense}</td>`);
    $newRow.append(`<td class="${corrects[7]?'correct':''}">${MOBILE?MOBILE_ALTS[student.role]:student.role}</td>`);
    $newRow.append(`<td class="${corrects[8]?'correct':`${(comfort_relation[0] || comfort_relation[1] || comfort_relation[2])?'partial-correct':''}`}">${comfort}</td>`);
    $newRow.append(`<td class="${corrects[9]?'correct':''}">${student.cover?'Yes':'No'}</td>`);

    $('#student-tb-header').after($newRow);
}

function DoEntry() {
    if ($('#entry').val() == 'hint') {
        if (GAME_STATE.guesses.length == 0) return alert("You can't get a hint until you guess one student.");
        const hint = GetHint(GAME_STATE.guesses[GAME_STATE.guesses.length - 1]!);
        if (hint == '') return alert("Can't give you a hint, you're already too close!");
        GAME_STATE.hints++;
        AddGuess(ALL_STUDENTS[hint]);
        return;
    }
    if ($('#entry').val() == '' || $('#entry').hasClass('search-not-found')) return console.log('bluearchival/main -- not found student name');

    $('#waiting').remove();

    const student = ALL_STUDENTS[($('#entry').val() as string).toLowerCase()];
    if (student == undefined) return alert('failed to submit student. this is not your fault. please report this as a bug and how to reproduce.');
    
    student.name = ($('#entry').val() as string).toLowerCase();
    student.comfort = {
        city: student.city!,
        desert: student.desert!,
        indoor: student.indoor!
    };
    AddGuess(student);
    $('#entry').val('');
    document.getElementById('entry')?.dispatchEvent(new InputEvent('input'));

    if (student.name == GAME_STATE.solution_student.name) {
        $('#submit').prop('disabled', true);
        $('#entry').prop('disabled', true);
        $('#share').css('display', 'inline');
        $('#final').html(`You got it! The student was <h2 class="student-name">${GAME_STATE.solution_student.name}</h2>!`);
        $('#did-you-mean').css('display', 'none');
        localStorage.setItem('ba_is_solved', 'true');
    }
}

function SpanClicked(content: string) {
    $('#entry').val(content).removeClass('search-not-found').addClass('search-found');
    DoEntry();
}

function GenerateShare() {
    const lang = navigator.language.split('-')[0] || navigator.language;
    const share_texts: {[key: string]: string} = {
        'en/get':'I played BlueArchival #{num} and got it in {guess} guesses!\n',
        'ja/get':'BlueArchival #{num}をプレイして{guess}回で当てた！\n',
        'es/get':'¡He jugado a BlueArchival #{num} y lo he conseguido en {guess} intentos!\n',
        'en/hints':'(but I used {hints} hints)\n',
    };
    let shared = share_texts[`${lang}/get`] || share_texts['en/get'];
    if (GAME_STATE.hints > 0) shared += `${share_texts['en/hints'].replace('{hints}', GAME_STATE.hints+'')}`;
    let lines: Array<string> = [];
    for (const student of GAME_STATE.guesses) {
        let line = '';

        const comfort_relation: Array<boolean> = [
            student.comfort.city == GAME_STATE.solution_student.comfort.city,
            student.comfort.desert == GAME_STATE.solution_student.comfort.desert,
            student.comfort.indoor == GAME_STATE.solution_student.comfort.indoor,
        ];

        const is_similar_comfort = comfort_relation[0] || comfort_relation[1] || comfort_relation[2];

        const testing_name = student.name.includes(' (')?student.name.split(' (')[0]:student.name;
        const testing_solution = GAME_STATE.solution_student.name.includes(' (')?GAME_STATE.solution_student.name.split(' (')[0]:GAME_STATE.solution_student.name;
        const is_similar_student = (testing_name.includes(testing_solution)) || (testing_solution.includes(testing_name));

        const corrects: Array<boolean> = [
            student.name==GAME_STATE.solution_student.name,
            student.school==GAME_STATE.solution_student.school,
            student.rarity==GAME_STATE.solution_student.rarity,
            student.class==GAME_STATE.solution_student.class,
            student.pos==GAME_STATE.solution_student.pos,
            student.attack==GAME_STATE.solution_student.attack,
            student.defense==GAME_STATE.solution_student.defense,
            student.role==GAME_STATE.solution_student.role,
            comfort_relation[0] && comfort_relation[1] && comfort_relation[2],
            student.cover==GAME_STATE.solution_student.cover,
        ];

        for (let i = 0; i != corrects.length; i++) {
            if (i == 0 || i == 8) {
                if (corrects[i]) line += '🟩';
                else if ((i == 0 && is_similar_student) || (i == 8 && is_similar_comfort)) line += '🟧';
                else line += '🟥';
                continue;
            }

            line += corrects[i]?'🟩':'🟥';
        }

        lines.unshift(line);
    }

    shared += lines.join('\n');
    shared += '\nhttps://millie.zone/blue-archival';
    shared = shared.replace('{num}', DAY+'').replace('{guess}', GAME_STATE.guesses.length+'');

    try {
        if (!MOBILE) throw new Error('wahhh');
        navigator.share({
            text: shared
        });
    } catch(err) {
        console.warn(err);
        navigator.clipboard.writeText(shared);
        $('#share-button').text('Copied Results!');
        setTimeout(() => {
            $('#share-button').text('Share Results!');
        }, 3000);
    }

    // alert(shared);
}

function GenerateDiscordShare() {
    const lang = navigator.language.split('-')[0] || navigator.language;
    const share_texts: {[key: string]: string} = {
        'en/get':'I played BlueArchival #{num} and got it in {guess} guesses!\n',
        'ja/get':'BlueArchival #{num}をプレイして{guess}回で当てた！\n',
        'es/get':'¡He jugado a BlueArchival #{num} y lo he conseguido en {guess} intentos!\n',
        'en/hints':'(but I used {hints} hints)\n',
    };
    let shared = share_texts[`${lang}/get`] || share_texts['en/get'];
    if (GAME_STATE.hints > 0) shared += share_texts['en/hints'].replace('{hints}', GAME_STATE.hints+'');
    shared = shared.replace('{num}', DAY+'').replace('{guess}', GAME_STATE.guesses.length+'');
    shared += '||'
    for (const student of GAME_STATE.guesses) {
        shared += student.name + ', ';
    }
    shared += '||\nhttps://millie.zone/blue-archival';

    try {
        if (MOBILE) navigator.share({text:shared});
        else throw new Error('not mobile so fail out of this block');
    } catch (err) {
        console.warn(err);
        navigator.clipboard.writeText(shared);
        $('#share-button-discord').text('Copied Results!');
        setTimeout(() => {
            $('#share-button-discord').text('Copy Results (Discord)');
        }, 3000);
    }
}

function GetHint(userBest: Student): string {
    const similarity = (a: Student, b: Student): number => {
        if (!a.comfort) a.comfort = {
            city: a.city!,
            desert: a.desert!,
            indoor: a.indoor!
        };
        if (!b.comfort) b.comfort = {
            city: b.city!,
            desert: b.desert!,
            indoor: b.indoor!
        };

        let score = 0;
        if (a.rarity === b.rarity) score++;
        if (a.school === b.school) score++;
        if (a.role === b.role) score++;
        if (a.class === b.class) score++;
        if (a.pos === b.pos) score++;
        if (a.attack === b.attack) score++;
        if (a.defense === b.defense) score++;
        if (a.cover === b.cover) score++;
        if (a.comfort.city === b.comfort.city) score++;
        if (a.comfort.desert === b.comfort.desert) score++;
        if (a.comfort.indoor === b.comfort.indoor) score++;
        return score;
    };

    const scoreToAnswer = (s: Student) => similarity(s, GAME_STATE.solution_student);
    const scoreToGuess = (s: Student) => similarity(s, userBest);

    const userScore = scoreToAnswer(userBest);
    const maxScore = similarity(GAME_STATE.solution_student, GAME_STATE.solution_student); // usually 11

    const candidates = Object.values(ALL_STUDENTS)
        .filter(s => s.name !== userBest.name && s.name !== GAME_STATE.solution_student.name)
        .map(student => ({
            student,
            toAnswer: scoreToAnswer(student),
            toGuess: scoreToGuess(student)
        }))
        .filter(entry => entry.toAnswer > userScore && entry.toAnswer < maxScore)
        .sort((a, b) => a.toAnswer - b.toAnswer); // ascending toward solution

    // Pick the middle one between guess and answer
    if (candidates.length > 0) {
        const middleIndex = Math.floor(candidates.length / 2);
        return candidates[middleIndex].student.name;
    }

    return ""; // fallback if none found
}

// -- init --

// wait til document is ready then start
$(async function() {
    if (MOBILE) {
        $('#th-comfort').html('C/D/I');
    }

    // -- "anti-cheat" --
    console.log("%c Hey! Cheating gets rid of the fun! ", "background: red; color: yellow; font-size: x-large");
    console.log("%c You've got this! Keep trying! ", "color: green; font-size: large");
    console.log("%c Encountered an issue? Report it (with screenshots of the logs) at https://github.com/okawaffles/blue-archival/issues ", "color: rgb(18,138,250); font-size: medium");

    // fetch all students
    await fetch('assets/students.json').then(async response => {
        ALL_STUDENTS = await response.json();
        for (const student in ALL_STUDENTS) {
            ALL_STUDENTS[student].name = student;
        }
        console.log(`bluearchival/main -- loaded ${Object.keys(ALL_STUDENTS).length} students`);
    });

    await fetch(`solution/${CURRENT_DATE}`).then(async response => {
        let data;

        try {
            data = await response.json();
        } catch (err) {
            console.error(`bluearchival/main -- error occurred while loading current student: ${err}`);
            console.error((err as any).stack);
            console.error(err);
            $('#submit').prop('disabled', true);
            $('#entry').prop('disabled', true);
            alert('There was an error loading the daily solution. This is not your fault. Please open your browser console (ctrl+shift+I or F12) for more information.')
            return;
        }

        DAY = data.num;

        try {
            const sel = ALL_STUDENTS[data.student];
            sel.name = data.student;
            sel.comfort = {
                city: sel.city!,
                desert: sel.desert!,
                indoor: sel.indoor!,
            };
            
            GAME_STATE = {
                solution_student: sel,
                guesses: [],
                hints: 0
            };
        } catch (err: any) {
            console.error(`bluearchival/main -- error while creating game state: ${err}`);
            console.error(`bluearchival/main -- ${err.stack}`)
            console.error(err);
            return alert('There was an error loading the daily solution. This is not your fault. Please open your browser console (ctrl+shift+I or F12) for more information.');
        }
    });

    // check if there is preexisting data in the localstorage
    if (localStorage.getItem('ba_last_played_date') == CURRENT_DATE) {
        console.log('bluearchival/main -- loading existing data...');
        const ba_current_guesses = JSON.parse(localStorage.getItem('ba_current_guesses')!);
        GAME_STATE.hints = parseInt(localStorage.getItem('ba_guess_hints') || '0');

        $('#waiting').remove();

        for (const guess of ba_current_guesses) {
            console.log(`bluearchival/main -- reload from localStorage: ${guess}`);
            const sel = ALL_STUDENTS[guess];
            sel.name = guess;
            sel.comfort = {
                city: sel.city!,
                desert: sel.desert!,
                indoor: sel.indoor!,
            };

            // false signifies that we don't want to add it to the localstorage
            // since it's already there
            AddGuess(sel, false);
        }

        if (localStorage.getItem('ba_is_solved') == 'true') {
            $('#submit').prop('disabled', true);
            $('#entry').prop('disabled', true);
            $('#share').css('display', 'inline');
            $('#final').html(`You got it! The student was <span class="student-name">${GAME_STATE.solution_student.name}</span>!`);
            return;
        }
    }

    // add listener for search bar
    $('#entry').on('input', () => {
        // console.log(ev);
        // console.log($('#entry').val());
        const value = ($('#entry').val() as string).toLowerCase();
        if (value == '') {
            $('#did-you-mean').text('start typing to get results...');
            $('#entry').removeClass('search-found');
            $('#entry').removeClass('search-not-found');
            return;
        }

        if (value == 'hint') {
            $('#did-you-mean').text('press enter to get a hint!');
            return $('#entry').addClass('search-hint');
        }
        else $('#entry').removeClass('search-hint');

        if (!$('#entry').hasClass('search-not-found')) $('#entry').addClass('search-not-found');

        let results = 'did you mean...<br>';
        for (const key in ALL_STUDENTS) {
            if (key.includes(value)) {
                results += `<span onclick="SpanClicked('${key}')">${key}</span>, `
            }

            if (value == key) {
                console.log('match found!');
                $('#entry').removeClass('search-not-found');
                $('#entry').addClass('search-found');
            }
        }
        if (results == 'did you mean...<br>') results = 'no matches found';

        $('#did-you-mean').html(results);
    });

    // enter button listener
    $('#submit').on('click', () => {
        DoEntry();
    });
    $(document).on('keydown', (ev) => {
        if ($('#entry').is(':focus') && ev.key == 'Enter') DoEntry();
    });
});