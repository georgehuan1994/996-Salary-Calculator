let computing_mode = 965; // 965, 995, 995.5, 996, 0
let is_single_week = true; // 是否为单周模式

let expected_year_salary = 300000; // 期望年薪，按 965 计算
let standard_monthly_rate = 1; // 标准月薪，按 12 月计算
let standard_hourly_rate = 1; // 标准时薪，按 965 计算

let s_mon = 8;
let s_tue = 8;
let s_wed = 8;
let s_thu = 8;
let s_fri = 8;
let s_sat = 0;
let s_sun = 0;

let d_mon = 8;
let d_tue = 8;
let d_wed = 8;
let d_thu = 8;
let d_fri = 8;
let d_sat = 0;
let d_sun = 0;

let work_day_hours_normal = 0; // 工作日正常工时
let work_day_hours_overtime = 0; // 工作日加班工时
let week_day_hours = 0; // 休息日工时
let how_many_month_get_paid = 12; // 全年发放/月
let deserved_year_salary = 0; // 应得年薪
let deserved_month_salary = 0; // 应得月薪
let enterprise_provident_fund_deposit_ratio = 5; // 公积金缴存比例 (公司)
let enterprise_provident_fund_deposit_base = 5000; // 公积金缴存基数 (公司)

let corrected_month_salary = 0; // 补正月薪


$(window).ready(function(){
    set_working_days(computing_mode);
});

function set_working_days(mode) {
    computing_mode = mode;
    if (computing_mode === 965) {
        show_double_week(false);
        set_progress($('#s-mon'), s_mon = 9);
        set_progress($('#s-tue'), s_tue = 9);
        set_progress($('#s-wed'), s_wed = 9);
        set_progress($('#s-thu'), s_thu = 9);
        set_progress($('#s-fri'), s_fri = 9);
        set_progress($('#s-sat'), s_sat = 0);
        set_progress($('#s-sun'), s_sun = 0);

        set_progress($('#d-mon'), d_mon = 9);
        set_progress($('#d-tue'), d_tue = 9);
        set_progress($('#d-wed'), d_wed = 9);
        set_progress($('#d-thu'), d_thu = 9);
        set_progress($('#d-fri'), d_fri = 9);
        set_progress($('#d-sat'), d_sat = 0);
        set_progress($('#d-sun'), d_sun = 0);
    }
    if (computing_mode === 995) {
        show_double_week(false);
        set_progress($('#s-mon'), s_mon = 12);
        set_progress($('#s-tue'), s_tue = 12);
        set_progress($('#s-wed'), s_wed = 12);
        set_progress($('#s-thu'), s_thu = 12);
        set_progress($('#s-fri'), s_fri = 12);
        set_progress($('#s-sat'), s_sat = 0);
        set_progress($('#s-sun'), s_sun = 0);

        set_progress($('#d-mon'), d_mon = 12);
        set_progress($('#d-tue'), d_tue = 12);
        set_progress($('#d-wed'), d_wed = 12);
        set_progress($('#d-thu'), d_thu = 12);
        set_progress($('#d-fri'), d_fri = 12);
        set_progress($('#d-sat'), d_sat = 0);
        set_progress($('#d-sun'), d_sun = 0);
    }
    if (computing_mode === 995.5) {
        show_double_week(true);
        set_progress($('#s-mon'), s_mon = 12);
        set_progress($('#s-tue'), s_tue = 12);
        set_progress($('#s-wed'), s_wed = 12);
        set_progress($('#s-thu'), s_thu = 12);
        set_progress($('#s-fri'), s_fri = 12);
        set_progress($('#s-sat'), s_sat = 12);
        set_progress($('#s-sun'), s_sun = 0);

        set_progress($('#d-mon'), d_mon = 12);
        set_progress($('#d-tue'), d_tue = 12);
        set_progress($('#d-wed'), d_wed = 12);
        set_progress($('#d-thu'), d_thu = 12);
        set_progress($('#d-fri'), d_fri = 12);
        set_progress($('#d-sat'), d_sat = 0);
        set_progress($('#d-sun'), d_sun = 0);
    }

    if (computing_mode === 996) {
        show_double_week(false);
        set_progress($('#s-mon'), s_mon = 12);
        set_progress($('#s-tue'), s_tue = 12);
        set_progress($('#s-wed'), s_wed = 12);
        set_progress($('#s-thu'), s_thu = 12);
        set_progress($('#s-fri'), s_fri = 12);
        set_progress($('#s-sat'), s_sat = 12);
        set_progress($('#s-sun'), s_sun = 0);

        set_progress($('#d-mon'), d_mon = 12);
        set_progress($('#d-tue'), d_tue = 12);
        set_progress($('#d-wed'), d_wed = 12);
        set_progress($('#d-thu'), d_thu = 12);
        set_progress($('#d-fri'), d_fri = 12);
        set_progress($('#d-sat'), d_sat = 12);
        set_progress($('#d-sun'), d_sun = 0);
    }

    calc();
}

function calc() {
    s_mon = parseInt($('#s-mon').attr('aria-valuenow'));
    s_tue = parseInt($('#s-tue').attr('aria-valuenow'));
    s_wed = parseInt($('#s-wed').attr('aria-valuenow'));
    s_thu = parseInt($('#s-thu').attr('aria-valuenow'));
    s_fri = parseInt($('#s-fri').attr('aria-valuenow'));
    s_sat = parseInt($('#s-sat').attr('aria-valuenow'));
    s_sun = parseInt($('#s-sun').attr('aria-valuenow'));

    d_mon = parseInt($('#d-mon').attr('aria-valuenow'));
    d_tue = parseInt($('#d-tue').attr('aria-valuenow'));
    d_wed = parseInt($('#d-wed').attr('aria-valuenow'));
    d_thu = parseInt($('#d-thu').attr('aria-valuenow'));
    d_fri = parseInt($('#d-fri').attr('aria-valuenow'));
    d_sat = parseInt($('#d-sat').attr('aria-valuenow'));
    d_sun = parseInt($('#d-sun').attr('aria-valuenow'));

    if (is_single_week){
        let _WorkDayHourTotal = s_mon + s_tue + s_wed + s_thu + s_fri;
        work_day_hours_normal = (_WorkDayHourTotal<=45 ? _WorkDayHourTotal : 45) * 50;
        work_day_hours_overtime = _WorkDayHourTotal * 50 - work_day_hours_normal;
        week_day_hours = (s_sat + s_sun) * 50;
        $('#workday-hours-normal').text(work_day_hours_normal);
        $('#workday-hours-overtime').text(work_day_hours_overtime);
        $('#weekday-hours').text(week_day_hours);
    }
    else {
        let _WorkDayHourTotal = s_mon + s_tue + s_wed + s_thu + s_fri + d_mon + d_tue + d_wed + d_thu + d_fri;
        work_day_hours_normal = (_WorkDayHourTotal<=90 ? _WorkDayHourTotal : 80) * 25;
        work_day_hours_overtime = _WorkDayHourTotal * 25 - work_day_hours_normal;
        week_day_hours = (s_sat + s_sun + d_sat + d_sun) * 25;
        $('#workday-hours-normal').text(work_day_hours_normal);
        $('#workday-hours-overtime').text(work_day_hours_overtime);
        $('#weekday-hours').text(week_day_hours);
    }

    if ($('#expected-year-salary').val() != '') {
        expected_year_salary = parseInt($('#expected-year-salary').val());
    }

    standard_monthly_rate = expected_year_salary / 12;
    standard_hourly_rate = expected_year_salary / (9 * 5 * 50);
    $('#standard-hourly-rate').text(standard_hourly_rate.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));
    $('#standard-monthly-rate').text(standard_monthly_rate.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));

    deserved_year_salary = standard_hourly_rate * (work_day_hours_normal + work_day_hours_overtime * 1.5 + week_day_hours * 2);
    $('#deserved-year-salary').text(deserved_year_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));


    if ($('#how-many-month-paid').val() != '') {
        how_many_month_get_paid = Number($('#how-many-month-paid').val());
    }

    deserved_month_salary = deserved_year_salary / how_many_month_get_paid;
    $('#deserved-month-salary').text(deserved_month_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));

    if ($('#enterprise-provident-fund-deposit-ratio').val() != '') {
        enterprise_provident_fund_deposit_ratio = parseInt($('#enterprise-provident-fund-deposit-ratio').val());
    }

    if ($('#enterprise-provident-fund-deposit-base').val() != '') {
        enterprise_provident_fund_deposit_base = parseInt($('#enterprise-provident-fund-deposit-base').val());
    }

    if ($('#is-same-fund-base').prop('checked')) {
        enterprise_provident_fund_deposit_base = corrected_month_salary = deserved_month_salary;
        corrected_month_salary = deserved_month_salary + enterprise_provident_fund_deposit_base * (12 - enterprise_provident_fund_deposit_ratio) / 100
        $('#enterprise-provident-fund-deposit-base').prop({'disabled':true,'placeholder':enterprise_provident_fund_deposit_base.toFixed(0),'value':deserved_month_salary.toFixed(2)});
    }
    else {
        corrected_month_salary = deserved_month_salary + enterprise_provident_fund_deposit_base * (12 - enterprise_provident_fund_deposit_ratio) / 100 + (deserved_month_salary - enterprise_provident_fund_deposit_base) * 0.12;
        $('#enterprise-provident-fund-deposit-base').prop({'disabled':false});
    }

    $('#corrected-month-salary').text(corrected_month_salary.toLocaleString('zh', {style:'currency', currency: 'CNY', minimumFractionDigits: 2}));
}

function check_expected_year_salary() {
    if (parseInt($('#expected-year-salary').val()) < 25200 ) {
        $('#expected-year-salary').val(25200);
        expected_year_salary = 25200;
    }
}

function set_expected_year_salary(value) {
    if ($('#expected-year-salary').val() == '') {
        expected_year_salary = parseInt($('#expected-year-salary').attr('placeholder'));
    }
    expected_year_salary += value;
    if (expected_year_salary < 25200 ) {
        expected_year_salary = 25200;
    }
    $('#expected-year-salary').val(expected_year_salary);
}

function set_progress(id, value) {
    id.attr('aria-valuenow', value);
    id.css('height',toPercent(value / 24));
    id.children("p").text(value);
    set_progress_color(id,value);
}

function add_progress(id) {
    $('#custom').prop("checked",true);
    let now = parseInt(id.attr('aria-valuenow'));
    if (now >= 24) {
        set_progress(id, 24);
    }
    else {
        now = now + 1
        set_progress(id, now);
    }
    calc();
}

function reduce_progress(id) {
    $('#custom').prop("checked",true);
    let now = parseInt(id.attr('aria-valuenow'));
    if (now <= 0) {
        set_progress(id, 0);
    }
    else {
        now = now - 1
        set_progress(id, now);
    }
    calc();
}

function toPercent(point) {
    let str = Number(point * 100).toFixed(2);
    str += "%";
    return str;
}

function set_progress_color(id,value) {
    // progress color
    if (value >= 12) {
        id.css('background-color','#f0ad4e');
    }
    else if (value >= 8) {
        id.css('background-color','#5bc0de');
    }
    else {
        id.css('background-color','#5cb85c');
    }

    $('#s-sat').css('background-color','#d9534f');
    $('#s-sun').css('background-color','#d9534f');
    $('#d-sat').css('background-color','#d9534f');
    $('#d-sun').css('background-color','#d9534f');

    // text color
    if (value > 5) {
        id.children("p").css('color','#fff');
    }
    else {
        id.children("p").css('color','#24292f');
    }
}

function show_double_week(b) {
    if (b) {
        is_single_week = false;
        $('#double-week').removeClass('hidden');
        $('#single-week-tab').removeClass('active');
        $('#double-week-tab').addClass('active');
    }
    else {
        is_single_week = true;
        $('#double-week').addClass('hidden');
        $('#single-week-tab').addClass('active');
        $('#double-week-tab').removeClass('active');
    }
}