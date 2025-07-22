var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// info
var sources = {
    __SOURCE: "https://bluearchive.fandom.com/wiki/Student/Detailed_List",
    __SOURCE2: "https://bluearchive.wiki/wiki/Characters"
};
// -- globals --
var GAME_STATE;
var ALL_STUDENTS = {};
// -- various functions --
function AddGuess(student) {
    GAME_STATE.guesses.push(student);
    var $newRow = $("<tr>");
    console.log(student.name, GAME_STATE.solution_student.name);
    var comfort_relation = [
        student.comfort.city == GAME_STATE.solution_student.comfort.city,
        student.comfort.desert == GAME_STATE.solution_student.comfort.desert,
        student.comfort.indoor == GAME_STATE.solution_student.comfort.indoor,
    ];
    var is_similar_student = (student.name.includes(GAME_STATE.solution_student.name)) || (GAME_STATE.solution_student.name.includes(student.name));
    console.log(comfort_relation);
    var corrects = [
        student.name == GAME_STATE.solution_student.name,
        student.school == GAME_STATE.solution_student.school,
        student.rarity == GAME_STATE.solution_student.rarity,
        student.class == GAME_STATE.solution_student.class,
        student.pos == GAME_STATE.solution_student.pos,
        student.attack == GAME_STATE.solution_student.attack,
        student.defense == GAME_STATE.solution_student.defense,
        student.role == GAME_STATE.solution_student.role,
        comfort_relation[0] && comfort_relation[1] && comfort_relation[2],
        student.cover == GAME_STATE.solution_student.cover,
    ];
    var stars = '';
    for (var i = 0; i < student.rarity; i++)
        stars += '<img src="assets/images/star.webp" alt="⭐" />';
    var comfort = '';
    comfort += "<img src=\"assets/images/".concat(student.comfort.city, ".webp\" />");
    comfort += "<img src=\"assets/images/".concat(student.comfort.desert, ".webp\" />");
    comfort += "<img src=\"assets/images/".concat(student.comfort.indoor, ".webp\" />");
    $newRow.append("<td class=\"".concat(corrects[0] ? 'correct' : "".concat(is_similar_student ? 'partial-correct' : ''), "\"><img src=\"").concat('assets/images/' + student.name + '.webp', "\" alt=\"").concat(student.name, "\" /></td>"));
    $newRow.append("<td class=\"".concat(corrects[1] ? 'correct' : '', "\"><img src=\"assets/images/").concat(student.school, ".webp\" alt=\"").concat(student.school, "\" /></td>"));
    $newRow.append("<td class=\"".concat(corrects[2] ? 'correct' : '', "\">").concat(stars, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[3] ? 'correct' : '', "\">").concat(student.class, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[4] ? 'correct' : '', "\">").concat(student.pos, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[5] ? 'correct' : '', "\">").concat(student.attack, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[6] ? 'correct' : '', "\">").concat(student.defense, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[7] ? 'correct' : '', "\">").concat(student.role, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[8] ? 'correct' : "".concat((comfort_relation[0] || comfort_relation[1] || comfort_relation[2]) ? 'partial-correct' : ''), "\">").concat(comfort, "</td>"));
    $newRow.append("<td class=\"".concat(corrects[9] ? 'correct' : '', "\">").concat(student.cover ? 'Yes' : 'No', "</td>"));
    $('#student-tb-header').after($newRow);
}
function DoEntry() {
    var _a;
    if ($('#entry').val() == '' || $('#entry').hasClass('search-not-found'))
        return console.log('main -- not found student name');
    $('#waiting').remove();
    var student = ALL_STUDENTS[$('#entry').val().toLowerCase()];
    if (student == undefined)
        return alert('failed to submit student. this is not your fault. please report this as a bug and how to reproduce.');
    student.name = $('#entry').val().toLowerCase();
    student.comfort = {
        city: student.city,
        desert: student.desert,
        indoor: student.indoor
    };
    AddGuess(student);
    $('#entry').val('');
    (_a = document.getElementById('entry')) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new InputEvent('input'));
    if (student.name == GAME_STATE.solution_student.name) {
        $('#submit').prop('disabled', true);
        $('#entry').prop('disabled', true);
        alert('congrats, you selected the right student! i don\'t have a win screen yet.');
    }
}
// -- init --
// wait til document is ready then start
$(function () {
    return __awaiter(this, void 0, void 0, function () {
        var $newBody, sel;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // alert('doc ready');
                    if (navigator.userAgent.includes('Android') ||
                        navigator.userAgent.includes('iPhone') ||
                        navigator.userAgent.includes('iPad') ||
                        navigator.userAgent.includes('iOS')) {
                        $('#body').remove();
                        $newBody = $('<body>');
                        $newBody.append("<h2 style=\"color: red; width:100vw; padding:0; margin: 0;text-align: center;\">This game currently cannot be played on mobile. Mobile support will be added later.</h2><br>");
                        $newBody
                            .css('display', 'flex')
                            .css('justify-content', 'center')
                            .css('align-content', 'center')
                            .css('height', '100vh');
                        $('#root').append($newBody);
                        return [2 /*return*/];
                    }
                    // fetch all students
                    return [4 /*yield*/, fetch('assets/students.json').then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, response.json()];
                                    case 1:
                                        ALL_STUDENTS = _a.sent();
                                        console.log("main -- loaded ".concat(Object.keys(ALL_STUDENTS).length, " students"));
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // fetch all students
                    _a.sent();
                    sel = ALL_STUDENTS['shiroko (riding)'];
                    sel.name = 'shiroko (riding)';
                    sel.comfort = {
                        city: sel.city,
                        desert: sel.desert,
                        indoor: sel.indoor,
                    };
                    GAME_STATE = {
                        solution_student: sel,
                        guesses: []
                    };
                    // add listener for search bar
                    $('#entry').on('input', function () {
                        // console.log(ev);
                        // console.log($('#entry').val());
                        var value = $('#entry').val().toLowerCase();
                        if (value == '') {
                            $('#did-you-mean').text('start typing to get results...');
                            $('#entry').removeClass('search-found');
                            $('#entry').removeClass('search-not-found');
                            return;
                        }
                        if (!$('#entry').hasClass('search-not-found'))
                            $('#entry').addClass('search-not-found');
                        var results = 'did you mean...<br>';
                        for (var key in ALL_STUDENTS) {
                            if (key.includes(value)) {
                                results += key + ', ';
                            }
                            if (value == key) {
                                console.log('match found!');
                                $('#entry').removeClass('search-not-found');
                                $('#entry').addClass('search-found');
                            }
                        }
                        if (results == 'did you mean...<br>')
                            results = 'no matches found';
                        $('#did-you-mean').html(results);
                    });
                    // enter button listener
                    $('#submit').on('click', function () {
                        DoEntry();
                    });
                    $(document).on('keydown', function (ev) {
                        if ($('#entry').is(':focus') && ev.key == 'Enter')
                            DoEntry();
                    });
                    return [2 /*return*/];
            }
        });
    });
});
