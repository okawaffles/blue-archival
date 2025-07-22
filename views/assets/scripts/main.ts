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

    // used for conversion from the json
    city?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
    desert?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
    indoor?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible' 
}

interface GameState {
    solution_student: Student,
    guesses: Array<Student>
}

// -- globals --

let GAME_STATE: GameState; 
let ALL_STUDENTS: {[key: string]: Student} = {};

// -- various functions --

function AddGuess(student: Student) {
    GAME_STATE.guesses.push(student);

    let $newRow = $("<tr>");

    console.log(student.name, GAME_STATE.solution_student.name);

    const comfort_relation: Array<boolean> = [
        student.comfort.city == GAME_STATE.solution_student.comfort.city,
        student.comfort.desert == GAME_STATE.solution_student.comfort.desert,
        student.comfort.indoor == GAME_STATE.solution_student.comfort.indoor,
    ];

    const is_similar_student = (student.name.includes(GAME_STATE.solution_student.name)) || (GAME_STATE.solution_student.name.includes(student.name));

    console.log(comfort_relation);

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
    $newRow.append(`<td class="${corrects[3]?'correct':''}">${student.class}</td>`);
    $newRow.append(`<td class="${corrects[4]?'correct':''}">${student.pos}</td>`);
    $newRow.append(`<td class="${corrects[5]?'correct':''}">${student.attack}</td>`);
    $newRow.append(`<td class="${corrects[6]?'correct':''}">${student.defense}</td>`);
    $newRow.append(`<td class="${corrects[7]?'correct':''}">${student.role}</td>`);
    $newRow.append(`<td class="${corrects[8]?'correct':`${(comfort_relation[0] || comfort_relation[1] || comfort_relation[2])?'partial-correct':''}`}">${comfort}</td>`);
    $newRow.append(`<td class="${corrects[9]?'correct':''}">${student.cover?'Yes':'No'}</td>`);

    $('#student-tb-header').after($newRow);
}

function DoEntry() {
    if ($('#entry').val() == '' || $('#entry').hasClass('search-not-found')) return console.log('main -- not found student name');

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
        alert('congrats, you selected the right student! i don\'t have a win screen yet.');
    }
}

// -- init --

// wait til document is ready then start
$(async function() {
    // alert('doc ready');

    // fetch all students
    await fetch('assets/students.json').then(async response => {
        ALL_STUDENTS = await response.json();
        console.log(`main -- loaded ${Object.keys(ALL_STUDENTS).length} students`);
    });

    const sel = ALL_STUDENTS['shiroko (riding)'];
    sel.name = 'shiroko (riding)';
    sel.comfort = {
        city: sel.city!,
        desert: sel.desert!,
        indoor: sel.indoor!,
    };

    GAME_STATE = {
        solution_student: sel,
        guesses: []
    };

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

        if (!$('#entry').hasClass('search-not-found')) $('#entry').addClass('search-not-found');

        let results = 'did you mean...<br>';
        for (const key in ALL_STUDENTS) {
            if (key.includes(value)) {
                results += key + ', '
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
    })
});